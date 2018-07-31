'use strict';

var async = require('async');
var util = require('./util');
var _ = require('lodash');

var politician = function politician(req, res, next) {
  async.waterfall([async.apply(check, req, res), getPolitician], function (error, result) {
    return error ? res.status(403).json(util.response) : next();
  });
};

var check = function check(req, res, callback) {
  if (!util.isRole(req, 'politician')) return callback(new Error());
  return callback(null, req, res);
};

var getPolitician = function getPolitician(req, res, callback) {
  req.politician = _.clone(req.auth);
  return callback(null);
};

module.exports = politician;