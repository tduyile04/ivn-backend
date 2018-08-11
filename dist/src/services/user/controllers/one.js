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

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Check query object
function checkQuery(req, res, callback) {
  var data = { query: req.query, user: { id: req.params.user_id } };
  return callback(null, data, res);
}

function fetchUser(data, res, callback) {
  var fields = ['id', 'email', 'avatar', 'firstName', 'lastName'].reduce(function (acc, field) {
    acc.push('user.' + field + ' as ' + field, 'follower.' + field + ' as follower_' + field, 'following.' + field + ' as following_' + field, 'endorsement.' + field + ' as endorsement_' + field);
    return acc;
  }, []);
  return (0, _models2.default)('user').leftJoin('user_role', 'user_role.user_id', 'user.id').leftJoin('role', 'role.id', 'user_role.role_id').leftJoin('user_follow as following_user', 'following_user.follower_id', 'user.id').leftJoin('user_follow as follower_user', 'follower_user.following_id', 'user.id').leftJoin('user_endorse', 'user_endorse.candidate_id', 'user.id').leftJoin('user as following', 'following.id', 'following_user.following_id').leftJoin('user as follower', 'follower.id', 'follower_user.follower_id').leftJoin('user as endorsement', 'endorsement.id', 'user_endorse.endorser_id').select(['role.id as role_id', 'role.name as role_name', 'follower.id as follower_id'].concat(fields)).where({ 'user.id': data.user.id }).options({ nestTables: true }).then(function (rows) {
    if (rows.length === 0) {
      return callback({ message: 'User not found', code: 404 }); // eslint-disable-line
    }
    data.user = (0, _util.formatUser)(rows);
    return callback(null, data, res);
  }).catch(function () {
    return callback({ message: 'User not found', code: 404 });
  }); // eslint-disable-line
}

function fmtResult(data, res, callback) {
  return callback(null, { user: data.user });
}