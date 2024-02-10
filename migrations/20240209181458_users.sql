--
-- SQL Migration
--
-- This file describes the database migrations needed
-- for users. Be sure to write both up and down
-- so that we can roll this migration back.
--
-- This is assuming the language is PSQL
--
-- +goose Up
CREATE TABLE users(
    _id UUID NOT NULL DEFAULT gen_random_uuid(),
    externalId TEXT NOT NULL UNIQUE,
    PRIMARY KEY (_id)
);

-- +goose Down
DROP TABLE users;