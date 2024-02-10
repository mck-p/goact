package data

import (
	"mck-p/goact/connections"
	"time"

	"github.com/google/uuid"
)

type Message struct {
	Id        string    `json:"_id"`
	Message   string    `json:"message"`
	SentAt    time.Time `json:"sent_at"`
	AuthorId  string    `json:"author_id"`
	GroupId   string    `json:"group_id"`
	CreatedAt time.Time `json:"created_at"`
}

type IMessages struct{}

var Messages = &IMessages{}

type NewMessage struct {
	Message  string
	AuthorId string
	GroupId  string
}

func (messages *IMessages) SaveMessage(msg NewMessage) (*Message, error) {
	message := Message{}

	sql := `
		INSERT INTO messages(
			message, author_id, group_id
		) VALUES (
			$1, $2, $3
		) RETURNING
			_id as id,
			author_id as authorId,
			group_id as groupId,
			created_at as createdAt;
	`

	row := connections.Database.QueryRow(sql, msg.Message, msg.AuthorId, msg.GroupId)

	return &message, row.Scan(&message.Id, &message.AuthorId, &message.GroupId)
}

type MessageGroupQuery struct {
	Limit   int
	Offset  int
	GroupId string
	OrderBy string
}

func (messages *IMessages) GetMessagesForGroup(query MessageGroupQuery) ([]*Message, error) {
	sql := `
		SELECT
			_id as id,
			author_id as authorId,
			group_id as groupId,
			created_at as createdAt,
			message
		FROM
			messages
		WHERE
			group_id = $1
		LIMIT $2
		OFFSET $3
		ORDER BY created_at $4;
	`

	if query.Limit == 0 {
		query.Limit = 20
	}

	if query.OrderBy == "" {
		query.OrderBy = "DESC"
	}

	rows, err := connections.Database.Query(sql, query.GroupId, query.Limit, query.Offset, query.OrderBy)

	if err != nil {
		return []*Message{}, err
	}

	list := []*Message{}

	for rows.Next() {
		var message Message

		rows.Scan(&message.Id, &message.AuthorId, &message.GroupId, &message.CreatedAt, &message.Message)
		list = append(list, &message)
	}

	return list, nil
}

type GroupMebersQuery struct {
	GroupId string
}

func (messages *IMessages) GetMembersForGroup(query GroupMebersQuery) ([]*User, error) {
	sql := `
		SELECT
			users._id as id,
			users.externalId as externalId
		FROM
			users
		JOIN
			message_group_members
			ON message_group_members.user_id = users._id
		WHERE
			message_group_members.group_id = $1;
	`

	rows, err := connections.Database.Query(sql, query.GroupId)

	if err != nil {
		return []*User{}, err
	}

	list := []*User{}

	for rows.Next() {
		var user User

		rows.Scan(&user.Id, &user.ExternalId)
		list = append(list, &user)
	}

	return list, nil
}

func (messages *IMessages) GetByUserId(userId string, limit int, offset int) ([]*Message, error) {
	message := Message{
		Id:       "1234",
		Message:  "I am the first message",
		SentAt:   time.Now(),
		AuthorId: userId,
		GroupId:  uuid.New().String(),
	}

	return []*Message{
		&message,
	}, nil
}
