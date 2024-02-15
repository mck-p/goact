--
-- SQL Migration
--
-- This file describes the database migrations needed
-- for communities. Be sure to write both up and down
-- so that we can roll this migration back.
--
-- This is assuming the language is PSQL
--
-- +goose Up
CREATE TABLE communities (
    _id UUID NOT NULL DEFAULT gen_random_uuid(),
    is_public BOOLEAN NOT NULL,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (_id)
);

CREATE TABLE community_members (
    community_id UUID NOT NULL,
    user_id UUID NOT NULL,
    joined TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (community_id)
        REFERENCES communities(_id)
            ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES users(_id)
            ON DELETE CASCADE,
    UNIQUE(community_id, user_id)
);

-- +goose Down
DROP TABLE community_members;
DROP TABLE communities;