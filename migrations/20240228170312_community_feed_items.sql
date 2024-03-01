--
-- SQL Migration
--
-- This file describes the database migrations needed
-- for community_feed_items. Be sure to write both up and down
-- so that we can roll this migration back.
--
-- This is assuming the language is PSQL
--
-- +goose Up
CREATE TABLE community_feed_items (
    _id UUID NOT NULL DEFAULT gen_random_uuid(),
    type TEXT NOT NULl,
    author_id UUID NOT NULL,
    community_id UUID NOT NULL,
    data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (_id),
    FOREIGN KEY (author_id)
        REFERENCES users(_id)
        ON DELETE
            CASCADE,
    FOREIGN KEY (community_id)
        REFERENCES communities(_id)
        ON DELETE
            CASCADE
);

-- +goose Down
DROP TABLE community_feed_items;
