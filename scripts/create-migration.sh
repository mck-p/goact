#!/bin/sh

TIMESTAMP=$(date "+%Y%m%d%H%M%S")
MIGRATION_NAME="$1"
UNIQUE_NAME=${TIMESTAMP}_${MIGRATION_NAME}
FILENAME="./migrations/$UNIQUE_NAME.sql"
touch $FILENAME
cat <<EOT >> $FILENAME
--
-- SQL Migration
--
-- This file describes the database migrations needed
-- for $MIGRATION_NAME. Be sure to write both up and down
-- so that we can roll this migration back.
--
-- This is assuming the language is PSQL
--
-- +goose Up

-- +goose Down
EOT