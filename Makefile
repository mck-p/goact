#
# Tell Make that all of these are commands and not files to be ran
#
.PHONY: build build-client build-server \
		dev dev-client dev-server \
		setup setup-client setup-server \
		format format-server format-client \
		check-migrations migrate-up migrate-down

migrate-down:
	./scripts/rollback-database.sh

migrate-up:
	./scripts/migrate-database.sh
	
check-migrations:
	./scripts/check-migrations.sh

format-server:
	go fmt ./...

format-client:
	cd client && pnpm fmt

format: format-client format-server

setup-client:
	cd client && pnpm i

setup-server:
	go mod tidy

setup: setup-client setup-server

dev-client:
	cd client && pnpm dev

dev-server:
	go run .

dev: dev-server dev-client

start-services:
	docker compose -f docker-compose.services.yaml up -d

stop-services:
	docker compose -f docker-compose.services.yaml stop

reset-services:
	docker compose -f docker-compose.services.yaml down

#
# How do we generate the output of the React application?
#
build-client:
	cd client && pnpm build

#
# How do we generate the executable from the Go application?
#
build-server:
	GOOS=linux GOARCH=amd64 go build -o dist/main main.go 

#
# How do we generate all of the output?
# 
build: build-client build-server