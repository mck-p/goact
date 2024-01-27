package server

import (
	"encoding/json"
	"fmt"
	"log/slog"
	"strings"

	_ "mck-p/goact/docs"
	"mck-p/goact/tracer"

	"github.com/gofiber/contrib/otelfiber"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
	slogfiber "github.com/samber/slog-fiber"
	"golang.org/x/xerrors"
)

type Server struct {
	app *fiber.App
}

func (server *Server) Start(port int) error {
	err := server.app.Listen(fmt.Sprintf(":%d", port))

	if err != nil {
		slog.Warn("Error on listen", slog.Any("error", err))

		return xerrors.Errorf("Error during listening on port %d", port)
	}

	return nil
}

func JSONAPI(c *fiber.Ctx, status int, data interface{}) error {
	c.Set("Content-Type", "application/vnd.api+json")
	c.Status(status)

	jsonData, err := json.Marshal(data)

	if err != nil {
		return err
	}

	return c.Send(jsonData)
}

//	@title			goact RESTful API
//	@version		0.0.1
//	@description	goact API

//	@contact.name	API Support
//	@contact.email	support@mck-p.com

//	@license.name	MIT
//	@license.url	https://opensource.org/license/mit/

//	@host		localhost:8080
//	@BasePath	/

// @securityDefinitions.apikey	BearerToken
// @in							header
// @name						Authorization
// @description					JWT for authentication. Inclue Bearer
// @schema						Bearer
func New() *Server {
	tracer.InitTracer()
	app := fiber.New()

	app.Use(otelfiber.Middleware())
	app.Use(slogfiber.New(slog.Default()))
	app.Use(recover.New())
	app.Use(cors.New())
	app.Use(Middlewares.BearerAuthentication())
	app.Use("/ws", Middlewares.WebsocketUpgrade())

	for _, route := range routes {
		switch strings.ToLower(route.Method) {
		case "get":
			app.Get(route.Path, route.Handlers...)
		case "post":
			app.Post(route.Path, route.Handlers...)
		case "patch":
			app.Patch(route.Path, route.Handlers...)
		case "put":
			app.Put(route.Path, route.Handlers...)
		case "delete":
			app.Delete(route.Path, route.Handlers...)
		case "head":
			app.Head(route.Path, route.Handlers...)
		case "options":
			app.Options(route.Path, route.Handlers...)
		default:
			slog.Warn("Route found with no matching method", slog.String("method", route.Method))
		}
	}

	return &Server{
		app: app,
	}
}
