'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _waterfall2.default)(args, [checkQuery, fetchUser, fmtResult]);
};

var _waterfall = require('../../../../lib/compose/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _models = require('../../../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Check query object
function checkQuery(req, res, callback) {
  var data = { query: req.query, user: { id: req.params.user_id } };
  return callback(null, data, res);
}

function fetchUser(data, res, callback) {
  return (0, _models2.default)('user as u').leftJoin('user_role as ur', 'u.id', 'ur.user_id').leftJoin('role as r', 'ur.role_id', 'r.id').select(['u.id', 'u.email', 'u.firstName', 'u.lastName', 'r.name as roleName']).where(_models2.default.raw('u.id = ?', [data.user.id])).options({ nestTables: true }).then(function (rows) {
    if (rows.length === 0) {
      return callback({ message: 'User not found', code: 404 }); // eslint-disable-line
    }
    data.user = Object.values(rows.reduce(function (acc, user) {
      if (acc[user.id]) {
        acc[user.id].roles.push(user.roleName);
      } else {
        acc[user.id] = user;
        acc[user.id].roles = [user.roleName];
        delete acc[user.id].roleName;
      }
      return acc;
    }, {}))[0];
    return callback(null, data, res);
  }).catch(function () {
    return callback({ message: 'User not found', code: 404 });
  }); // eslint-disable-line
}

function fmtResult(data, res, callback) {
  return callback(null, { user: data.user });
}