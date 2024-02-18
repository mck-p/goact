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

type CommunityMember struct {
	Community  string                 `json:"community"`
	Member     string                 `json:"member"`
	UserName   string                 `json:"user_name"`
	UserAvatar string                 `json:"user_avatar"`
	Profile    map[string]interface{} `json:"profile"`
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

func (communities *ICommunities) GetCommunityMembers(query CommunityMembersQuery) ([]CommunityMember, error) {
	sql := `
		SELECT
			community_members.community_id as community,
			community_members.user_id as member,
			community_members.profile as profile,
			users.name as userName,
			users.avatarUrl as userAvatar
		FROM
			communities
		JOIN
			community_members
			ON community_members.community_id = communities._id
		JOIN
			users
			ON community_members.user_id = users._id
		WHERE
			communities._id = $1;
	`

	rows, err := connections.Database.Query(sql, query.Id)

	if err != nil {
		return []CommunityMember{}, err
	}

	list, err := pgx.CollectRows(rows, pgx.RowToStructByName[CommunityMember])

	if err != nil {
		return []CommunityMember{}, err
	}

	return list, nil
}

type CommunityMemberQuery struct {
	Id       string `json:"id"`
	MemberId string `json:"member_id"`
}

func (communities *ICommunities) GetCommunityMember(query CommunityMemberQuery) (CommunityMember, error) {
	sql := `
		SELECT
			community_members.community_id as community,
			community_members.user_id as member,
			community_members.profile as profile,
			users.name as userName,
			users.avatarUrl as userAvatar
		FROM
			communities
		JOIN
			community_members
			ON community_members.community_id = communities._id
		JOIN
			users
			ON community_members.user_id = users._id
		WHERE
			communities._id = $1
		AND
			users._id = $2;
	`

	row := connections.Database.QueryRow(sql, query.Id, query.MemberId)

	communityMember := CommunityMember{}

	return communityMember, row.Scan(
		&communityMember.Community,
		&communityMember.Member,
		&communityMember.Profile,
		&communityMember.UserName,
		&communityMember.UserAvatar,
	)
}

type UpdateCommunityMemberProfileCmd struct {
	CommunityId string                 `json:"community_id"`
	MemberId    string                 `json:"memvbr_id"`
	Profile     map[string]interface{} `json:"profile"`
}

func (communities *ICommunities) UpdateCommunityMemberProfile(cmd UpdateCommunityMemberProfileCmd) (CommunityMember, error) {
	sql := `
		UPDATE community_members
			SET profile = $3
		WHERE
			community_members.community_id = $1
			AND community_members.user_id = $2;
	`

	_, err := connections.Database.Exec(sql, cmd.CommunityId, cmd.MemberId, cmd.Profile)

	if err != nil {
		return CommunityMember{}, err
	}

	return communities.GetCommunityMember(CommunityMemberQuery{
		Id:       cmd.CommunityId,
		MemberId: cmd.MemberId,
	})
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
