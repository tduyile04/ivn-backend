#! /bin/bash

sh ./scripts/export.sh;

npx babel-node src/server.js;

