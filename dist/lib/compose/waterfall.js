'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

var _response = require('./response');

var _response2 = _interopRequireDefault(_response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var composeWaterfall = function composeWaterfall(_ref, waterfall) {
  var _ref2 = _slicedToArray(_ref, 2),
      req = _ref2[0],
      res = _ref2[1];

  _logger2.default.log('START: [' + req.method + ']', req.originalUrl);
  var unfoldWaterfall = waterfall.map(function (fn) {
    return function () {
      _logger2.default.log('\tRunning block: ' + fn.name);
      fn.apply(undefined, arguments);
    };
  });

  unfoldWaterfall[0] = _async2.default.apply(unfoldWaterfall[0], req, res);

  var response = (0, _response2.default)(res);

  var done = function done(error, result) {
    var metadata = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

    _logger2.default.log('DONE: [' + req.method + ']', req.originalUrl);
    if (error) {
      _logger2.default.log(error.code);
      return response.error(error.code, error);
    } else {
      var _result$statusCode = result.statusCode,
          statusCode = _result$statusCode === undefined ? 200 : _result$statusCode;

      delete result.statusCode;
      return response.success(statusCode, result, metadata);
    }
  };

  // Do Async Op
  _async2.default.waterfall(unfoldWaterfall, done);
};

exports.default = composeWaterfall;