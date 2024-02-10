package domains

import (
	"context"
	"log/slog"
	"mck-p/goact/commands"
	"mck-p/goact/tracer"
	"sync"
)

/**
Shared Types
*/

type Command struct {
	Id               string            `json:"id"`
	ActorId          string            `json:"actor_id"`
	Action           string            `json:"action"`
	Payload          commands.Payload  `json:"payload"`
	Metadata         commands.Metadata `json:"metadata"`
	CTX              context.Context
	DispatchOutgoing func(Command)
}

type Domain interface {
	ShouldHandle(string) bool
	Process(Command, *sync.WaitGroup) error
}

type IDomains struct{}

var Domains = IDomains{}

func (command *Command) Dispatch(cmd Command) {
	go Domains.Process(cmd)
}

func (domains *IDomains) Process(cmd Command) {
	var wg sync.WaitGroup
	_, span := tracer.Tracer.Start(cmd.CTX, "Domains::Process")
	defer span.End()

	slog.Info("Processing command", slog.String("id", cmd.Id), slog.String("action", cmd.Action))

	if Messages.ShouldHandle(cmd.Action) {
		wg.Add(1)
		go Messages.Process(cmd, &wg)
	}

	if Internal.ShouldHandle(cmd.Action) {
		wg.Add(1)
		go Internal.Process(cmd, &wg)
	}

	wg.Wait()
	slog.Info("Processing complete", slog.String("id", cmd.Id))
}
