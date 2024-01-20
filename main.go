package main

import (
	"log/slog"
	"mck-p/goact/connections"
	"mck-p/goact/server"
)

func init() {
	connections.Connections.Connect()
}

func main() {
	srv := server.New()

	err := srv.Start(8080)

	if err != nil {
		slog.Error("Error from Start", slog.Any("error", err))
	}
}
