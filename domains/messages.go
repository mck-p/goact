package domains

import (
	"log/slog"
	"mck-p/goact/tracer"
	"sync"
)

const (
	SendMessage Action = "@@MESSAGES/SEND"
	EchoMessage Action = "@@MESSAGES/ECHO"
)

type MessageDomain struct{}

var Messages = &MessageDomain{}

func (messages *MessageDomain) ShouldHandle(action Action) bool {
	return action == SendMessage || action == EchoMessage
}

func (messages *MessageDomain) Process(cmd Command, wg *sync.WaitGroup) error {
	_, span := tracer.Tracer.Start(cmd.CTX, "Domains::Messages::Process")
	defer span.End()
	defer wg.Done()

	slog.Info("Handling Message command", slog.Any("command", cmd.Id))

	if cmd.Action == EchoMessage {
		cmd.Dispatch(Command{
			Action:   EchoMessage,
			Payload:  cmd.Payload,
			Metadata: cmd.Metadata,
		})
	}

	return nil
}
