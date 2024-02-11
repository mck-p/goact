package data

import (
	"mck-p/goact/connections"
)

type UserData struct{}

type User struct {
	Id         string `json:"_id"`
	ExternalId string `json:"externalid"`
	Name       string `json:"name"`
	AvatarUrl  string `json:"avatarUrl"`
}

var Users = &UserData{}

func (users *UserData) GetUserByExternalId(id string) (*User, error) {
	user := User{}

	sql := `
		SELECT _id as id, externalid, name, avatarUrl FROM users WHERE externalId = $1;
	`

	row := connections.Database.QueryRow(sql, id)

	return &user, row.Scan(&user.Id, &user.ExternalId, &user.Name, &user.AvatarUrl)

}

func (users *UserData) GetById(id string) (*User, error) {
	user := User{}

	sql := `
		SELECT _id as id, externalid, name, avatarUrl FROM users WHERE _id = $1;
	`

	row := connections.Database.QueryRow(sql, id)

	return &user, row.Scan(&user.Id, &user.ExternalId, &user.Name, &user.AvatarUrl)

}

type CreateUserCmd struct {
	Connection *connections.DatabaseConnection
	ExternalId string
	Name       string
	AvatarUrl  string
}

func (users *UserData) CreateUser(cmd CreateUserCmd) (*User, error) {
	user := User{}
	sql := `
		INSERT INTO users
			(externalId, name, avatarUrl)
		VALUES
			($1, $2)
		RETURNING _id as id, externalId, name, avatarUrl
	`

	row := cmd.Connection.QueryRow(sql, cmd.ExternalId, cmd.Name, cmd.AvatarUrl)

	return &user, row.Scan(&user.Id, &user.ExternalId, &user.Name, &user.AvatarUrl)
}
