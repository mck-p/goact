package domains

import (
	"context"
	"fmt"
	"log/slog"
	"mck-p/goact/authorization"
	"mck-p/goact/commands"
	"mck-p/goact/connections"
	"mck-p/goact/data"
	"mck-p/goact/tracer"
	"sync"

	"github.com/mdobak/go-xerrors"
)

const (
	SendMessage string = "@@MESSAGES/SEND"
	EchoMessage string = "@@MESSAGES/ECHO"
	SaveMessage string = "@@MESSAGES/SAVE"
)

type MessageDomain struct{}

var Messages = &MessageDomain{}

func (messages *MessageDomain) ShouldHandle(action string) bool {
	return action == SendMessage || action == EchoMessage || action == SaveMessage
}

func MessageToTopic(actorId string) string {
	return fmt.Sprintf("message::to::%s", actorId)
}

func (messages *MessageDomain) Process(cmd Command, wg *sync.WaitGroup) error {
	_, span := tracer.Tracer.Start(cmd.CTX, "Domains::Messages::Process")
	defer span.End()
	defer wg.Done()

	slog.Info("Handling Message command", slog.Any("command", cmd.Id), slog.String("action", cmd.Action))

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
		canSendMessageToGroup := authorization.CanPerformAction(
			cmd.ActorId,
			fmt.Sprintf("group::%s", cmd.Payload["receiverId"].(string)),
			"send",
		)

		if !canSendMessageToGroup {
			return xerrors.New("%s does not have permissions to send message to group %s", cmd.ActorId, cmd.Payload["receiverId"].(string))
		}

		err := connections.Cache.Publish(commands.PublishCmd{
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

		if err != nil {
			slog.Warn("Error publishg", slog.Any("error", err))
			return err
		}
	case SaveMessage:
		canSaveMessageToGroup := authorization.CanPerformAction(
			cmd.ActorId,
			fmt.Sprintf("group::%s", cmd.Payload["groupId"].(string)),
			"save",
		)

		if !canSaveMessageToGroup {
			return xerrors.New("%s does not have permissions to save message to group %s", cmd.ActorId, cmd.Payload["groupId"].(string))
		}

		msg, err := data.Messages.SaveMessage(data.NewMessage{
			AuthorId: cmd.ActorId,
			Message:  cmd.Payload["message"].(string),
			GroupId:  cmd.Payload["groupId"].(string),
			Id:       cmd.Id,
		})

		if err != nil {
			slog.Warn("error when trying to save message", slog.Any("error", err))
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
					Action:  SendMessage,
					ActorId: cmd.ActorId,
					Payload: commands.Payload{
						"receiverId": userId,
						"message":    cmd.Payload["message"].(string),
					},
					Metadata:         cmd.Metadata,
					CTX:              context.Background(),
					DispatchOutgoing: cmd.DispatchOutgoing,
				})
			}(user.Id)
		}

	}

	return nil
}
