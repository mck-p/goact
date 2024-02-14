package main

import (
	"context"
	"log/slog"
	"mck-p/goact/connections"
	"mck-p/goact/server"
	"mck-p/goact/utils"
	"os"
	"os/signal"
	"syscall"

	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load()

	if err != nil {
		slog.Warn("Error loading .env file", slog.Any("error", err))
		panic(err)
	}

	connections.Connections.Connect(context.Background())
}

func main() {
	slog.Debug("Starting up. Hello!")
	srv := server.New(server.GenerateRoutes())
	port, err := utils.GetenvInt("PORT")

	if err != nil {
		port = 8080
		slog.Warn("We failed to get the port. Setting to default", slog.Int("port", port))
	}

	shutdownChan := make(chan os.Signal, 1)
	signal.Notify(shutdownChan, os.Interrupt, syscall.SIGTERM, syscall.SIGABRT, syscall.SIGINT)

	go func() {
		if err = srv.Start(port); err != nil {
			slog.Warn("We got an error from server running/starting", slog.Any("error", err))
		}
	}()

	<-shutdownChan

	slog.Debug("Shutting Down.")
	srv.Stop()
	connections.Connections.Disconnect(context.Background())
	slog.Debug("Goodbye!")
}
