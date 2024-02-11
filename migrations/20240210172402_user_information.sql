--
-- SQL Migration
--
-- This file describes the database migrations needed
-- for user_information. Be sure to write both up and down
-- so that we can roll this migration back.
--
-- This is assuming the language is PSQL
--
-- +goose Up

-- Allow users to store their name inside of Clerk and us store that
-- information here
ALTER TABLE users
    ADD COLUMN name TEXT,
    ADD COLUMN avatarUrl TEXT;

-- Allow display names inside of groups instead of just your name
ALTER TABLE message_group_members
    ADD COLUMN display_name TEXT;

ALTER TABLE message_group_members
    ADD CONSTRAINT only_allow_one_display_name_per_group UNIQUE(group_id, display_name);
-- +goose Down
ALTER TABLE message_group_members
    DROP COLUMN display_name;

ALTER TABLE users
    DROP COLUMN name,
    DROP COLUMN avatarUrl;