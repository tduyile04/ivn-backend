'use strict';

var async = require('async');
var util = require('./util');
var _ = require('lodash');

var candidate = function candidate(req, res, next) {
  async.waterfall([async.apply(check, req, res), getCandidate], function (error, result) {
    return error ? res.status(403).json(util.response) : next();
  });
};

var check = function check(req, res, callback) {
  if (!util.isRole(req, 'candidate')) return callback(new Error());
  return callback(null, req, res);
};

var getCandidate = function getCandidate(req, res, callback) {
  req.candidate = _.clone(req.auth);
  return callback(null);
};

module.exports = candidate;