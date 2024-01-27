package connections

import (
	"context"

	"github.com/redis/go-redis/v9"
)

type Subscription struct {
	Topic        string
	Subscribed   bool
	subscription *redis.PubSub
}

type ISubscriptions struct {
	currentSubscriptions map[string]Subscription
	hasSubscribed        bool
}

var Subscriptions = &ISubscriptions{}

func (subscriptions *ISubscriptions) Subscribe(ctx context.Context, topic string) {
	_, exists := subscriptions.currentSubscriptions[topic]

	if exists {
		// we already have a listener for this subscription so
		// we don't need to do anything
		return
	}

	// we've already been asked to subscribe to all the topics
	// so let's go ahread and subscribe for this thing immediately
	if subscriptions.hasSubscribed {
		// we aren't subscribed to this
		subscriptions.subscribe(ctx, topic)
	} else {
		// we haven't been told to subscribe
		subscriptions.register(ctx, topic)
	}
}

func (subscriptions *ISubscriptions) subscribe(ctx context.Context, topic string) {
	pubsub := Cache.Subscribe(SubscribeCmd{
		CTX:   ctx,
		Topic: topic,
	})

	subscriptions.currentSubscriptions[topic] = Subscription{
		subscription: pubsub,
		Subscribed:   true,
		Topic:        topic,
	}
}

func (subscriptions *ISubscriptions) register(ctx context.Context, topic string) {
	subscriptions.currentSubscriptions[topic] = Subscription{
		Topic:      topic,
		Subscribed: false,
	}
}
