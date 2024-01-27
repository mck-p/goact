package data

import "mck-p/goact/connections"

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
