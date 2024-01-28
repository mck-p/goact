package connections

import (
	"context"
	"encoding/json"
	"log/slog"
	"mck-p/goact/commands"
	"mck-p/goact/tracer"

	"time"

	"github.com/redis/go-redis/v9"
)

type CacheConnection struct {
	conn *redis.Client
}

var Cache = &CacheConnection{}

func (cache *CacheConnection) Connect() {
	slog.Debug("We are connecting to the Cache connection")
	cache.conn = redis.NewClient(&redis.Options{
		Addr:     "0.0.0.0:9999",
		Password: "ou812",
	})
}

type GetCommand struct {
	Key string
	CTX context.Context
}

func (cache *CacheConnection) Get(cmd GetCommand) (string, error) {
	_, span := tracer.Tracer.Start(cmd.CTX, "Cache::Get")
	defer span.End()

	return cache.conn.Get(cmd.CTX, cmd.Key).Result()
}

type SetCommand struct {
	Key   string
	Value string
	TTL   time.Duration
	CTX   context.Context
}

func (cache *CacheConnection) Set(cmd SetCommand) (string, error) {
	_, span := tracer.Tracer.Start(cmd.CTX, "Cache::Set")
	defer span.End()

	return cache.conn.Set(cmd.CTX, cmd.Key, cmd.Value, cmd.TTL).Result()
}

type KeyExistCommand struct {
	Key string
	CTX context.Context
}

func (cache *CacheConnection) KeyExists(cmd KeyExistCommand) (bool, error) {
	_, span := tracer.Tracer.Start(cmd.CTX, "Cache::KeyExists")
	defer span.End()

	value, err := cache.conn.Exists(cmd.CTX, cmd.Key).Result()

	return value != 0, err
}

type IsHealthyCmd struct {
	CTX context.Context
}

func (cache *CacheConnection) IsHealthy(cmd IsHealthyCmd) (bool, error) {
	_, span := tracer.Tracer.Start(cmd.CTX, "Cache::IsHealthy")
	defer span.End()

	_, err := cache.conn.Ping(cmd.CTX).Result()

	if err != nil {
		return false, err
	}

	return true, nil
}

type SubscribeCmd struct {
	Topic string
	CTX   context.Context
}

func (cache *CacheConnection) Subscribe(cmd SubscribeCmd) *redis.PubSub {
	_, span := tracer.Tracer.Start(cmd.CTX, "Cache::Subscribe")
	defer span.End()

	subscription := cache.conn.Subscribe(cmd.CTX, cmd.Topic)

	return subscription
}

func (cache *CacheConnection) Publish(cmd commands.PublishCmd) error {
	_, span := tracer.Tracer.Start(cmd.CTX, "Cache::Subscribe")
	defer span.End()

	if cache.conn != nil {
		slog.Debug("Publishing message", slog.Any("data", cmd.Data), slog.String("topic", cmd.Topic))
		body, err := json.Marshal(cmd.Data)

		if err != nil {
			return err
		}

		return cache.conn.Publish(cmd.CTX, cmd.Topic, body).Err()
	}

	return nil
}
