'use strict';

var async = require('async');
var util = require('./util');
var _ = require('lodash');

var admin = function admin(req, res, next) {
  async.waterfall([async.apply(check, req, res), getAdmin], function (error, result) {
    return error ? res.status(403).json(util.response) : next();
  });
};

var check = function check(req, res, callback) {
  if (!util.isRole(req, 'admin')) return callback(new Error());
  return callback(null, req, res);
};

var getAdmin = function getAdmin(req, res, callback) {
  req.admin = _.clone(req.auth);
  return callback(null);
};

module.exports = admin;