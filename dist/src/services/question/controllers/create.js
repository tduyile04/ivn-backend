'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _waterfall2.default)(args, [checkBody, validateQuestion, findCandidate, createQuestion, saveQuestion, fmtResult]);
};

var _bodyChecker = require('body-checker');

var _bodyChecker2 = _interopRequireDefault(_bodyChecker);

var _waterfall = require('../../../../lib/compose/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _models = require('../../../models');

var _models2 = _interopRequireDefault(_models);

var _error = require('../../../../lib/error');

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkBody(req, res, callback) {
  var data = {};
  return (0, _bodyChecker2.default)(req.body, {
    question: {
      type: 'string',
      required: true
    },
    candidate: {
      type: 'string',
      required: true
    }
  }, function (err, body) {
    if (err) {
      return callback({ message: 'Question ' + err, code: 400 }); // eslint-disable-line
    }
    data.auth = req.auth;
    data.fields = body;
    return callback(null, data, res);
  });
}

function validateQuestion(data, res, callback) {
  if (data.fields.question.length > 255) {
    return callback({ message: 'Question cannot be more that 255 characters long', code: 400 }); // eslint-disable-line
  }
  return callback(null, data, res);
}

function findCandidate(data, res, callback) {
  var errorMessage = { message: 'Candidate not found', code: 404 };
  return (0, _util.fetchCandidate)(data.fields.candidate).then(function () {
    return callback(null, data, res);
  }).catch(function () {
    return callback(errorMessage);
  });
  // return knex('user as u')
  //   .leftJoin('user_role as ur', 'u.id', 'ur.user_id')
  //   .leftJoin('role as r', 'ur.role_id', 'r.id')
  //   .select(['u.id', 'r.name as roleName'])
  //   .where(knex.raw('u.id = ?', [data.fields.candidate]))
  //   .then(result => {
  //     if (result.length === 0) {
  //       return callback(errorMessage)
  //     } else if (result.filter(r => r.roleName === 'candidate').length === 0) {
  //       return callback(errorMessage)
  //     }
  //     return callback(null, data, res)
  //   })
}

function createQuestion(data, res, callback) {
  data.question = {
    question: data.fields.question,
    candidate_id: data.fields.candidate,
    asker_id: data.auth.id
  };
  return callback(null, data, res);
}

function saveQuestion(data, res, callback) {
  return (0, _models2.default)('question').returning(['id', 'question', 'candidate_id']).insert(data.question).then(function (response) {
    data.question = response[0];
    return callback(null, data, res);
  }).catch(function (e) {
    return (0, _error.errorHandler)(e, res);
  });
}

function fmtResult(data, res, callback) {
  return callback(null, { statusCode: 201, question: data.question });
}