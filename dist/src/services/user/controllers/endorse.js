'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _waterfall2.default)(args, [checkBody, validateBody, findUser, findEndorsed, createRelationship, saveRelationship, fmtResult]);
};

var _bodyChecker = require('body-checker');

var _bodyChecker2 = _interopRequireDefault(_bodyChecker);

var _waterfall = require('../../../../lib/compose/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _models = require('../../../models');

var _models2 = _interopRequireDefault(_models);

var _error = require('../../../../lib/error');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkBody(req, res, callback) {
  return (0, _bodyChecker2.default)(req.body, {
    user: {
      type: 'string',
      required: true
    }
  }, function (err, body) {
    if (err) return callback({ message: 'User ' + err, code: 400 }); // eslint-disable-line
    body.auth = req.auth;
    return callback(null, body, res);
  });
}

function validateBody(data, res, callback) {
  if (data.user === data.auth.id) {
    return callback({ message: 'Cannot endorse yourself', code: 400 }); // eslint-disable-line
  }
  return callback(null, data, res);
}

function findUser(data, res, callback) {
  return (0, _models2.default)('user as u').leftJoin('user_role as ur', 'u.id', 'ur.user_id').leftJoin('role as r', 'ur.role_id', 'r.id').select(['u.id', 'u.email', 'r.name as roleName']).where(_models2.default.raw('u.id = ?', [data.user])).options({ nestTables: true }).then(function (users) {
    var roles = users.map(function (u) {
      return u.roleName;
    });
    if (roles.indexOf('candidate') !== -1) {
      data.candidate = Object.assign({}, users[0]);
      return callback(null, data, res);
    }
    return callback({ message: 'Candidate not found', code: 404 }); // eslint-disable-line
  }).catch(function () {
    return callback({ message: 'Candidate not found', code: 404 });
  }); // eslint-disable-line
}

function findEndorsed(data, res, callback) {
  return (0, _models2.default)('user_endorse').where({ endorser_id: data.auth.id }).select('*').then(function (endorsments) {
    return endorsments.map(function (e) {
      return e.candidate_id;
    }).indexOf(data.user) === -1 ? callback(null, data, res) : callback({ message: 'Already endorsed this candidate', code: 409 }); // eslint-disable-line
  }).catch(function (error) {
    return (0, _error.errorHandler)(error, res);
  });
}

function createRelationship(data, res, callback) {
  var userEndorse = {
    endorser_id: data.auth.id,
    candidate_id: data.user
  };
  data.fields = userEndorse;
  return callback(null, data, res);
}

function saveRelationship(data, res, callback) {
  var fields = data.fields;

  return _models.db.query('INSERT INTO user_endorse (endorser_id, candidate_id) VALUES($1, $2)', [fields.endorser_id, fields.candidate_id]).then(function () {
    return callback(null, data, res);
  }).catch(function (error) {
    return (0, _error.errorHandler)(error, res);
  });
}

function fmtResult(data, res, callback) {
  return callback(null, { statusCode: 200, message: 'Endorsed user' });
}