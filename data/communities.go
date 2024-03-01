package data

import (
	"fmt"
	"log/slog"
	"mck-p/goact/connections"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
)

type Community struct {
	Id            string                 `json:"_id"`
	Name          string                 `json:"name"`
	ProfileSchema map[string]interface{} `json:"profile_schema"`
	IsPublic      bool                   `json:"is_public"`
	CreatedAt     time.Time              `json:"created_at"`
}

type CommunityMember struct {
	Community     string                 `json:"community"`
	Member        string                 `json:"member"`
	UserName      string                 `json:"user_name"`
	UserAvatar    string                 `json:"user_avatar"`
	Profile       map[string]interface{} `json:"profile"`
	ProfileSchema map[string]interface{} `json:"profile_schema"`
}

type CommunityFeedItem struct {
	Id          string                 `json:"_id"`
	CommunityId string                 `json:"community_id"`
	AuthorId    string                 `json:"author_id"`
	Type        string                 `json:"type"`
	Data        map[string]interface{} `json:"data"`
	CreatedAt   time.Time              `json:"created_at"`
	Updatedat   time.Time              `json:"updated_at"`
}

type ICommunities struct{}

var Communities = &ICommunities{}

type NewCommunity struct {
	CreatorId     string                 `json:"creator_id"`
	IsPublic      bool                   `json:"is_public"`
	Name          string                 `json:"name"`
	ProfileSchema map[string]interface{} `json:"profile_schema"`
}

func (communities *ICommunities) CreateCommunity(comm NewCommunity) (*Community, error) {
	community := Community{}

	sql := `
		INSERT INTO communities(
			name, is_public, profile_schema
		) VALUES (
			$1, $2, $3
		) RETURNING
			_id as id,
			name,
			is_public as isPublic,
			created_at as createdAt,
			profile_schema as profileSchema;
	`
	row := connections.Database.QueryRow(sql, comm.Name, comm.IsPublic, comm.ProfileSchema)

	err := row.Scan(&community.Id, &community.Name, &community.IsPublic, &community.CreatedAt, &community.ProfileSchema)

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
			communities.profile_schema as profileSchema,
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
			communities.profile_schema as profileSchema,
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
			communities.profile_schema as profileSchema,
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

	err := row.Scan(
		&communityMember.Community,
		&communityMember.Member,
		&communityMember.Profile,
		&communityMember.ProfileSchema,
		&communityMember.UserName,
		&communityMember.UserAvatar,
	)

	if err != nil {
		return communityMember, err
	}

	communityMember.Profile = communities.setProfileImageURL(communityMember.Profile)

	return communityMember, nil
}

func (communities *ICommunities) setProfileImageURL(profile map[string]interface{}) map[string]interface{} {
	avatar := profile["avatar"]
	var avatarURL string
	if avatar == nil {
		return profile
	} else {
		avatarURL = avatar.(string)
	}

	if avatar != "" {
		split := strings.Split(avatarURL, "/")

		if len(split) == 1 {
			// internal image
			readURL, err := Files.GetAvatarReadURL(avatarURL)

			if err == nil {
				profile["avatar"] = readURL
			}

		}
	}

	return profile
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
			communities.profile_schema as profileSchema,
			communities.created_at as created_at
		FROM
			communities
		WHERE
			communities._id = $1;
	`

	community := Community{}

	row := connections.Database.QueryRow(sql, query.Id)

	return community, row.Scan(&community.Id, &community.Name, &community.IsPublic, &community.ProfileSchema, &community.CreatedAt)
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

type GetFeedItemsForCommunityRequest struct {
	CommunityId string
	Limit       int
	Offset      int
	Order       string
}

func (communities *ICommunities) GetFeedItemsForCommunity(request GetFeedItemsForCommunityRequest) ([]CommunityFeedItem, error) {

	sortOrder := "DESC"

	if request.Order == "asc" {
		sortOrder = "ASC"
	}

	sql := fmt.Sprintf(`
		SELECT
			community_feed_items._id as id,
			community_feed_items.community_id as communityId,
			community_feed_items.author_id as authorId,
			community_feed_items.created_at as createdAt,
			community_feed_items.updated_at as updatedAt,
			community_feed_items.data as data,
			community_feed_items.type as type
		FROM
			community_feed_items
		WHERE
			community_feed_items.community_id = $1
		ORDER BY created_at %s
		LIMIT $2
		OFFSET $3
	`, sortOrder)

	rows, err := connections.Database.Query(sql, request.CommunityId, request.Limit, request.Offset)

	slog.Info("This is rows", slog.Any("rows", rows), slog.String("sql", sql), slog.Any("args", request))

	if err != nil {
		slog.Info("Error getting rows", slog.Any("error", err), slog.String("sql", sql))

		return []CommunityFeedItem{}, err
	}

	list, err := pgx.CollectRows(rows, pgx.RowToStructByName[CommunityFeedItem])

	if err != nil {
		return []CommunityFeedItem{}, err
	}
	return list, nil
}

type CreateCommunityFeedItemRequest struct {
	Data        map[string]interface{}
	Type        string
	AuthorId    string
	CommunityId string
}

func (communities *ICommunities) CreateCommunityFeedItem(request CreateCommunityFeedItemRequest) (CommunityFeedItem, error) {
	sql := `
		INSERT INTO community_feed_items(data, type, author_id, community_id)
		VALUES
		($1, $2, $3, $4)
		RETURNING
			_id as id,
			community_id as communityId,
			author_id as authorId,
			created_at as createdAt,
			updated_at as updatedAt,
			type as type,
			data as data
	`
	feedItem := CommunityFeedItem{}

	row := connections.Database.QueryRow(sql, request.Data, request.Type, request.AuthorId, request.CommunityId)

	return feedItem, row.Scan(
		&feedItem.Id,
		&feedItem.CommunityId,
		&feedItem.AuthorId,
		&feedItem.CreatedAt,
		&feedItem.Updatedat,
		&feedItem.Type,
		&feedItem.Data,
	)
}
