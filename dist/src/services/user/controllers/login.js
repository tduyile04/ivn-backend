'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _waterfall2.default)(args, [checkBody, validateEmail, validatePassword, findUser, validateHash, generateToken, fmtResult]);
};

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _bodyChecker = require('body-checker');

var _bodyChecker2 = _interopRequireDefault(_bodyChecker);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _waterfall = require('../../../../lib/compose/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _models = require('../../../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var errRes = { message: 'Email and password do not match', code: 400 };

function checkBody(req, res, callback) {
  var data = {};
  return (0, _bodyChecker2.default)(req.body, {
    email: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    }
  }, function (err, body) {
    if (err) return callback({ message: 'User ' + err, code: 400 }); // eslint-disable-line
    data.fields = body;
    return callback(null, data, res);
  });
}

function validateEmail(data, res, callback) {
  if (!_validator2.default.isEmail(data.fields.email)) {
    return callback(errRes); // eslint-disable-line
  }
  return callback(null, data, res);
}

function validatePassword(data, res, callback) {
  if (data.fields.password.length < 8) {
    return callback(errRes); // eslint-disable-line
  }
  return callback(null, data, res);
}

function findUser(data, res, callback) {
  return (0, _models2.default)('user').where({ email: data.fields.email }).select(['id', 'email', 'firstName', 'lastName', 'avatar', 'password']).then(function (user) {
    return user.length === 0 ? callback(errRes) : callback(null, Object.assign({}, data, { user: user[0] }), res); // eslint-disable-line
  });
}

function validateHash(data, res, callback) {
  return _bcrypt2.default.compare(data.fields.password, data.user.password, function (err, res) {
    if (err || !res) return callback(errRes);
    return callback(null, data, res);
  });
}

function generateToken(data, res, callback) {
  var token = _jsonwebtoken2.default.sign({ data: { id: data.user.id } }, process.env.TOKEN_SECRET, { expiresIn: '23h' });
  data.user.token = token;
  callback(null, data, res);
}

function fmtResult(data, res, callback) {
  return callback(null, { statusCode: 200, user: data.user });
}