'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _waterfall2.default)(args, [checkQuery, fetchUsers, fmtResult]);
};

var _waterfall = require('../../../../lib/compose/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _error = require('../../../../lib/error');

var _models = require('../../../models');

var _models2 = _interopRequireDefault(_models);

var _paginate = require('../../../../lib/compose/paginate');

var _paginate2 = _interopRequireDefault(_paginate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Check query object
function checkQuery(req, res, callback) {
  var data = {};
  var _req$query = req.query,
      _req$query$limit = _req$query.limit,
      limit = _req$query$limit === undefined ? 10 : _req$query$limit,
      _req$query$page = _req$query.page,
      page = _req$query$page === undefined ? 1 : _req$query$page;

  if (isNaN(limit) || isNaN(page)) {
    limit = 10;
    page = 1;
  }
  data.query = { limit: Number(limit), page: Number(page) };
  return callback(null, data, res);
}

function fetchUsers(data, res, callback) {
  return (0, _models2.default)('user as u').leftJoin('user_role as ur', 'u.id', 'ur.user_id').leftJoin('role as r', 'ur.role_id', 'r.id').select(['u.id', 'u.email', 'u.firstName', 'u.lastName', 'r.name as roleName']).options({ nestTables: true }).then(function (users) {
    data.users = Object.values(users.reduce(function (acc, user) {
      if (acc[user.id]) {
        acc[user.id].roles.push(user.roleName);
      } else {
        acc[user.id] = user;
        acc[user.id].roles = [user.roleName];
        delete acc[user.id].roleName;
      }
      return acc;
    }, {}));
    return callback(null, data, res);
  }).catch(function (e) {
    return (0, _error.errorHandler)(e, res);
  });
}

function fmtResult(data, res, callback) {
  var result = (0, _paginate2.default)(data.users, data.query.page, data.query.limit);
  return callback(null, { users: result.data }, result.metadata);
}