package data

import (
	"context"
	"mck-p/goact/connections"
)

type IFiles struct{}

var Files = &IFiles{}

type GetFileURL struct {
	Bucket string
	Key    string
}

func (files *IFiles) getFileURL(query GetFileURL) (string, error) {
	return connections.Storage.CreateReadURL(connections.CreateReadURLCmd{
		Bucket: query.Bucket,
		Key:    query.Key,
		CTX:    context.Background(),
	})
}

type GetSaveFileURL struct {
	Bucket string
	Key    string
}

func (files *IFiles) getSaveFileURL(query GetSaveFileURL) (string, error) {
	return connections.Storage.CreateUploadURL(connections.CreateUploadURLCmd{
		Bucket: query.Bucket,
		Key:    query.Key,
		CTX:    context.Background(),
	})
}

func (files *IFiles) GetAvatarReadURL(filename string) (string, error) {
	return files.getFileURL(GetFileURL{
		Bucket: "user-generated",
		Key:    filename,
	})
}

func (files *IFiles) GetAvatarSaveURL(filename string) (string, error) {
	return files.getSaveFileURL(GetSaveFileURL{
		Bucket: "user-generated",
		Key:    filename,
	})
}
