package server

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"mck-p/goact/commands"
	"mck-p/goact/data"
	"mck-p/goact/tracer"
	"mck-p/goact/usecases"

	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
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
//
//	@Produce	application/vnd.api+json
//
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
		CTX:     c.UserContext(),
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

type WebsocketMessage struct {
	Id       string            `json:"id"`
	Action   string            `json:"action"`
	Payload  commands.Payload  `json:"payload"`
	Metadata commands.Metadata `json:"metadata"`
}

func handleMessage(msg []byte, c *websocket.Conn, user *data.User, dispatch func(cmd usecases.WebSocketMessageCmd) error) error {
	incomingMessage := WebsocketMessage{}

	err := json.Unmarshal(msg, &incomingMessage)

	if err != nil {
		slog.Warn("Error parsing incoming websocket message", slog.Any("error", err))
		return err
	}

	cmd := usecases.WebSocketMessageCmd{
		CTX:      context.TODO(),
		ActorId:  user.Id,
		Action:   incomingMessage.Action,
		Payload:  incomingMessage.Payload,
		Metadata: incomingMessage.Metadata,
		Dispatch: dispatch,
	}

	err = usecases.UseCases.ProcessWebSocketMessage(cmd)

	if err != nil {
		slog.Warn("There was an error processing a websocket message", slog.Any("action", incomingMessage.Action))
		return err
	}

	return nil
}

func (handlers *Handler) WebsocketHandler(c *websocket.Conn) {
	// websocket.Conn bindings https://pkg.go.dev/github.com/fasthttp/websocket?tab=doc#pkg-index
	var (
		msg []byte
		err error
	)

	user := c.Locals("user").(*data.User)

	if user == nil {
		slog.Warn("No user when parsing locals")
		return
	}

	messagesForUserChannel := usecases.UseCases.SubscribeToUserMessages(usecases.SubscribeToUserMessagesCmd{
		CTX:     context.TODO(),
		ActorId: user.Id,
	})

	quit := make(chan bool)

	dispatchMessage := func(cmd usecases.WebSocketMessageCmd, conn *websocket.Conn) error {
		_, span := tracer.Tracer.Start(cmd.CTX, "Websockets::Dispatch")
		defer span.End()

		if conn == nil {
			quit <- true
			return nil
		}

		slog.Debug("Sending new message", slog.Any("action", cmd.Action), slog.Any("receiverId", user.Id), slog.String("actorId", cmd.ActorId))

		cmd.Metadata["actorId"] = cmd.ActorId

		outgoingMsg := WebsocketMessage{
			Action:   fmt.Sprintf("@@SERVER-SENT/%s", cmd.Action),
			Payload:  cmd.Payload,
			Metadata: cmd.Metadata,
			Id:       uuid.NewString(),
		}

		if err = conn.WriteJSON(outgoingMsg); err != nil {
			slog.Warn("Error trying to send message", slog.Any("action", outgoingMsg.Action), slog.Any("error", err))

			return err
		}

		return nil
	}

	go func(conn *websocket.Conn) {
		for msg := range messagesForUserChannel {
			select {
			case <-quit:
				slog.Debug("We have been asked to quit the messaging for user channel")

				usecases.UseCases.UnsubscribeFromUserMessages(usecases.UnsubscribeToUserMessagesCmd{
					ActorId: user.Id,
					CTX:     context.TODO(),
				})
				return
			default:
				err := dispatchMessage(usecases.WebSocketMessageCmd{
					ActorId:  msg.ActorId,
					Payload:  msg.Payload,
					Action:   msg.Action,
					Metadata: msg.Metadata,
				}, conn)

				if err != nil {
					quit <- true
				}
			}

		}
	}(c)

out:
	for {
		select {
		case <-quit:
			return
		default:
			_, msg, err = c.ReadMessage()

			if err != nil {
				slog.Warn("Error parsing incoming message", slog.Any("error", err))
				break out
			}

			err = handleMessage(msg, c, user, func(cmd usecases.WebSocketMessageCmd) error {
				if c != nil {
					return dispatchMessage(cmd, c)
				}

				return nil
			})

			if err != nil {
				slog.Warn("Error handling message", slog.Any("error", err))
				break out
			}
		}
	}

	slog.Debug("We have stopped processing at the handler level")
}
