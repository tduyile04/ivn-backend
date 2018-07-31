'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _waterfall2.default)(args, [checkBody, findUser, deactivateUser, fmtResult]);
};

var _waterfall = require('../../../../lib/compose/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _models = require('../../../models');

var _models2 = _interopRequireDefault(_models);

var _error = require('../../../../lib/error');

var _util = require('../../../util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkBody(req, res, callback) {
  var data = { auth: req.auth, user: { id: req.params.user_id } };
  if (!(0, _util.isAdmin)(data.auth.roles) && data.auth.id !== data.user.id) {
    return callback({ message: 'Unauthorized! You cannot access this resource', code: 403 }); // eslint-disable-line
  }
  return callback(null, data, res);
}

function findUser(data, res, callback) {
  return (0, _models2.default)('user').where({ id: data.user.id }).select('*').then(function (users) {
    return users.length > 0 ? callback(null, data, res) : callback({ message: 'User not found', code: 404 }); // eslint-disable-line
  }).catch(function () {
    return callback({ message: 'User not found', code: 404 });
  }); // eslint-disable-line
}

function deactivateUser(data, res, callback) {
  return (0, _models2.default)('user').where({ id: data.user.id }).del().then(function () {
    return callback(null, data, res);
  }).catch(function (error) {
    return (0, _error.errorHandler)(error, res);
  });
}

function fmtResult(data, res, callback) {
  return callback(null, { statusCode: 204 });
}