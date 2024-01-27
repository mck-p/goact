package domains

import (
	"context"
	"log/slog"
	"mck-p/goact/tracer"
	"sync"
)

/**
Shared Types
*/

type Action string

type Payload map[string]interface{}

type Metadata map[string]interface{}

type Command struct {
	Id       string   `json:"id"`
	Action   Action   `json:"action"`
	Payload  Payload  `json:"payload"`
	Metadata Metadata `json:"metadata"`
	CTX      context.Context
	Dispatch func(Command)
}

type Domain interface {
	ShouldHandle(Action) bool
	Process(Command, *sync.WaitGroup) error
}

type IDomains struct{}

var Domains = IDomains{}

func (domains *IDomains) Process(cmd Command) {
	var wg sync.WaitGroup
	_, span := tracer.Tracer.Start(cmd.CTX, "Domains::Process")
	defer span.End()

	slog.Info("Processing command", slog.String("id", cmd.Id))

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
