package usecases

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"mck-p/goact/commands"
	"mck-p/goact/connections"
	"mck-p/goact/data"
	"mck-p/goact/domains"
	"mck-p/goact/tracer"
	"time"

	"github.com/google/uuid"
)

type UseCase struct{}

var UseCases = &UseCase{}

func (usecases *UseCase) GetWeather(ctx context.Context, query string) (data.ForecastQueryUpstreamResponse, error) {
	_, span := tracer.Tracer.Start(ctx, "UseCases::GetWeather")

	defer span.End()

	slog.Debug("Getting the weather", slog.String("query", query))

	key := fmt.Sprintf("@@weather::query::%s", query)

	exists, err := connections.Cache.KeyExists(connections.KeyExistCommand{
		Key: key,
		CTX: ctx,
	})

	if err != nil {
		return data.ForecastQueryUpstreamResponse{}, err
	}

	if exists {
		slog.Debug("Weather exists in cache. Parsing and returning", slog.String("query", query))

		cmd := connections.GetCommand{
			Key: key,
			CTX: ctx,
		}

		str, err := connections.Cache.Get(cmd)
		payload := data.ForecastQueryUpstreamResponse{}
		json.Unmarshal([]byte(str), &payload)

		if err != nil {
			return data.ForecastQueryUpstreamResponse{}, err
		}

		return payload, nil
	}

	slog.Debug("Weather not in cache. Requesting", slog.String("query", query))

	weather, err := data.Weather.TodaysForecast(query)

	if err != nil {
		return data.ForecastQueryUpstreamResponse{}, err
	}

	parsed, err := json.Marshal(weather)

	if err != nil {
		return data.ForecastQueryUpstreamResponse{}, err
	}

	str := string(parsed)

	_, err = connections.Cache.Set(connections.SetCommand{
		Key:   key,
		Value: str,
		TTL:   time.Minute * 60,
		CTX:   ctx,
	})

	return *weather, err
}

type ProcessUerCreateWebhookCmd struct {
	Repository *data.UserData
	Webhook    data.AuthEvent[data.UserCreatedEventData]
}

func (usecases *UseCase) ProcessUserCreatedWebhook(cmd ProcessUerCreateWebhookCmd) error {
	_, err := cmd.Repository.CreateUser(data.CreateUserCmd{
		ExternalId: cmd.Webhook.Data.Id,
		Connection: connections.Database,
	})

	if err != nil {
		slog.Warn("We could not handle the user creation webhook.", slog.Any("error", err), slog.String("external-id", cmd.Webhook.Data.Id))
	} else {
		slog.Debug("Handled a new webhook successfully")
	}

	return err
}

type GetUserByExternalIdRequest struct {
	Repository *data.UserData
	ExternalId string
}

type GetUserByExternalIdResponse struct {
	User *data.User `json:"user"`
}

func (usecases *UseCase) GetUserByExternalId(req GetUserByExternalIdRequest) (*GetUserByExternalIdResponse, error) {
	value, err := req.Repository.GetUserByExternalId(req.ExternalId)

	return &GetUserByExternalIdResponse{
		User: value,
	}, err
}

type AuthWebhookCmd struct {
	CTX     context.Context
	Webhook map[string]interface{}
}

func (usecases *UseCase) ProcessAuthWebhook(cmd AuthWebhookCmd, rawBody []byte) error {
	_, span := tracer.Tracer.Start(cmd.CTX, "UseCases::ProcessAuthWebhook")
	defer span.End()

	baseCommand := cmd.Webhook

	switch baseCommand["type"] {
	case "user.created":
		createdCmd := data.AuthEvent[data.UserCreatedEventData]{}

		err := json.Unmarshal(rawBody, &createdCmd)

		if err != nil {
			return err
		}

		slog.Info("We need to create a user", slog.Any("user", createdCmd))

		return usecases.ProcessUserCreatedWebhook(ProcessUerCreateWebhookCmd{
			Webhook:    createdCmd,
			Repository: data.Users,
		})
	default:
		slog.Warn("We got an Auth Webhook command that we do not know how to handle", slog.String("type", baseCommand["Type"].(string)))
	}

	// if cmd.Webhook.Type == "user.created" {
	// 	res = cmd.Webhook.(data.AuthEvent[data.UserCreatedEvent])
	// }

	return nil
}

type WebSocketMessageCmd struct {
	CTX      context.Context
	ActorId  string
	Action   string
	Payload  commands.Payload
	Metadata commands.Metadata
	Dispatch func(cmd WebSocketMessageCmd) error
}

func (usecases *UseCase) ProcessWebSocketMessage(cmd WebSocketMessageCmd) error {
	_, span := tracer.Tracer.Start(cmd.CTX, "UseCases::ProcessWebSocketMessage")
	defer span.End()

	ctx, cancel := context.WithCancel(cmd.CTX)

	defer cancel()

	processedAt := time.Now()

	if cmd.Metadata != nil {
		cmd.Metadata["processedAt"] = processedAt
	} else {
		cmd.Metadata = map[string]interface{}{
			"processedAt": processedAt,
		}
	}

	domains.Domains.Process(domains.Command{
		Id:       uuid.New().String(),
		Action:   cmd.Action,
		Payload:  cmd.Payload,
		Metadata: cmd.Metadata,
		CTX:      ctx,
		ActorId:  cmd.ActorId,
		DispatchOutgoing: func(outgoingCmd domains.Command) {
			cmd.Dispatch(WebSocketMessageCmd{
				CTX:      ctx,
				ActorId:  cmd.ActorId,
				Action:   outgoingCmd.Action,
				Payload:  outgoingCmd.Payload,
				Metadata: outgoingCmd.Metadata,
			})
		},
	})

	return nil
}

type SubscribeToUserMessagesCmd struct {
	CTX     context.Context
	ActorId string
}

func (usecases *UseCase) SubscribeToUserMessages(cmd SubscribeToUserMessagesCmd) <-chan commands.PubSubCommand {
	_, span := tracer.Tracer.Start(cmd.CTX, "UseCases::SubscribeToUserMessages")
	defer span.End()
	key := fmt.Sprintf("message::to::%s", cmd.ActorId)
	slog.Info("Subscribing", slog.String("key", key))

	return connections.Subscriptions.Subscribe(cmd.CTX, key)
}

type UnsubscribeToUserMessagesCmd struct {
	CTX     context.Context
	ActorId string
}

func (usecases *UseCase) UnsubscribeFromUserMessages(cmd UnsubscribeToUserMessagesCmd) {
	_, span := tracer.Tracer.Start(cmd.CTX, "UseCases::UnsubscribeFromUserMessages")
	defer span.End()
	key := fmt.Sprintf("message::to::%s", cmd.ActorId)

	slog.Info("Unsubscribing", slog.String("key", key))

	connections.Subscriptions.Unsubscribe(cmd.CTX, key)
}
