// Package docs Code generated by swaggo/swag. DO NOT EDIT
package docs

import "github.com/swaggo/swag"

const docTemplate = `{
    "schemes": {{ marshal .Schemes }},
    "swagger": "2.0",
    "info": {
        "description": "{{escape .Description}}",
        "title": "{{.Title}}",
        "contact": {
            "name": "API Support",
            "email": "support@mck-p.com"
        },
        "license": {
            "name": "MIT",
            "url": "https://opensource.org/license/mit/"
        },
        "version": "{{.Version}}"
    },
    "host": "{{.Host}}",
    "basePath": "{{.BasePath}}",
    "paths": {
        "/.well-known/healthcheck": {
            "get": {
                "description": "Can be used for both readiness and liveness",
                "produces": [
                    "application/vnd.api+json"
                ],
                "tags": [
                    "Internal"
                ],
                "summary": "Returns the health of the underlying system",
                "operationId": "Healthcheck",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/server.SuccessResponse-server_HealthcheckResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/server.ErrorResponse-server_HealthcheckResponse"
                        }
                    }
                }
            }
        },
        "/api/v1/communities": {
            "get": {
                "produces": [
                    "application/vnd.api+json"
                ],
                "tags": [
                    "Communities"
                ],
                "summary": "Retrieves the Communities that a User has access to",
                "operationId": "GetUserCommunities",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/server.SuccessResponse-array_data_Community"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/server.ErrorResponse-server_GenericError"
                        }
                    }
                }
            },
            "post": {
                "description": "This will create a new Community and assign the creator as the only memberof that community",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/vnd.api+json"
                ],
                "tags": [
                    "Communities"
                ],
                "summary": "Creates a new Community",
                "operationId": "CreateCommunity",
                "parameters": [
                    {
                        "description": "New Community Information",
                        "name": "requestBody",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/server.CreateCommunityRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/server.SuccessResponse-data_Community"
                        }
                    }
                }
            }
        },
        "/api/v1/communities/{id}": {
            "get": {
                "produces": [
                    "application/vnd.api+json"
                ],
                "tags": [
                    "Communities"
                ],
                "summary": "Retrieves the Community of a given ID",
                "operationId": "GetUserCommunityById",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/server.SuccessResponse-data_Community"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/server.ErrorResponse-server_GenericError"
                        }
                    }
                }
            }
        },
        "/api/v1/communities/{id}/members": {
            "get": {
                "produces": [
                    "application/vnd.api+json"
                ],
                "tags": [
                    "Communities"
                ],
                "summary": "Retrieves the Community of a given ID",
                "operationId": "GetCommunityMembers",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/server.SuccessResponse-array_data_User"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/server.ErrorResponse-server_GenericError"
                        }
                    }
                }
            }
        },
        "/api/v1/messages/groups": {
            "get": {
                "produces": [
                    "application/vnd.api+json"
                ],
                "tags": [
                    "Messages"
                ],
                "summary": "Retrieves the Message Groups that a User has access to",
                "operationId": "GetUserMessageGroups",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/server.SuccessResponse-server_GetGroupsResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/server.ErrorResponse-server_GenericError"
                        }
                    }
                }
            },
            "post": {
                "description": "This will create a new Message Group and assign the creator as the only authorized user of that message group",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/vnd.api+json"
                ],
                "tags": [
                    "Messages"
                ],
                "summary": "Creates a new Message Group",
                "operationId": "CreateMessageGroup",
                "parameters": [
                    {
                        "description": "Message Group Information",
                        "name": "requestBody",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "$ref": "#/definitions/server.MessageGroupRequest"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/server.SuccessResponse-data_MessageGroup"
                        }
                    }
                }
            }
        },
        "/api/v1/messages/groups/{:id}": {
            "get": {
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/server.SuccessResponse-server_GetMessageResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/server.ErrorResponse-server_GenericError"
                        }
                    }
                }
            }
        },
        "/api/v1/users/:id/messages": {
            "get": {
                "produces": [
                    "application/vnd.api+json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Retrieves the last N number of messages, given some offset",
                "operationId": "GetMessages",
                "parameters": [
                    {
                        "type": "string",
                        "description": "User ID",
                        "name": "id",
                        "in": "path",
                        "required": true
                    },
                    {
                        "type": "integer",
                        "description": "Limit for pagination",
                        "name": "limit",
                        "in": "query"
                    },
                    {
                        "type": "integer",
                        "description": "Offset for pagination",
                        "name": "offset",
                        "in": "query"
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/server.SuccessResponse-server_GetMessageResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/server.ErrorResponse-server_GenericError"
                        }
                    }
                }
            }
        },
        "/api/v1/users/external-id/{externalid}": {
            "get": {
                "security": [
                    {
                        "BearerToken": []
                    }
                ],
                "produces": [
                    "application/vnd.api+json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Returns the Goact User based on their external ID",
                "operationId": "GetUserByExternalId",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/server.SuccessResponse-data_User"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/server.ErrorResponse-server_GenericError"
                        }
                    }
                }
            }
        },
        "/api/v1/users/{id}": {
            "get": {
                "security": [
                    {
                        "BearerToken": []
                    }
                ],
                "produces": [
                    "application/vnd.api+json"
                ],
                "tags": [
                    "Users"
                ],
                "summary": "Returns the Goact User based on their internal ID",
                "operationId": "GetUserById",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/server.SuccessResponse-data_User"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/server.ErrorResponse-server_GenericError"
                        }
                    }
                }
            }
        },
        "/api/v1/weather": {
            "get": {
                "security": [
                    {
                        "BearerToken": []
                    }
                ],
                "produces": [
                    "application/vnd.api+json"
                ],
                "tags": [
                    "Weather"
                ],
                "summary": "Gets the last-checked weather conditions",
                "operationId": "GetWeather",
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/server.SuccessResponse-data_ForecastQueryUpstreamResponse"
                        }
                    },
                    "500": {
                        "description": "Internal Server Error",
                        "schema": {
                            "$ref": "#/definitions/server.ErrorResponse-server_GenericError"
                        }
                    }
                }
            }
        },
        "/api/v1/webhooks": {
            "post": {
                "description": "Handles incoming webhooks",
                "consumes": [
                    "application/json"
                ],
                "produces": [
                    "application/vnd.api+json"
                ],
                "tags": [
                    "Internal"
                ],
                "summary": "Handle Webhook",
                "operationId": "WebhookIngestion",
                "parameters": [
                    {
                        "description": "Webhook payload",
                        "name": "requestBody",
                        "in": "body",
                        "required": true,
                        "schema": {
                            "type": "object",
                            "additionalProperties": true
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "OK",
                        "schema": {
                            "$ref": "#/definitions/server.SuccessResponse-any"
                        }
                    }
                }
            }
        }
    },
    "definitions": {
        "data.AstroCondition": {
            "type": "object",
            "properties": {
                "is_sun_up": {
                    "type": "number"
                },
                "moon_illumination": {
                    "type": "number"
                },
                "moon_phase": {
                    "type": "string"
                },
                "moonrise": {
                    "type": "string"
                },
                "moonset": {
                    "type": "string"
                },
                "sunrise": {
                    "type": "string"
                },
                "sunset": {
                    "type": "string"
                }
            }
        },
        "data.Community": {
            "type": "object",
            "properties": {
                "_id": {
                    "type": "string"
                },
                "created_at": {
                    "type": "string"
                },
                "is_public": {
                    "type": "boolean"
                },
                "name": {
                    "type": "string"
                }
            }
        },
        "data.CurrentWeatherUpstreamResponse": {
            "type": "object",
            "properties": {
                "cloud": {
                    "type": "number"
                },
                "condition": {
                    "$ref": "#/definitions/data.WeatherCondition"
                },
                "feelslike_c": {
                    "type": "number"
                },
                "feelslike_f": {
                    "type": "number"
                },
                "gust_kph": {
                    "type": "number"
                },
                "gust_mph": {
                    "type": "number"
                },
                "humidity": {
                    "type": "number"
                },
                "precip_in": {
                    "type": "number"
                },
                "precip_mm": {
                    "type": "number"
                },
                "pressure_in": {
                    "type": "number"
                },
                "pressure_mb": {
                    "type": "number"
                },
                "temp_c": {
                    "type": "number"
                },
                "temp_f": {
                    "type": "number"
                },
                "uv": {
                    "type": "number"
                },
                "vis_km": {
                    "type": "number"
                },
                "vis_miles": {
                    "type": "number"
                },
                "wind_degree": {
                    "type": "number"
                },
                "wind_dir": {
                    "type": "string"
                },
                "wind_kph": {
                    "type": "number"
                },
                "wind_mph": {
                    "type": "number"
                }
            }
        },
        "data.DayWeatherUpstreamResponse": {
            "type": "object",
            "properties": {
                "avghumidity": {
                    "type": "number"
                },
                "avgtemp_c": {
                    "type": "number"
                },
                "avgtemp_f": {
                    "type": "number"
                },
                "avgvis_km": {
                    "type": "number"
                },
                "avgvis_miles": {
                    "type": "number"
                },
                "condition": {
                    "$ref": "#/definitions/data.WeatherCondition"
                },
                "daily_chance_of_rain": {
                    "type": "number"
                },
                "daily_chance_of_snow": {
                    "type": "number"
                },
                "daily_will_it_rain": {
                    "type": "number"
                },
                "daily_will_it_snow": {
                    "type": "number"
                },
                "maxtemp_c": {
                    "type": "number"
                },
                "maxtemp_f": {
                    "type": "number"
                },
                "mintemp_c": {
                    "type": "number"
                },
                "mintemp_f": {
                    "type": "number"
                },
                "totalprecip_in": {
                    "type": "number"
                },
                "totalprecip_mm": {
                    "type": "number"
                },
                "totalsnow_cm": {
                    "type": "number"
                },
                "uv": {
                    "type": "number"
                },
                "windchill_c": {
                    "type": "number"
                }
            }
        },
        "data.ForecastQueryUpstreamResponse": {
            "type": "object",
            "properties": {
                "current": {
                    "$ref": "#/definitions/data.CurrentWeatherUpstreamResponse"
                },
                "forecast": {
                    "type": "object",
                    "properties": {
                        "forecastday": {
                            "type": "array",
                            "items": {
                                "$ref": "#/definitions/data.ForecastUpstreamResponse"
                            }
                        }
                    }
                }
            }
        },
        "data.ForecastUpstreamResponse": {
            "type": "object",
            "properties": {
                "astro": {
                    "$ref": "#/definitions/data.AstroCondition"
                },
                "day": {
                    "$ref": "#/definitions/data.DayWeatherUpstreamResponse"
                },
                "hour": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/data.HourWeatherUpstreamResponse"
                    }
                }
            }
        },
        "data.HourWeatherUpstreamResponse": {
            "type": "object",
            "properties": {
                "condition": {
                    "$ref": "#/definitions/data.WeatherCondition"
                },
                "temp_c": {
                    "type": "number"
                },
                "temp_f": {
                    "type": "number"
                },
                "time": {
                    "type": "string"
                },
                "time_epoch": {
                    "type": "integer"
                },
                "windchill_c": {
                    "type": "number"
                },
                "windchill_f": {
                    "type": "number"
                }
            }
        },
        "data.MessageGroup": {
            "type": "object",
            "properties": {
                "_id": {
                    "type": "string"
                },
                "created_at": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                }
            }
        },
        "data.User": {
            "type": "object",
            "properties": {
                "_id": {
                    "type": "string"
                },
                "avatarUrl": {
                    "type": "string"
                },
                "externalid": {
                    "type": "string"
                },
                "name": {
                    "type": "string"
                }
            }
        },
        "data.WeatherCondition": {
            "type": "object",
            "properties": {
                "code": {
                    "type": "number"
                },
                "icon": {
                    "type": "string"
                },
                "text": {
                    "type": "string"
                }
            }
        },
        "server.CreateCommunityRequest": {
            "type": "object",
            "properties": {
                "is_public": {
                    "type": "boolean"
                },
                "name": {
                    "type": "string"
                }
            }
        },
        "server.ErrorResponse-server_GenericError": {
            "type": "object",
            "properties": {
                "error": {
                    "$ref": "#/definitions/server.GenericError"
                },
                "includes": {
                    "type": "array",
                    "items": {}
                },
                "links": {
                    "type": "object",
                    "additionalProperties": {
                        "$ref": "#/definitions/server.Link"
                    }
                },
                "metadata": {}
            }
        },
        "server.ErrorResponse-server_HealthcheckResponse": {
            "type": "object",
            "properties": {
                "error": {
                    "$ref": "#/definitions/server.HealthcheckResponse"
                },
                "includes": {
                    "type": "array",
                    "items": {}
                },
                "links": {
                    "type": "object",
                    "additionalProperties": {
                        "$ref": "#/definitions/server.Link"
                    }
                },
                "metadata": {}
            }
        },
        "server.GenericError": {
            "type": "object",
            "properties": {
                "message": {
                    "type": "string"
                }
            }
        },
        "server.GetGroupsResponse": {
            "type": "object",
            "properties": {
                "groups": {
                    "type": "array",
                    "items": {}
                }
            }
        },
        "server.GetMessageResponse": {
            "type": "object",
            "properties": {
                "messages": {
                    "type": "array",
                    "items": {}
                }
            }
        },
        "server.HealthcheckResponse": {
            "type": "object",
            "properties": {
                "healthy": {
                    "type": "boolean"
                },
                "status": {
                    "type": "integer"
                }
            }
        },
        "server.Link": {
            "type": "object",
            "properties": {
                "href": {
                    "type": "string"
                },
                "hreflang": {
                    "type": "string"
                },
                "link": {
                    "$ref": "#/definitions/server.Link"
                },
                "meta": {},
                "rel": {
                    "type": "string"
                },
                "title": {
                    "type": "string"
                }
            }
        },
        "server.MessageGroupRequest": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                }
            }
        },
        "server.SuccessResponse-any": {
            "type": "object",
            "properties": {
                "data": {},
                "includes": {
                    "type": "array",
                    "items": {}
                },
                "links": {
                    "type": "object",
                    "additionalProperties": {
                        "$ref": "#/definitions/server.Link"
                    }
                },
                "metadata": {}
            }
        },
        "server.SuccessResponse-array_data_Community": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/data.Community"
                    }
                },
                "includes": {
                    "type": "array",
                    "items": {}
                },
                "links": {
                    "type": "object",
                    "additionalProperties": {
                        "$ref": "#/definitions/server.Link"
                    }
                },
                "metadata": {}
            }
        },
        "server.SuccessResponse-array_data_User": {
            "type": "object",
            "properties": {
                "data": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/data.User"
                    }
                },
                "includes": {
                    "type": "array",
                    "items": {}
                },
                "links": {
                    "type": "object",
                    "additionalProperties": {
                        "$ref": "#/definitions/server.Link"
                    }
                },
                "metadata": {}
            }
        },
        "server.SuccessResponse-data_Community": {
            "type": "object",
            "properties": {
                "data": {
                    "$ref": "#/definitions/data.Community"
                },
                "includes": {
                    "type": "array",
                    "items": {}
                },
                "links": {
                    "type": "object",
                    "additionalProperties": {
                        "$ref": "#/definitions/server.Link"
                    }
                },
                "metadata": {}
            }
        },
        "server.SuccessResponse-data_ForecastQueryUpstreamResponse": {
            "type": "object",
            "properties": {
                "data": {
                    "$ref": "#/definitions/data.ForecastQueryUpstreamResponse"
                },
                "includes": {
                    "type": "array",
                    "items": {}
                },
                "links": {
                    "type": "object",
                    "additionalProperties": {
                        "$ref": "#/definitions/server.Link"
                    }
                },
                "metadata": {}
            }
        },
        "server.SuccessResponse-data_MessageGroup": {
            "type": "object",
            "properties": {
                "data": {
                    "$ref": "#/definitions/data.MessageGroup"
                },
                "includes": {
                    "type": "array",
                    "items": {}
                },
                "links": {
                    "type": "object",
                    "additionalProperties": {
                        "$ref": "#/definitions/server.Link"
                    }
                },
                "metadata": {}
            }
        },
        "server.SuccessResponse-data_User": {
            "type": "object",
            "properties": {
                "data": {
                    "$ref": "#/definitions/data.User"
                },
                "includes": {
                    "type": "array",
                    "items": {}
                },
                "links": {
                    "type": "object",
                    "additionalProperties": {
                        "$ref": "#/definitions/server.Link"
                    }
                },
                "metadata": {}
            }
        },
        "server.SuccessResponse-server_GetGroupsResponse": {
            "type": "object",
            "properties": {
                "data": {
                    "$ref": "#/definitions/server.GetGroupsResponse"
                },
                "includes": {
                    "type": "array",
                    "items": {}
                },
                "links": {
                    "type": "object",
                    "additionalProperties": {
                        "$ref": "#/definitions/server.Link"
                    }
                },
                "metadata": {}
            }
        },
        "server.SuccessResponse-server_GetMessageResponse": {
            "type": "object",
            "properties": {
                "data": {
                    "$ref": "#/definitions/server.GetMessageResponse"
                },
                "includes": {
                    "type": "array",
                    "items": {}
                },
                "links": {
                    "type": "object",
                    "additionalProperties": {
                        "$ref": "#/definitions/server.Link"
                    }
                },
                "metadata": {}
            }
        },
        "server.SuccessResponse-server_HealthcheckResponse": {
            "type": "object",
            "properties": {
                "data": {
                    "$ref": "#/definitions/server.HealthcheckResponse"
                },
                "includes": {
                    "type": "array",
                    "items": {}
                },
                "links": {
                    "type": "object",
                    "additionalProperties": {
                        "$ref": "#/definitions/server.Link"
                    }
                },
                "metadata": {}
            }
        }
    },
    "securityDefinitions": {
        "BearerToken": {
            "description": "JWT for authentication. Inclue Bearer",
            "type": "apiKey",
            "name": "Authorization",
            "in": "header"
        }
    }
}`

// SwaggerInfo holds exported Swagger Info so clients can modify it
var SwaggerInfo = &swag.Spec{
	Version:          "0.0.1",
	Host:             "localhost:8080",
	BasePath:         "/",
	Schemes:          []string{},
	Title:            "goact RESTful API",
	Description:      "goact API",
	InfoInstanceName: "swagger",
	SwaggerTemplate:  docTemplate,
	LeftDelim:        "{{",
	RightDelim:       "}}",
}

func init() {
	swag.Register(SwaggerInfo.InstanceName(), SwaggerInfo)
}
