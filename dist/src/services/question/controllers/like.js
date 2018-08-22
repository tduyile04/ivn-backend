'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _waterfall2.default)(args, [checkBody, findQuestion, findLiked, createLike, saveAnswer, fmtResult]);
};

var _waterfall = require('../../../../lib/compose/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _models = require('../../../models');

var _models2 = _interopRequireDefault(_models);

var _error = require('../../../../lib/error');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkBody(req, res, callback) {
  var data = {};
  data.auth = req.auth;
  data.question = { id: req.params.question_id };
  return callback(null, data, res);
}

function findQuestion(data, res, callback) {
  return (0, _models2.default)('question').where({ id: data.question.id }).select('*').then(function (result) {
    if (result.length === 1) {
      data.question = result[0];
      return callback(null, data, res);
    }
    return callback({ message: 'Question not found', code: 404 }); // eslint-disable-line
  }).catch(function () {
    return callback({ message: 'Question not found', code: 404 });
  }); // eslint-disable-line
}

function findLiked(data, res, callback) {
  return (0, _models2.default)('question_like').where({ user_id: data.auth.id, question_id: data.question.id }).then(function (result) {
    if (result.length === 1) {
      data.liked = true;
      data.like = result[0];
    }
    return callback(null, data, res);
  }).catch(function (e) {
    return (0, _error.errorHandler)(e, res);
  });
}

function createLike(data, res, callback) {
  if (!data.liked) {
    data.like = {
      user_id: data.auth.id,
      question_id: data.question.id
    };
  }
  return callback(null, data, res);
}

function saveAnswer(data, res, callback) {
  return (data.liked ? (0, _models2.default)('question_like').where({ id: data.like.id }).del() : (0, _models2.default)('question_like').returning('*').insert(data.like)).then(function (response) {
    data.like = response[0];
    return callback(null, data, res);
  }).catch(function (e) {
    return (0, _error.errorHandler)(e, res);
  });
}

function fmtResult(data, res, callback) {
  return callback(null, { statusCode: data.liked ? 204 : 201, question: data.question });
}