package domains

import (
	"log/slog"
	"mck-p/goact/commands"
	"mck-p/goact/tracer"
	"sync"
)

const (
	Hello   string = "@@INTERNAL/HELLO"
	ISeeYou string = "@@INTERNAL/ISEEYOU"
)

type InternalDomain struct{}

var Internal = &InternalDomain{}

func (messages *InternalDomain) ShouldHandle(action string) bool {
	return action == Hello
}

func (messages *InternalDomain) Process(cmd Command, wg *sync.WaitGroup) error {
	_, span := tracer.Tracer.Start(cmd.CTX, "Domains::Internal::Process")
	defer span.End()
	defer wg.Done()

	slog.Info("Handling internal message", slog.Any("command", cmd.Id))

	cmd.DispatchOutgoing(Command{
		Action:   ISeeYou,
		Payload:  commands.Payload{},
		Metadata: commands.Metadata{},
	})

	return nil
}
