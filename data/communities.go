package data

import (
	"mck-p/goact/connections"
	"time"

	"github.com/jackc/pgx/v5"
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

type UserCommunitiesQuery struct {
	UserId string
}

func (messages *ICommunities) GetUserCommunities(query UserCommunitiesQuery) ([]Community, error) {
	sql := `
		SELECT
			communities._id as id,
			communities.name as name,
			communities.is_public as isPublic,
			communities.created_at as created_at
		FROM
			communities
		JOIN
			community_members
			ON community_members.community_id = communities._id
		WHERE
			community_members.user_id = $1;
	`

	rows, err := connections.Database.Query(sql, query.UserId)

	if err != nil {
		return []Community{}, err
	}

	list, err := pgx.CollectRows(rows, pgx.RowToStructByName[Community])

	if err != nil {
		return []Community{}, err
	}

	return list, nil
}

type ComminityByIdQuery struct {
	Id string `json:"id"`
}

func (messages *ICommunities) GetCommunityById(query ComminityByIdQuery) (Community, error) {
	sql := `
		SELECT
			communities._id as id,
			communities.name as name,
			communities.is_public as isPublic,
			communities.created_at as created_at
		FROM
			communities
		WHERE
			communities._id = $1;
	`

	community := Community{}

	row := connections.Database.QueryRow(sql, query.Id)

	return community, row.Scan(&community.Id, &community.Name, &community.IsPublic, &community.CreatedAt)
}
