'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.db = undefined;

var _pg = require('pg');

var _knex = require('knex');

var _knex2 = _interopRequireDefault(_knex);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var client = new _pg.Client(require('../../knexfile')[process.env.NODE_ENV].connection);
client.connect();
var db = exports.db = client;

exports.default = (0, _knex2.default)(require('../../knexfile')[process.env.NODE_ENV]);