'use strict';

var _models = require('../../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var async = require('async');
var jwt = require('jsonwebtoken');
var util = require('./util');

var auth = function auth(req, res, next) {
  async.waterfall([async.apply(check, req, res), decodeToken, getUser], function (error) {
    return error ? res.status(403).json(util.response) : next();
  });
};

var check = function check(req, res, callback) {
  if (!util.isAuth(req)) return callback(new Error({ message: 'unauthorized' }));
  return callback(null, req, res);
};

var decodeToken = function decodeToken(req, res, callback) {
  var user = jwt.decode(req.headers.authorization, process.env.TOKEN_SECRET);
  return callback(null, req, res, user.data);
};

var getUser = function getUser(req, res, user, callback) {
  return (0, _models2.default)('user').leftJoin('user_role', 'user_role.user_id', 'user.id').leftJoin('role', 'role.id', 'user_role.role_id').select(['user.*', 'role.name as role_name', 'role.id as role_id']).where({ 'user.id': user.id }).then(function (result) {
    console.log(result);
    req.auth = Object.values(result.reduce(function (acc, u) {
      if (acc[u.id]) {
        u.role_id && acc[u.id].roles.push({ name: u.role_name, id: u.role_id });
      } else {
        acc[u.id] = u;
        acc[u.id].roles = u.role_id ? [{ name: u.role_name, id: u.role_id }] : [];
      }
      return acc;
    }, {}))[0];
    return callback(null);
  }).catch(function (error) {
    console.log(error);return res.status(403).json(util.response);
  });
};

module.exports = auth;