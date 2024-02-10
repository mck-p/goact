# Goact

## Overview

This is a base repo for using React client-side rendering and a Go backend,
using Clerk.com as the authentication service

## Features

- Websocket Messages
  - You can go to `/messages` on the client and send yourself messages.
    - You can create multiple "groups" and send messages to each "group"
      that you have created. We are working on the ability to add other users
      to these groups so that you can have DMs and Group Messages. This is the
      start of that functionality and is subject to change
  - We have connected the Client code to the Server code via Websockets
    - The interface is still being figured out and is subject to change
    - The Websocket messages are integrated with Redux so that all messages that come
      from the Websocket messages server are sent directly to the Redux store in order to
      allow us to trigger logic based on server-sent events in the same way we
      would handle it if the client sent the event themselves
- Swagger Docs
  - You can go to `/docs` on the API service to find Swagger docs and a UI for
    exploring the APIs available.
- Authentication via [Clerk](https://clerk.dev)
  - We are syncing the data from Clerk into the application [via webhooks](https://clerk.com/docs/users/sync-data)
  - You will need to register the appropriate URL for your environment in your own Clerk dashboard
    - If you do not, you will not have Users inside of the database automatically when they sign
      up in Clerk. Which means you will need to manually `INSERT INTO users(externalId) VALUES('user_id_123')`
      each time you want to onboard a User.recreate
    - For local development/testing, we are using [`ngrok`](https://ngrok.com/)

## Development

### Backing Services

```sh
make start-services # start services
make stop-services # stop services, keeps data
make restart-services # destroy services, loses data
```

### API

```sh
make dev-server # go run .
```

### Client

```sh
make dev-client # cd client && pnpm dev
```
