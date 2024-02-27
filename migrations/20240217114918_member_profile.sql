--
-- SQL Migration
--
-- This file describes the database migrations needed
-- for member_profile. Be sure to write both up and down
-- so that we can roll this migration back.
--
-- This is assuming the language is PSQL
--
-- +goose Up
ALTER TABLE
    community_members
ADD COLUMN
    profile JSONB NOT NULL DEFAULT '{}';

ALTER TABLE
    communities
ADD COLUMN
    profile_schema JSONB NOT NULL DEFAULT '{}';
-- +goose Down
ALTER TABLE
    community_members
DROP COLUMN
    profile;

ALTER TABLE
    communities
DROP COLUM
    profile_schema;
    
