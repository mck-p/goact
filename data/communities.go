package data

import (
	"mck-p/goact/connections"
	"time"
)

type Community struct {
	Id        string    `json:"_id"`
	Name      string    `json:"name"`
	IsPublic  bool      `json:"is_public"`
	CreatedAt time.Time `json:"created_at"`
}

type ICommunities struct{}

var Communities = &ICommunities{}

type NewCommunity struct {
	CreatorId string `json:"creator_id"`
	IsPublic  bool   `json:"is_public"`
	Name      string `json:"name"`
}

func (messages *ICommunities) CreateCommunity(comm NewCommunity) (*Community, error) {
	community := Community{}

	sql := `
		INSERT INTO communities(
			name, is_public
		) VALUES (
			$1, $2
		) RETURNING
			_id as id,
			name,
			is_public as isPublic,
			created_at as createdAt;
	`
	row := connections.Database.QueryRow(sql, comm.Name, comm.IsPublic)

	err := row.Scan(&community.Id, &community.Name, &community.IsPublic, &community.CreatedAt)

	if err != nil {
		return &community, err
	}

	sql = `
		INSERT INTO community_members(community_id, user_id) VALUES ($1, $2)
	`

	_, err = connections.Database.Exec(sql, community.Id, comm.CreatorId)

	return &community, err
}
