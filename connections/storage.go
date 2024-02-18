package connections

import (
	"context"
	"fmt"
	"log"
	"log/slog"
	"mck-p/goact/tracer"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/mdobak/go-xerrors"
)

type StorageConnection struct {
	conn *s3.Client
}

var Storage = &StorageConnection{}

func (storage *StorageConnection) Connect(ctx context.Context) error {
	_, span := tracer.Tracer.Start(ctx, "Connections::Storage::Connect")
	defer span.End()

	slog.Debug("We are connecting to the Storage connection")

	var accountId = os.Getenv("CLOUDFLARE_ACCOUNT_ID")
	if accountId == "" {
		return xerrors.New("missing required env CLOUDFLARE_ACCOUNT_ID")
	}

	var accessKeyId = os.Getenv("CLOUDFLARE_API_KEY")
	if accessKeyId == "" {
		return xerrors.New("missing required env CLOUDFLARE_API_KEY")
	}

	var accessKeySecret = os.Getenv("CLOUDFLARE_API_SECRET")
	if accessKeySecret == "" {
		return xerrors.New("missing required env CLOUDFLARE_API_SECRET")
	}

	r2Resolver := aws.EndpointResolverWithOptionsFunc(func(service, region string, options ...interface{}) (aws.Endpoint, error) {
		return aws.Endpoint{
			URL: fmt.Sprintf("https://%s.r2.cloudflarestorage.com", accountId),
		}, nil
	})

	cfg, err := config.LoadDefaultConfig(ctx,
		config.WithEndpointResolverWithOptions(r2Resolver),
		config.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(accessKeyId, accessKeySecret, "")),
		config.WithRegion("auto"),
	)

	if err != nil {
		log.Fatal(err)
	}

	client := s3.NewFromConfig(cfg)

	storage.conn = client

	return nil
}

func (storage *StorageConnection) Disconnect(ctx context.Context) {
	_, span := tracer.Tracer.Start(ctx, "Connections::Storage::Disconnect")
	defer span.End()

	storage.conn = nil
}

type CreateUploadURLCmd struct {
	Bucket string
	Key    string
	CTX    context.Context
}

func (storage *StorageConnection) CreateUploadURL(cmd CreateUploadURLCmd) (string, error) {
	presignClient := s3.NewPresignClient(storage.conn)
	presignResult, err := presignClient.PresignPutObject(cmd.CTX, &s3.PutObjectInput{
		Bucket: aws.String(cmd.Bucket),
		Key:    aws.String(cmd.Key),
	})

	return presignResult.URL, err
}

type CreateReadURLCmd struct {
	Bucket string
	Key    string
	CTX    context.Context
}

func (storage *StorageConnection) CreateReadURL(cmd CreateReadURLCmd) (string, error) {
	presignClient := s3.NewPresignClient(storage.conn)

	presignResult, err := presignClient.PresignGetObject(cmd.CTX, &s3.GetObjectInput{
		Bucket: aws.String(cmd.Bucket),
		Key:    aws.String(cmd.Key),
	})

	return presignResult.URL, err
}
