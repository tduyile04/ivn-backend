#! /bin/bash

sh ./scripts/export.sh;

npx knex migrate:$1 $2