#!/bin/sh

#
# This requires goose to be installed
# https://github.com/pressly/goose
#

DEFAULT_DRIVER="postgres"
DRIVER="${GOOSE_DRIVER:-$DEFAULT_DRIVER}"

DEFAULT_STRING="postgres://username:ou812@0.0.0.0:9998/goact"
DB_STRING="${GOOSE_DBSTRING:-$DEFAULT_STRING}"

goose \
    -dir ./migrations \
    $DRIVER $DB_STRING status