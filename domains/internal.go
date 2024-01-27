package domains

import (
	"log/slog"
	"mck-p/goact/tracer"
	"sync"
)

const (
	Hello   Action = "@@INTERNAL/HELLO"
	ISeeYou Action = "@@INTERNAL/ISEEYOU"
)

type InternalDomain struct{}

var Internal = &InternalDomain{}

func (messages *InternalDomain) ShouldHandle(action Action) bool {
	return action == Hello
}

func (messages *InternalDomain) Process(cmd Command, wg *sync.WaitGroup) error {
	_, span := tracer.Tracer.Start(cmd.CTX, "Domains::Internal::Process")
	defer span.End()
	defer wg.Done()

	slog.Info("Handling internal message", slog.Any("command", cmd.Id))

	cmd.Dispatch(Command{
		Action:   ISeeYou,
		Payload:  Payload{},
		Metadata: Metadata{},
	})

	return nil
}
