'use strict';

var _models = require('../../models');

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
  return _models.db.query('SELECT u.*, p.role_id, r.name as role FROM "user_role" p LEFT JOIN "user" u ON u.id = p.user_id LEFT JOIN "role" r ON r.id = p.role_id WHERE u.id=$1', [user.id]).then(function (res) {
    req.auth = res.rows[0];
    req.auth.roles = res.rows.map(function (row) {
      return {
        id: row.role_id,
        name: row.role
      };
    });
    return callback(null);
  }).catch(function (error) {
    console.log(error);return res.status(403).json(util.response);
  });
};

module.exports = auth;