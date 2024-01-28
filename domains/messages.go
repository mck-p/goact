package domains

import (
	"fmt"
	"log/slog"
	"mck-p/goact/commands"
	"mck-p/goact/connections"
	"mck-p/goact/tracer"
	"sync"
)

const (
	SendMessage string = "@@MESSAGES/SEND"
	EchoMessage string = "@@MESSAGES/ECHO"
)

type MessageDomain struct{}

var Messages = &MessageDomain{}

func (messages *MessageDomain) ShouldHandle(action string) bool {
	return action == SendMessage || action == EchoMessage
}

func MessageToTopic(actorId string) string {
	return fmt.Sprintf("message::to::%s", actorId)
}

func (messages *MessageDomain) Process(cmd Command, wg *sync.WaitGroup) error {
	_, span := tracer.Tracer.Start(cmd.CTX, "Domains::Messages::Process")
	defer span.End()
	defer wg.Done()

	slog.Info("Handling Message command", slog.Any("command", cmd.Id))

	if cmd.Action == EchoMessage {
		// I need to send a "message::to::userId" message to
		// our cache/pubsub client that has this information
		connections.Cache.Publish(commands.PublishCmd{
			CTX:   cmd.CTX,
			Topic: MessageToTopic(cmd.ActorId),
			Data: commands.PubSubCommand{
				Id:       cmd.Id,
				ActorId:  cmd.ActorId,
				Action:   cmd.Action,
				Payload:  cmd.Payload,
				Metadata: cmd.Metadata,
			},
		})
	}

	if cmd.Action == SendMessage {
		connections.Cache.Publish(commands.PublishCmd{
			CTX:   cmd.CTX,
			Topic: MessageToTopic(cmd.Payload["receiverId"].(string)),
			Data: commands.PubSubCommand{
				Id:       cmd.Id,
				ActorId:  cmd.ActorId,
				Action:   cmd.Action,
				Metadata: cmd.Metadata,
				Payload:  cmd.Payload,
			},
		})
	}

	return nil
}
