# Goact

## Overview

This is a base repo for using React client-side rendering and a Go backend,
using Clerk.com as the authentication service

## Features

- Websocket Messages
  - You can go to `/messages` on the client and send yourself messages.
    - This will not work unless you change the IDs we have hardcoded
      on that page due to the way it works currently. This is being developed
  - We have connected the Client code to the Server code via Websockets
  - The interface is still being figured out and is subject to change
  - The Webhooks are integrated with Redux so that all messages that come
    from the Webhooks server are sent directly to the Redux store in order to
    allow us to trigger logic based on server-sent events in the same way we
    would handle it if the client sent the event themselves
- Swagger Docs
  - You can go to `/docs` on the API service to find Swagger docs and a UI for
    exploring the APIs available.
- Authentication via [Clerk](clerk.dev)

## Development

### Backing Services

```sh
docker compose -f docker-compose.services.yaml up -d
```

### API

```sh
make dev-server # go run .
```

### Client

```sh
make dev-client # cd client && pnpm dev
```
