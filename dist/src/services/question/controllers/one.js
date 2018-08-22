'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _waterfall2.default)(args, [checkQuery, fetchQuestion, fmtResult]);
};

var _waterfall = require('../../../../lib/compose/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Check query object
function checkQuery(req, res, callback) {
  var data = { query: req.query, question: { id: req.params.question_id } };
  return callback(null, data, res);
}

function fetchQuestion(data, res, callback) {
  return _util2.default.get({ 'question.id': data.question.id }).then(function (rows) {
    if (rows.length === 0) {
      return callback({ message: 'Question not found', code: 404 }); // eslint-disable-line
    }
    data.question = (0, _util.fmtRawResponse)(rows)[0];
    return callback(null, data, res);
  }).catch(function () {
    return callback({ message: 'Question not found', code: 404 });
  }); // eslint-disable-line
}

function fmtResult(data, res, callback) {
  return callback(null, { question: data.question });
}