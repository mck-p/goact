package main

import (
	"log/slog"
	"mck-p/goact/connections"
	"mck-p/goact/server"

	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load()

	if err != nil {
		slog.Warn("Error loading .env file", slog.Any("error", err))
		panic(err)
	}

	connections.Connections.Connect()
}

func main() {
	srv := server.New()

	err := srv.Start(8080)

	if err != nil {
		slog.Error("Error from Start", slog.Any("error", err))
	}
}
