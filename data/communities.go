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

func (communities *ICommunities) CreateCommunity(comm NewCommunity) (*Community, error) {
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

func (communities *ICommunities) GetUserCommunities(query UserCommunitiesQuery) ([]Community, error) {
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

type CommunityMembersQuery struct {
	Id string
}

func (communities *ICommunities) GetCommunityMembers(query CommunityMembersQuery) ([]User, error) {
	sql := `
		SELECT
			users._id as id,
			users.name as name,
			users.externalId as externalId,
			users.avatarUrl as avatarUrl
		FROM
			communities
		JOIN
			community_members
			ON community_members.community_id = communities._id
		JOIN
			users
			ON users._id = community_members.user_id
		WHERE
			communities._id = $1;
	`

	rows, err := connections.Database.Query(sql, query.Id)

	if err != nil {
		return []User{}, err
	}

	list, err := pgx.CollectRows(rows, pgx.RowToStructByName[User])

	if err != nil {
		return []User{}, err
	}

	return list, nil
}

type ComminityByIdQuery struct {
	Id string `json:"id"`
}

func (communities *ICommunities) GetCommunityById(query ComminityByIdQuery) (Community, error) {
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

type DeleteCommunityCommand struct {
	Id string `json:"_id"`
}

func (communities *ICommunities) DeleteCommunity(cmd DeleteCommunityCommand) error {
	sql := `
		DELETE FROM
			communities
		WHERE
			communities._id = $1
	`

	_, err := connections.Database.Exec(sql, cmd.Id)

	return err
}
