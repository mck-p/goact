package data

type AuthEvent[T any] struct {
	Data   T      `json:"data"`
	Object string `json:"object"`
	Type   string `json:"type"`
}

type UserCreatedEmailAddress struct {
	EmailAddress string `json:"email_address"`
	Id           string `json:"id"`
	Object       string `json:"object"`
}

type UserCreatedEventData struct {
	Birthday        string                    `json:"birthday"`
	CreatedAt       int                       `json:"created_at"`
	EmailAddresses  []UserCreatedEmailAddress `json:"email_addresses"`
	ExternalId      string                    `json:"external_id"`
	FirstName       string                    `json:"first_name"`
	Gender          string                    `json:"gender"`
	Id              string                    `json:"id"`
	LastName        string                    `json:"last_name"`
	Object          string                    `json:"object"`
	Username        string                    `json:"username"`
	Metadata        map[string]interface{}    `json:"public_metadata"`
	PrivateMetadata map[string]interface{}    `jsaon:"private_metadta"`
	ProfileImageUrl string                    `json:"profile_image_url"`
}