package connections

import (
	"context"
	"log/slog"
	"mck-p/goact/tracer"
)

type Connection struct{}

var Connections = &Connection{}

func (connections *Connection) Connect(ctx context.Context) {
	_, span := tracer.Tracer.Start(ctx, "Connections::Connect")
	defer span.End()

	slog.Debug("Connections connecting")

	Cache.Connect(ctx)
	Database.Connect(ctx)
	Subscriptions.Connect(ctx)

	slog.Debug("Connections connected")
}

func (connections *Connection) Disconnect(ctx context.Context) {
	_, span := tracer.Tracer.Start(ctx, "Connections::Disconnect")
	defer span.End()

	slog.Debug("Connections disconnecting")

	Subscriptions.Disconnect(ctx)
	Database.Disconnect(ctx)
	Cache.Disconnect(ctx)

	slog.Debug("Connections disconnected")
}

func (connections *Connection) Healthy(ctx context.Context) (bool, error) {
	_, span := tracer.Tracer.Start(ctx, "Connections::Healthy")
	defer span.End()

	cacheIsHealthyCmd := IsHealthyCmd{
		CTX: ctx,
	}

	return Cache.IsHealthy(cacheIsHealthyCmd)
}
