package server

import (
	"fmt"
	"log/slog"

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

func createPrefixedRoutes(prefix string, routes []Route) []Route {
	result := []Route{}

	for _, route := range routes {
		slog.Debug("Creating new route",
			slog.String("route path", route.Path),
			slog.String("route method", route.Method),
		)

		path := route.Path

		if path != "" {

			path = fmt.Sprintf("%s/%s", prefix, path)
		} else {
			path = prefix
		}

		slog.Debug("Built path", slog.String("path", path))

		result = append(result, Route{
			Handlers: route.Handlers,
			Method:   route.Method,
			Path:     path,
		})
	}

	return result
}

var docRoutes = createPrefixedRoutes("docs", []Route{
	{
		Method: "get",
		Path:   "docs/*",
		Handlers: []fiber.Handler{
			swagger.HandlerDefault,
		},
	},
})

var internalRoutes = createPrefixedRoutes(".well-known", []Route{
	{
		Method:   "get",
		Path:     "healthcheck",
		Handlers: []fiber.Handler{Handlers.Healthcheck},
	},
})

var userRoutes = createPrefixedRoutes("users", []Route{
	{
		Method:   "get",
		Path:     ":id/messages",
		Handlers: []fiber.Handler{Middlewares.OnlyAuthenticated(), Handlers.GetMessages},
	},
	{
		Method:   "get",
		Path:     "external-id/:externalid",
		Handlers: []fiber.Handler{Middlewares.OnlyAuthenticated(), Handlers.GetUserByExternalId},
	},
	{
		Method:   "get",
		Path:     ":id",
		Handlers: []fiber.Handler{Middlewares.OnlyAuthenticated(), Handlers.GetUserById},
	},
})

var weatherRoutes = createPrefixedRoutes("weather", []Route{
	{
		Method:   "get",
		Path:     "",
		Handlers: []fiber.Handler{Middlewares.OnlyAuthenticated(), Handlers.GetWeather},
	},
})

var webhookRoutes = createPrefixedRoutes("webhooks", []Route{
	{
		Method:   "post",
		Path:     "",
		Handlers: []fiber.Handler{Handlers.Webhook},
	},
})

var websocketRoutes = createPrefixedRoutes("ws", []Route{
	{
		Method: "get",
		Path:   "",
		Handlers: []fiber.Handler{websocket.New(Handlers.WebsocketHandler, websocket.Config{
			Subprotocols: []string{
				// Allow the connection to send Authorization tokens
				// via Sec-WebSocket-Protocol header
				"Authentication",
			},
		})},
	},
})

var messageRoutes = createPrefixedRoutes("messaages", []Route{
	{
		Method:   "get",
		Path:     "groups/:id",
		Handlers: []fiber.Handler{Middlewares.OnlyAuthenticated(), Handlers.GetGroupMessages},
	},
	{
		Method:   "get",
		Path:     "groups",
		Handlers: []fiber.Handler{Middlewares.OnlyAuthenticated(), Handlers.GetGroups},
	},
	{
		Method:   "post",
		Path:     "groups",
		Handlers: []fiber.Handler{Middlewares.OnlyAuthenticated(), Handlers.CreateMessageGroup},
	},
})

var communityRoutes = createPrefixedRoutes("communities", []Route{
	{
		Method:   "post",
		Path:     "",
		Handlers: []fiber.Handler{Middlewares.OnlyAuthenticated(), Handlers.CreateCommunity},
	},
})

var apiRoutes = [][]Route{
	userRoutes,
	messageRoutes,
	communityRoutes,
	weatherRoutes,
	webhookRoutes,
}

func generateApiRoutes() []Route {
	api := []Route{}

	for _, routes := range apiRoutes {
		api = append(api, createPrefixedRoutes("api/v1", routes)...)
	}

	return api
}

/*
*

	List of all routes we want to make accessible
*/
func GenerateRoutes() []Route {
	routes := []Route{}

	routes = append(routes, docRoutes...)

	routes = append(routes, internalRoutes...)
	routes = append(routes, websocketRoutes...)

	routes = append(routes, generateApiRoutes()...)

	return routes
}
