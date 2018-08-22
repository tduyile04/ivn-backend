'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (connectionString) {
  return require('knex')({
    client: 'pg',
    connection: connectionString,
    searchPath: ['knex', 'public']
  });
};