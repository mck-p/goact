package connections

import (
	"context"
	"encoding/json"
	"log/slog"
	"mck-p/goact/commands"

	"github.com/redis/go-redis/v9"
)

type Subscription struct {
	Topic        string
	Subscribed   bool
	Subscription *redis.PubSub
}

type ISubscriptions struct {
	currentSubscriptions map[string]Subscription
	hasSubscribed        bool
}

var Subscriptions = &ISubscriptions{}

func (subscriptions *ISubscriptions) Connect() {
	slog.Debug("We are connecting to the Subscriptions connection")
	subscriptions.hasSubscribed = true
	subscriptions.currentSubscriptions = map[string]Subscription{}
}

func (subscriptions *ISubscriptions) Disconnect() {
	slog.Debug(("Disconnecting from the Subscriptions connection"))

	for key, subscription := range subscriptions.currentSubscriptions {
		subscription.Subscription.Close()

		delete(subscriptions.currentSubscriptions, key)
	}
}

func (subscriptions *ISubscriptions) Unsubscribe(ctx context.Context, topic string) {
	subscription, exists := subscriptions.currentSubscriptions[topic]

	if !exists {
		return
	}

	subscription.Subscription.Close()
}

func (subscriptions *ISubscriptions) Subscribe(ctx context.Context, topic string) <-chan commands.PubSubCommand {
	_, exists := subscriptions.currentSubscriptions[topic]

	if exists {
		// we already have a listener for this subscription so
		// we don't need to do anything
		return nil
	}

	pubsub := Cache.Subscribe(SubscribeCmd{
		CTX:   ctx,
		Topic: topic,
	})

	subscriptions.currentSubscriptions[topic] = Subscription{
		Topic:        topic,
		Subscribed:   true,
		Subscription: pubsub,
	}

	return subscriptions.handleMessagesFromTopic(pubsub)
}

func (suscriptions *ISubscriptions) handleMessagesFromTopic(pubsub *redis.PubSub) <-chan commands.PubSubCommand {
	channel := make(chan commands.PubSubCommand)

	go func() {
		ch := pubsub.Channel()

		for msg := range ch {
			payload := commands.PubSubCommand{}

			err := json.Unmarshal([]byte(msg.Payload), &payload)

			if err != nil {
				slog.Warn("Error trying to parse message from topic", slog.Any("error", err))
			}

			channel <- payload

		}
	}()

	return channel
}
