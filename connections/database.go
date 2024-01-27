package connections

import (
	"context"
	"log/slog"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type DatabaseConnection struct {
	conn *pgxpool.Pool
}

var Database = &DatabaseConnection{}

func (database *DatabaseConnection) Connect() error {
	slog.Debug("We are connecting to the Database connection")

	connection, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))

	if err != nil {
		return err
	}

	database.conn = connection

	return nil
}

func (database *DatabaseConnection) Disconnect() {
	database.conn.Close()
}

func (database *DatabaseConnection) QueryRow(sql string, target any, params ...any) pgx.Row {
	return database.conn.QueryRow(context.TODO(), sql, params...)
}
