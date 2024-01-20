package server

import (
	"mck-p/goact/data"
	"mck-p/goact/tracer"
	"mck-p/goact/usecases"

	"github.com/gofiber/fiber/v2"
)

type Handler struct{}

var Handlers = &Handler{}

type Link struct {
	Href        string      `json:"href"`
	Rel         string      `json:"rel"`
	DescribedBy *Link       `json:"link"`
	Title       string      `json:"title"`
	HrefLang    string      `json:"hreflang"`
	Meta        interface{} `json:"meta"`
}

/*
*

	All responses will either be Success
	or Error. We want to return all Success
	under the field data and all Errors under
	the field error.

	The only difference between the two types
	is the key that is exported
*/
type SuccessResponse[T any] struct {
	Data     T               `json:"data"`
	Metadata interface{}     `json:"metadata,omitempty"`
	Links    map[string]Link `json:"links,omitempty"`
	Included []interface{}   `json:"includes,omitempty"`
}

type ErrorResponse[T any] struct {
	Error    T               `json:"error"`
	Metadata interface{}     `json:"metadata,omitempty"`
	Links    map[string]Link `json:"links,omitempty"`
	Included []interface{}   `json:"includes,omitempty"`
}

type GenericError struct {
	Message string `json:"message"`
}

type HealthcheckResponse struct {
	Healthy bool `json:"healthy"`
	Status  int  `json:"status"`
}

// Healthcheck	 godoc
//
//	@Id				Healthcheck
//	@Summary		Returns the health of the underlying system
//	@Description	Can be used for both readiness and liveness
//	@Tags			Internal
//	@Produce		application/vnd.api+json
//	@Success		200	{object}	SuccessResponse[HealthcheckResponse]
//	@Failure		500	{object}	ErrorResponse[HealthcheckResponse]
//	@Router			/.well-known/healthcheck [get]
func (handlers *Handler) Healthcheck(c *fiber.Ctx) error {
	_, span := tracer.Tracer.Start(c.UserContext(), "Handler::Healthcheck")
	defer span.End()

	return JSONAPI(c, 200, SuccessResponse[HealthcheckResponse]{
		Data: HealthcheckResponse{
			Healthy: true,
		},
	})
}

type GetMessageRequest struct{}

type GetMessageResponse struct {
	Messages []any `json:"messages"`
}

// GetMessages	godoc
//
//		@Id			GetMessages
//		@Summary	Retrieves the last N number of messages, given some offset
//		@Tags		Users
//		@Produce	application/vnd.api+json
//	 @Param		id path string true "User ID"
//		@Param		limit query int false "Limit for pagination"
//		@Param		offset query int false "Offset for pagination"
//		@Success	200	{object}	SuccessResponse[GetMessageResponse]
//		@Failure	500	{object}	ErrorResponse[GenericError]
//		@Router		/api/v1/users/:id/messages [get]
func (handlers *Handler) GetMessages(c *fiber.Ctx) error {
	_, span := tracer.Tracer.Start(c.UserContext(), "Handler::GetMessages")
	defer span.End()

	limit := c.QueryInt("limit")

	if limit == 0 {
		limit = 20
	}

	offset := c.QueryInt("offset")

	messages, err := data.Messages.GetByUserId(c.Params("id"), limit, offset)

	if err != nil {
		return err
	}

	return JSONAPI(c, 200, messages)
}

// GetWeather	godoc
//
//	@Id			GetWeather
//	@Summary	Gets the last-checked weather conditions
//	@Tags		Weather
//	@Produce	application/vnd.api+json
//	@Security	BearerToken
//	@Success	200	{object}	SuccessResponse[data.ForecastQueryUpstreamResponse]
//	@Failure	500	{object}	ErrorResponse[GenericError]
//	@Router		/api/v1/weather [get]
func (handlers *Handler) GetWeather(c *fiber.Ctx) error {
	_, span := tracer.Tracer.Start(c.UserContext(), "Handler::GetWeather")
	defer span.End()

	query := c.Query("location")

	if query == "" {
		query = "Knoxville,TN"
	}

	weather, err := usecases.UseCases.GetWeather(c.UserContext(), query)

	if err != nil {
		return err
	}

	return JSONAPI(c, 200, weather)
}

// @Id WebhookIngestion
// @Summary Handle Webhook
// @Description Handles incoming webhooks
// @Tags Internal
// @Accept json
//	@Produce	application/vnd.api+json
// @Param requestBody body map[string]interface{} true "Webhook payload"
// @Success 200 {object} SuccessResponse[any]
// @Router /api/v1/webhooks [post]
func (handlers *Handler) Webhook(c *fiber.Ctx) error {
	_, span := tracer.Tracer.Start(c.UserContext(), "Handler::Webhook")
	defer span.End()

	/**

		There are many different webhooks that could be coming. We need to
		offload all of that checking to downstream consumers. So. We need
		to pass them the _raw bytes_ of the body so that they can process
		those once we get there and they can parse it correctly for their
		needs.
	*/
	rawBody := c.Body()
	/**
		
		We also want to be able to parse it the basic upper level
		structure to be able to switch on what type of webhook it is

	*/
	payload := map[string]interface{}{}
	err := c.BodyParser(&payload)

	if err != nil {
		return err
	}

	cmd := usecases.AuthWebhookCmd{
		CTX: c.UserContext(),
		Webhook: payload,
	}

	/**

		TODO:: ENSURE THIS IS VALIDATED TO BE FROM SOMEONE WE TRUST
	*/
	err = usecases.UseCases.ProcessAuthWebhook(cmd, rawBody)

	if err != nil {
		return err
	}

	return JSONAPI(c, 200, fiber.Map{
		"true": true,
	})
}
