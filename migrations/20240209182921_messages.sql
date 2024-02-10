--
-- SQL Migration
--
-- This file describes the database migrations needed
-- for messages. Be sure to write both up and down
-- so that we can roll this migration back.
--
-- This is assuming the language is PSQL
--
-- +goose Up
CREATE TABLE message_groups(
    _id UUID NOT NULL DEFAULT gen_random_uuid(),
    PRIMARY KEY (_id)
);

CREATE TABLE message_group_members(
    _id UUID NOT NULL DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL,
    user_id UUID NOT NULL,
    PRIMARY KEY (_id),
    FOREIGN KEY (group_id) REFERENCES message_groups(_id)
        ON DELETE
            CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(_id)
        ON DELETE
            CASCADE,
    UNIQUE (group_id, user_id)
);

CREATE TABLE messages(
    _id UUID NOT NULL DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL,
    group_id UUID NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (_id),
    FOREIGN KEY (author_id) REFERENCES users(_id),
    FOREIGN KEY (group_id) REFERENCES message_groups(_id)
);

-- +goose Down
DROP TABLE messages;
DROP TABLE message_group_members;
DROP TABLE message_groups;