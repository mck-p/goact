package server

import (
	"context"
	"encoding/json"
	"fmt"
	"log/slog"
	"mck-p/goact/authorization"
	"mck-p/goact/commands"
	"mck-p/goact/data"
	"mck-p/goact/tracer"
	"mck-p/goact/usecases"

	"github.com/gofiber/contrib/websocket"
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

type GetGroupsResponse struct {
	Groups []any `json:"groups"`
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

// GetUserByExternalId	godoc
//
//	@Id			GetUserByExternalId
//	@Summary	Returns the Goact User based on their external ID
//	@Tags		Users
//	@Produce	application/vnd.api+json
//	@Security	BearerToken
//	@Success	200	{object}	SuccessResponse[data.User]
//	@Failure	500	{object}	ErrorResponse[GenericError]
//	@Router		/api/v1/users/external-id/{externalid} [get]
func (handlers *Handler) GetUserByExternalId(c *fiber.Ctx) error {
	_, span := tracer.Tracer.Start(c.UserContext(), "Handler::GetUserByExternalId")
	defer span.End()

	externalId := c.Params("externalid")

	user, err := usecases.UseCases.GetUserByExternalId(usecases.GetUserByExternalIdRequest{
		Repository: data.Users,
		ExternalId: externalId,
	})

	if err != nil {
		slog.Warn("Error trying to get user by external ID", slog.Any("error", err), slog.String("external-id", externalId))

		return err
	}

	return JSONAPI(c, 200, user)
}

// GetUserById	godoc
//
//	@Id			GetUserById
//	@Summary	Returns the Goact User based on their internal ID
//	@Tags		Users
//	@Produce	application/vnd.api+json
//	@Security	BearerToken
//	@Success	200	{object}	SuccessResponse[data.User]
//	@Failure	500	{object}	ErrorResponse[GenericError]
//	@Router		/api/v1/users/{id} [get]
func (handlers *Handler) GetUserById(c *fiber.Ctx) error {
	_, span := tracer.Tracer.Start(c.UserContext(), "Handler::GetUserById")
	defer span.End()
	user := c.Locals("user").(*data.User)

	id := c.Params("id")
	canGetUserById := authorization.CanPerformAction(
		user.Id,
		fmt.Sprintf("user::%s", id),
		"view",
	)

	if !canGetUserById {
		return JSONAPI(c, 401, fiber.Map{
			"message": "You are not authorized to perform that action",
		})
	}

	user, err := data.Users.GetById(id)

	if err != nil {
		slog.Warn("Error trying to get user by ID", slog.Any("error", err), slog.String("id", id))

		return err
	}

	return JSONAPI(c, 200, user)
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

// GetGroupMessages	godoc
//
//		@Id			GetGroupMessages
//		@Summary	Retrieves the last N number of messages, given some offset
//		@Tags		Users
//		@Produce	application/vnd.api+json
//	 	@Param		id path string true "Group ID"
//		@Param		limit query int false "Limit for pagination"
//		@Param		offset query int false "Offset for pagination"
//		@Param		orderBy query int false "DESC or ASC"

// @Success	200	{object}	SuccessResponse[GetMessageResponse]
// @Failure	500	{object}	ErrorResponse[GenericError]
// @Router		/api/v1/messages/groups/{:id} [get]
func (handlers *Handler) GetGroupMessages(c *fiber.Ctx) error {
	_, span := tracer.Tracer.Start(c.UserContext(), "Handler::GetGroupMessages")
	defer span.End()
	groupId := c.Params("id")
	user := c.Locals("user").(*data.User)

	canGetGroupMessages := authorization.CanPerformAction(
		user.Id,
		fmt.Sprintf("group::%s", groupId),
		"getMembers",
	)

	if !canGetGroupMessages {
		return JSONAPI(c, 401, fiber.Map{
			"message": "Not authorized to perform this action",
		})
	}

	limit := c.QueryInt("limit")

	if limit == 0 {
		limit = 100
	}

	offset := c.QueryInt("offset")

	orderBy := c.Query("orderBy")

	if orderBy == "" {
		orderBy = "DESC"
	}

	messages, err := data.Messages.GetMessagesForGroup(data.MessageGroupQuery{
		GroupId: groupId,
		Offset:  offset,
		Limit:   limit,
		OrderBy: orderBy,
	})

	if err != nil {
		return err
	}

	return JSONAPI(c, 200, messages)
}

// GetUserMessageGroups	godoc
//
//	@Id			GetUserMessageGroups
//	@Summary	Retrieves the Message Groups that a User has access to
//	@Tags		Messages
//	@Produce	application/vnd.api+json
//
// @Success	200	{object}	SuccessResponse[GetGroupsResponse]
// @Failure	500	{object}	ErrorResponse[GenericError]
// @Router		/api/v1/messages/groups [get]
func (handlers *Handler) GetGroups(c *fiber.Ctx) error {
	_, span := tracer.Tracer.Start(c.UserContext(), "Handler::GetGroups")
	defer span.End()
	user := c.Locals("user").(*data.User)

	canGetMessageGroups := authorization.CanPerformAction(
		user.Id,
		"group",
		"getMessageGroups",
	)

	if !canGetMessageGroups {
		return JSONAPI(c, 401, fiber.Map{
			"message": "Not authorized to perform this action",
		})
	}

	groups, err := data.Messages.GetUserGroups(data.UserGroupsQuery{
		UserId: user.Id,
	})

	if err != nil {
		return err
	}

	return JSONAPI(c, 200, groups)
}

// GetUserCommunities	godoc
//
//	@Id			GetUserCommunities
//	@Summary	Retrieves the Communities that a User has access to
//	@Tags		Communities
//	@Produce	application/vnd.api+json
//
// @Success	200	{object}	SuccessResponse[[]data.Community]
// @Failure	500	{object}	ErrorResponse[GenericError]
// @Router		/api/v1/communities [get]
func (handlers *Handler) GetCommunities(c *fiber.Ctx) error {
	_, span := tracer.Tracer.Start(c.UserContext(), "Handler::GetCommunities")
	defer span.End()
	user := c.Locals("user").(*data.User)

	canGetCommunities := authorization.CanPerformAction(
		user.Id,
		"community",
		"list",
	)

	if !canGetCommunities {
		return JSONAPI(c, 401, fiber.Map{
			"message": "Not authorized to perform this action",
		})
	}

	communities, err := data.Communities.GetUserCommunities(data.UserCommunitiesQuery{
		UserId: user.Id,
	})

	if err != nil {
		return err
	}

	return JSONAPI(c, 200, communities)
}

// GetUserCommunityById	godoc
//
//	@Id			GetUserCommunityById
//	@Summary	Retrieves the Community of a given ID
//	@Tags		Communities
//	@Produce	application/vnd.api+json
//
// @Success	200	{object}	SuccessResponse[data.Community]
// @Failure	500	{object}	ErrorResponse[GenericError]
// @Router		/api/v1/communities/{id} [get]
func (handlers *Handler) GetCommunityById(c *fiber.Ctx) error {
	_, span := tracer.Tracer.Start(c.UserContext(), "Handler::GetCommunitiy")
	defer span.End()
	communityId := c.Params("id")

	user := c.Locals("user").(*data.User)

	canViewCommunity := authorization.CanPerformAction(
		user.Id,
		fmt.Sprintf("community::%s", communityId),
		"view",
	)

	if !canViewCommunity {
		return JSONAPI(c, 401, fiber.Map{
			"message": "Not authorized to perform this action",
		})
	}

	community, err := data.Communities.GetCommunityById(data.ComminityByIdQuery{
		Id: communityId,
	})

	if err != nil {
		return err
	}

	return JSONAPI(c, 200, community)
}

// GetCommunityMembers	godoc
//
//	@Id			GetCommunityMembers
//	@Summary	Retrieves the Community of a given ID
//	@Tags		Communities
//	@Produce	application/vnd.api+json
//
// @Success	200	{object}	SuccessResponse[[]data.CommunityMember]
// @Failure	500	{object}	ErrorResponse[GenericError]
// @Router		/api/v1/communities/{id}/members [get]
func (handlers *Handler) GetCommunityMembers(c *fiber.Ctx) error {
	_, span := tracer.Tracer.Start(c.UserContext(), "Handler::GetCommunitiyMembers")
	defer span.End()
	communityId := c.Params("id")

	user := c.Locals("user").(*data.User)

	canViewCommunity := authorization.CanPerformAction(
		user.Id,
		fmt.Sprintf("community::%s", communityId),
		"getMembers",
	)

	if !canViewCommunity {
		return JSONAPI(c, 401, fiber.Map{
			"message": "Not authorized to perform this action",
		})
	}

	members, err := data.Communities.GetCommunityMembers(data.CommunityMembersQuery{
		Id: communityId,
	})

	if err != nil {
		return err
	}

	return JSONAPI(c, 200, members)
}

// GetCommunityMember	godoc
//
//	@Id			GetCommunityMember
//	@Summary	Retrieves the Community of a given ID by their Member ID
//	@Tags		Communities
//	@Produce	application/vnd.api+json
//
// @Success	200	{object}	SuccessResponse[data.CommunityMember]
// @Failure	500	{object}	ErrorResponse[GenericError]
// @Router		/api/v1/communities/{id}/members/{member_id} [get]
func (handlers *Handler) GetCommunityMember(c *fiber.Ctx) error {
	_, span := tracer.Tracer.Start(c.UserContext(), "Handler::GetCommunitiyMembers")
	defer span.End()
	communityId := c.Params("id")
	memberId := c.Params("member_id")

	user := c.Locals("user").(*data.User)

	canGetCommunityMember := authorization.CanPerformAction(
		user.Id,
		fmt.Sprintf("community::%s::member::%s", communityId, memberId),
		"getMembers",
	)

	if !canGetCommunityMember {
		return JSONAPI(c, 401, fiber.Map{
			"message": "Not authorized to perform this action",
		})
	}

	members, err := data.Communities.GetCommunityMember(data.CommunityMemberQuery{
		Id:       communityId,
		MemberId: memberId,
	})

	if err != nil {
		return err
	}

	return JSONAPI(c, 200, members)
}

type MessageGroupRequest struct {
	Name string `json:"name"`
}

// @Id CreateMessageGroup
// @Summary Creates a new Message Group
// @Description This will create a new Message Group and assign the creator as the only authorized user of that message group
// @Tags Messages
// @Accept json
//
//	@Produce	application/vnd.api+json
//
// @Param requestBody body MessageGroupRequest true "Message Group Information"
//
// @Success 200 {object} SuccessResponse[data.MessageGroup]
// @Router /api/v1/messages/groups [post]
func (handlers *Handler) CreateMessageGroup(c *fiber.Ctx) error {
	_, span := tracer.Tracer.Start(c.UserContext(), "Handler::CreateMessageGroup")
	defer span.End()

	user := c.Locals("user").(*data.User)

	canCreateMessageGroup := authorization.CanPerformAction(
		user.Id,
		"group",
		"create",
	)

	if !canCreateMessageGroup {
		return JSONAPI(c, 401, fiber.Map{
			"message": "Not authorized to perform this action",
		})
	}

	payload := MessageGroupRequest{}
	err := c.BodyParser(&payload)

	if err != nil {
		return err
	}

	result, err := data.Messages.CreateGroup(data.CreateGroupCmd{
		UserId:    user.Id,
		GroupName: payload.Name,
	})

	if err != nil {
		return err
	}

	return JSONAPI(c, 201, result)
}

type CreateCommunityRequest struct {
	Name     string `json:"name"`
	IsPublic bool   `json:"is_public"`
}

// @Id CreateCommunity
// @Summary Creates a new Community
// @Description This will create a new Community and assign the creator as the only memberof that community
// @Tags Communities
// @Accept json
//
//	@Produce	application/vnd.api+json
//
// @Param requestBody body CreateCommunityRequest true "New Community Information"
//
// @Success 200 {object} SuccessResponse[data.Community]
// @Router /api/v1/communities [post]
func (handlers *Handler) CreateCommunity(c *fiber.Ctx) error {
	_, span := tracer.Tracer.Start(c.UserContext(), "Handler::CreateCommunity")
	defer span.End()

	user := c.Locals("user").(*data.User)

	canCreateCommunity := authorization.CanPerformAction(
		user.Id,
		"community",
		"create",
	)

	if !canCreateCommunity {
		return JSONAPI(c, 401, fiber.Map{
			"message": "Not authorized to perform this action",
		})
	}

	payload := CreateCommunityRequest{}
	err := c.BodyParser(&payload)

	if err != nil {
		return err
	}

	result, err := data.Communities.CreateCommunity(data.NewCommunity{
		Name:      payload.Name,
		IsPublic:  payload.IsPublic,
		CreatorId: user.Id,
	})

	if err != nil {
		return err
	}

	return JSONAPI(c, 201, result)
}

// @Id DeleteCommunity
// @Summary Deletes a Community
// @Description This will for realsies delete the communities and all related artifacts
// @Tags Communities
//
//	@Produce	application/vnd.api+json
//
// @Success 200 {object} SuccessResponse[any]
// @Router /api/v1/communities/{id} [delete]
func (handlers *Handler) DeleteCommunity(c *fiber.Ctx) error {
	_, span := tracer.Tracer.Start(c.UserContext(), "Handler::DeleteCommunity")
	defer span.End()

	communityId := c.Params("id")

	user := c.Locals("user").(*data.User)

	canDeleteCommunity := authorization.CanPerformAction(
		user.Id,
		fmt.Sprintf("group::%s", communityId),
		"delete",
	)

	if !canDeleteCommunity {
		return JSONAPI(c, 401, fiber.Map{
			"message": "Not authorized to perform this action",
		})
	}

	err := data.Communities.DeleteCommunity(data.DeleteCommunityCommand{
		Id: communityId,
	})

	if err != nil {
		return err
	}

	return JSONAPI(c, 200, fiber.Map{})
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
		Id:       incomingMessage.Id,
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

		slog.Debug("Sending new message", slog.Any("action", cmd.Action), slog.Any("receiverId", user.Id), slog.String("actorId", cmd.ActorId), slog.String("id", cmd.Id))

		cmd.Metadata["actorId"] = cmd.ActorId

		outgoingMsg := WebsocketMessage{
			Action:   fmt.Sprintf("@@SERVER-SENT/%s", cmd.Action),
			Payload:  cmd.Payload,
			Metadata: cmd.Metadata,
			Id:       cmd.Id,
		}

		if err = conn.WriteJSON(outgoingMsg); err != nil {
			slog.Warn("Error trying to send message", slog.Any("action", outgoingMsg.Action), slog.Any("error", err))

			return err
		}

		return nil
	}

	go func(conn *websocket.Conn) {
		for msg := range messagesForUserChannel {
			slog.Debug("We got a message for the user on the websocket", slog.String("id", msg.Id))
			select {
			case <-quit:
				slog.Debug("We have been asked to quit the messaging for user channel")
				return
			default:
				err := dispatchMessage(usecases.WebSocketMessageCmd{
					ActorId:  msg.ActorId,
					Payload:  msg.Payload,
					Action:   msg.Action,
					Metadata: msg.Metadata,
					Id:       msg.Id,
				}, conn)

				if err != nil {
					quit <- true
					return
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
	usecases.UseCases.UnsubscribeFromUserMessages(usecases.UnsubscribeToUserMessagesCmd{
		ActorId: user.Id,
		CTX:     context.TODO(),
	})
}
