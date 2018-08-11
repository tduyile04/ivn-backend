'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _waterfall2.default)(args, [checkBody, validateAnswer, findCandidate, findQuestion, findAnswer, checkTargetCandidate, createAnswer, saveAnswer, fmtResult]);
};

var _bodyChecker = require('body-checker');

var _bodyChecker2 = _interopRequireDefault(_bodyChecker);

var _waterfall = require('../../../../lib/compose/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _models = require('../../../models');

var _models2 = _interopRequireDefault(_models);

var _error = require('../../../../lib/error');

var _util = require('../../notification/controllers/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkBody(req, res, callback) {
  var data = {};
  return (0, _bodyChecker2.default)(req.body, {
    question: {
      type: 'string',
      required: true
    },
    answer: {
      type: 'string',
      required: true
    }
  }, function (err, body) {
    if (err) {
      return callback({ message: 'Answer ' + err, code: 400 }); // eslint-disable-line
    }
    data.auth = req.auth;
    data.fields = body;
    return callback(null, data, res);
  });
}

// Notifications


function validateAnswer(data, res, callback) {
  if (data.fields.answer.length > 255) {
    return callback({ message: 'Answer cannot be more that 255 characters long', code: 400 }); // eslint-disable-line
  }
  return callback(null, data, res);
}

function findCandidate(data, res, callback) {
  var errorMessage = { message: 'Unauthorized', code: 403 };
  if (data.auth.roles.filter(function (r) {
    return r.name === 'candidate';
  }).length === 0) {
    return callback(errorMessage);
  }
  return callback(null, data, res);
}

function findQuestion(data, res, callback) {
  return (0, _models2.default)('question').where({ id: data.fields.question }).select('*').then(function (result) {
    if (result.length === 1) {
      data.question = result[0];
      return callback(null, data, res);
    }
    return callback({ message: 'Question not found', code: 404 }); // eslint-disable-line
  }).catch(function () {
    return callback({ message: 'Question not found', code: 404 });
  }); // eslint-disable-line
}

function findAnswer(data, res, callback) {
  return (0, _models2.default)('answer').where({ question_id: data.question.id }).select('id').then(function (result) {
    return result.length === 1 ? callback({ message: 'Question already answered', code: 409 }) // eslint-disable-line
    : callback(null, data, res);
  }).catch(function (e) {
    return (0, _error.errorHandler)(e, res);
  });
}

function checkTargetCandidate(data, res, callback) {
  if (data.auth.id !== data.question.candidate_id) {
    return callback({ message: 'Unauthorized', code: 403 }); // eslint-disable-line
  }
  return callback(null, data, res);
}

function createAnswer(data, res, callback) {
  data.answer = {
    answer: data.fields.answer,
    candidate_id: data.auth.id,
    question_id: data.question.id
  };
  return callback(null, data, res);
}

function saveAnswer(data, res, callback) {
  return (0, _models2.default)('answer').returning(['id', 'answer', 'question_id']).insert(data.answer).then(function (response) {
    data.answer = response[0];
    return callback(null, data, res);
  }).catch(function (e) {
    return (0, _error.errorHandler)(e, res);
  });
}

function fmtResult(data, res, callback) {
  var notification = {
    note: data.auth.firstName + ' ' + data.auth.lastName + ' just answered your question',
    context: 'question_answer',
    sender_id: data.auth.id,
    owner_id: data.question.asker_id
  };
  (0, _util.createNotifications)(notification);
  return callback(null, { statusCode: 201, answer: data.answer });
}