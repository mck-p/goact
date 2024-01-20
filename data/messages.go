package data

import (
	"time"

	"github.com/google/uuid"
)

type Message struct {
	Id         string    `json:"id"`
	Message    string    `json:"message"`
	SentAt     time.Time `json:"sent_at"`
	AuthorId   string    `json:"author_id"`
	ReceiverId string    `json:"receiver_id"`
}

type IMessages struct{}

var Messages = &IMessages{}

func (messages *IMessages) GetByUserId(userId string, limit int, offset int) ([]*Message, error) {
	message := Message{
		Id:         "1234",
		Message:    "I am the first message",
		SentAt:     time.Now(),
		AuthorId:   userId,
		ReceiverId: uuid.New().String(),
	}

	return []*Message{
		&message,
	}, nil
}
