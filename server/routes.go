package server

import (
	"github.com/gofiber/contrib/websocket"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/swagger"
)

type Route struct {
	// HTTP Method
	Method   string
	Path     string
	Handlers []fiber.Handler
}

/*
*

	List of all routes we want to make accessible
*/
var routes = []Route{
	{
		Method: "get",
		Path:   "/docs/*",
		Handlers: []fiber.Handler{
			swagger.HandlerDefault,
		},
	},
	{
		Method:   "get",
		Path:     "/.well-known/healthcheck",
		Handlers: []fiber.Handler{Handlers.Healthcheck},
	},
	{
		Method:   "get",
		Path:     "/api/v1/users/:id/messages",
		Handlers: []fiber.Handler{Middlewares.OnlyAuthenticated(), Handlers.GetMessages},
	},
	{
		Method:   "get",
		Path:     "/api/v1/weather",
		Handlers: []fiber.Handler{Middlewares.OnlyAuthenticated(), Handlers.GetWeather},
	},
	{
		Method:   "post",
		Path:     "/api/v1/webhooks",
		Handlers: []fiber.Handler{Handlers.Webhook},
	},
	{
		Method: "get",
		Path:   "/ws",
		Handlers: []fiber.Handler{websocket.New(Handlers.WebsocketHandler, websocket.Config{
			Subprotocols: []string{
				// Allow the connection to send Authorization tokens
				// via Sec-WebSocket-Protocol header
				"Authentication",
			},
		})},
	},
	{
		Method:   "get",
		Path:     "/api/v1/users/external-id/:externalid",
		Handlers: []fiber.Handler{Middlewares.OnlyAuthenticated(), Handlers.GetUserByExternalId},
	},
}
