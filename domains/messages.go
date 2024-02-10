package domains

import (
	"fmt"
	"log/slog"
	"mck-p/goact/commands"
	"mck-p/goact/connections"
	"mck-p/goact/data"
	"mck-p/goact/tracer"
	"sync"
)

const (
	SendMessage string = "@@MESSAGES/SEND"
	EchoMessage string = "@@MESSAGES/ECHO"
	SaveMessage string = "@@MESSAGES/SAVE"
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

	switch cmd.Action {
	case EchoMessage:
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
	case SendMessage:
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
	case SaveMessage:
		msg, err := data.Messages.SaveMessage(data.NewMessage{
			AuthorId: cmd.ActorId,
			Message:  cmd.Payload["message"].(string),
			GroupId:  cmd.Payload["groupId"].(string),
		})

		if err != nil {
			return err
		}

		members, err := data.Messages.GetMembersForGroup(data.GroupMebersQuery{
			GroupId: msg.GroupId,
		})

		if err != nil {
			return err
		}

		// for each member of the group
		for _, user := range members {

			// in a goroutine
			go func(userId string) {
				// dispatch a send event so that if anyone
				// is connected they will receive the websocket
				// message
				cmd.Dispatch(Command{
					Id:      fmt.Sprintf("sub::%s", cmd.Id),
					ActorId: SendMessage,
					Payload: commands.Payload{
						"recieverId": userId,
					},
					Metadata:         cmd.Metadata,
					CTX:              cmd.CTX,
					DispatchOutgoing: cmd.DispatchOutgoing,
				})
			}(user.Id)
		}

	}

	return nil
}
