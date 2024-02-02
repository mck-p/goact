package data

import (
	"mck-p/goact/connections"
)

type UserData struct{}

type User struct {
	Id         string `json:"_id"`
	ExternalId string `json:"externalid"`
}

var Users = &UserData{}

func (users *UserData) GetUserByExternalId(id string) (*User, error) {
	user := User{}

	sql := `
		SELECT _id as id, externalid FROM users WHERE externalId = $1;
	`

	row := connections.Database.QueryRow(sql, &user, id)

	return &user, row.Scan(&user.Id, &user.ExternalId)

}

type CreateUserCmd struct {
	Connection *connections.DatabaseConnection
	ExternalId string
}

func (users *UserData) CreateUser(cmd CreateUserCmd) (*User, error) {
	user := User{}
	sql := `
		INSERT INTO users
			(externalId)
		VALUES
			($1)
		RETURNING _id as id, externalId
	`

	row := cmd.Connection.QueryRow(sql, &user, cmd.ExternalId)

	return &user, row.Scan(&user.Id, &user.ExternalId)
}
