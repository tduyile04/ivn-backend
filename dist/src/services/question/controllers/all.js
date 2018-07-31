'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _waterfall2.default)(args, [checkQuery, findCandidate, fetchQuestions, fmtResult]);
};

var _waterfall = require('../../../../lib/compose/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _util = require('./util');

var _util2 = _interopRequireDefault(_util);

var _error = require('../../../../lib/error');

var _paginate = require('../../../../lib/compose/paginate');

var _paginate2 = _interopRequireDefault(_paginate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Check query object
function checkQuery(req, res, callback) {
  var data = {};
  var _req$query = req.query,
      _req$query$limit = _req$query.limit,
      limit = _req$query$limit === undefined ? 10 : _req$query$limit,
      _req$query$page = _req$query.page,
      page = _req$query$page === undefined ? 1 : _req$query$page,
      candidate = _req$query.candidate;

  if (isNaN(limit) || isNaN(page)) {
    limit = 10;
    page = 1;
  }
  data.query = { limit: Number(limit), page: Number(page), candidate: candidate };
  return callback(null, data, res);
}

function findCandidate(data, res, callback) {
  var errorMessage = { message: 'Candidate not found', code: 404 };
  if (data.query.candidate) {
    return (0, _util.fetchCandidate)(data.query.candidate).then(function () {
      return callback(null, data, res);
    }).catch(function () {
      return callback(errorMessage);
    });
  }
  return callback(null, data, res);
}

function fetchQuestions(data, res, callback) {
  return _util2.default.get({}).then(function (rows) {
    data.questions = (0, _util.fmtRawResponse)(rows);
    return callback(null, data, res);
  }).catch(function (e) {
    return (0, _error.errorHandler)(e, res);
  });
}

function fmtResult(data, res, callback) {
  var result = (0, _paginate2.default)(data.questions, data.query.page, data.query.limit);
  return callback(null, { questions: result.data }, result.metadata);
}