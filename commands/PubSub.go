package commands

import "context"

type Payload map[string]interface{}

type Metadata map[string]interface{}

type PubSubCommand struct {
	ActorId  string   `json:"actorId"`
	Id       string   `json:"id"`
	Action   string   `json:"action"`
	Payload  Payload  `json:"payload"`
	Metadata Metadata `json:"metadata"`
}

type PublishCmd struct {
	CTX   context.Context
	Data  any
	Topic string
}
