package connections

import (
	"context"
	"log/slog"
	"mck-p/goact/tracer"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type DatabaseConnection struct {
	conn *pgxpool.Pool
}

var Database = &DatabaseConnection{}

func (database *DatabaseConnection) Connect(ctx context.Context) error {
	_, span := tracer.Tracer.Start(ctx, "Connections::Database::Connect")
	defer span.End()

	slog.Debug("We are connecting to the Database connection")

	connection, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))

	if err != nil {
		return err
	}

	database.conn = connection

	return nil
}

func (database *DatabaseConnection) Disconnect(ctx context.Context) {
	_, span := tracer.Tracer.Start(ctx, "Connections::Database::Disconnect")
	defer span.End()

	database.conn.Close()
}

func (database *DatabaseConnection) QueryRow(sql string, target any, params ...any) pgx.Row {
	return database.conn.QueryRow(context.TODO(), sql, params...)
}
