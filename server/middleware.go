package server

import (
	"strings"

	"mck-p/goact/token"

	"github.com/gofiber/fiber/v2"
)

type Middleware struct{}

var Middlewares = &Middleware{}

/*
Only sets the Locals("claims") value, does not gate
*/
func (m *Middleware) BearerAuthentication() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Step 1. Get Value from Header
		possibleValue := c.Get("Authorization")
		withoutBearer := strings.Replace(possibleValue, "Bearer ", "", 1)

		// If they did not give us a token, skip
		if withoutBearer == "" {
			return c.Next()
		}

		// Step 2. Parse token
		claims, err := token.Parse(withoutBearer)

		if err != nil {
			return c.Next()
		}

		// Step 3. Allow for all downchain handlers to
		// 			use the claims
		c.Locals("claims", claims)

		return c.Next()
	}
}

/*
*

	Only checks the Locals("claims") value, does not parse tokens
*/
func (m *Middleware) OnlyAuthenticated() fiber.Handler {
	return func(c *fiber.Ctx) error {
		possibleClaims := c.Locals("claims")

		// Claims is empty so we can assume we
		// either failed to parse or they did
		// not give us anything to parse
		if possibleClaims == nil {
			// We do not have a claims locally
			// so we need to fail
			return JSONAPI(c, 401, ErrorResponse[GenericError]{
				Error: GenericError{
					Message: "You are not authenticated. Please try authenticating in some form or fashion and trying your request again.",
				},
			})
		}

		// We know that claims is _something_ so we can
		// move on
		return c.Next()
	}
}