package usecases

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"mck-p/goact/connections"
	"mck-p/goact/data"
	"mck-p/goact/tracer"
	"time"
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


func (usecases *UseCase) ProcessUserCreatedWebhook(webhook data.AuthEvent[data.UserCreatedEventData]) error {
	return nil
}

type AuthWebhookCmd struct {
	CTX context.Context
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
	
		return usecases.ProcessUserCreatedWebhook(createdCmd)
	default:
		slog.Warn("We got an Auth Webhook command that we do not know how to handle", slog.String("type", baseCommand["Type"].(string)))
	}

	// if cmd.Webhook.Type == "user.created" {
	// 	res = cmd.Webhook.(data.AuthEvent[data.UserCreatedEvent])
	// }

	return nil
}