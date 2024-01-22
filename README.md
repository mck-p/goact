# Goact

## Overview

This is a base repo for using React client-side rendering and a Go backend,
using Clerk.com as the authentication service

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
