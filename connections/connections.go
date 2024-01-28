package connections

import (
	"context"
	"log/slog"
	"mck-p/goact/tracer"
)

type Connection struct{}

var Connections = &Connection{}

func (connections *Connection) Connect() {
	slog.Debug("Connections connecting")
	Cache.Connect()
	Database.Connect()
	Subscriptions.Connect()
}

func (connections *Connection) Healthy(ctx context.Context) (bool, error) {
	_, span := tracer.Tracer.Start(ctx, "Connections::Healthy")
	defer span.End()

	cacheIsHealthyCmd := IsHealthyCmd{
		CTX: ctx,
	}

	return Cache.IsHealthy(cacheIsHealthyCmd)
}
