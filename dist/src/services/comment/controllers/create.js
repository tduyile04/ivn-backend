'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _waterfall2.default)(args, [checkBody, validateComment, findQuestion, createComment, saveComment, fmtResult]);
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
  var data = {};
  return (0, _bodyChecker2.default)(req.body, {
    question: {
      type: 'string',
      required: true
    },
    comment: {
      type: 'string',
      required: true
    }
  }, function (err, body) {
    if (err) {
      return callback({ message: 'Comment ' + err, code: 400 }); // eslint-disable-line
    }
    data.auth = req.auth;
    data.fields = body;
    return callback(null, data, res);
  });
}

function validateComment(data, res, callback) {
  if (data.fields.comment.length > 255) {
    return callback({ message: 'Comment cannot be more that 255 characters long', code: 400 }); // eslint-disable-line
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

function createComment(data, res, callback) {
  data.comment = {
    comment: data.fields.comment,
    question_id: data.question.id,
    user_id: data.auth.id
  };
  return callback(null, data, res);
}

function saveComment(data, res, callback) {
  return (0, _models2.default)('comment').returning('*').insert(data.comment).then(function (response) {
    data.comment = response[0];
    return callback(null, data, res);
  }).catch(function (e) {
    return (0, _error.errorHandler)(e, res);
  });
}

function fmtResult(data, res, callback) {
  return callback(null, { statusCode: 201, comment: data.comment });
}