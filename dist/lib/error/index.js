'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.errorHandler = exports.catchError = exports.errorObject = undefined;

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var errorObject = exports.errorObject = function errorObject() {
  var code = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 500;
  var message = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'unknown error';

  return {
    code: code,
    message: message,
    status: 'error'
  };
};

var catchError = exports.catchError = function catchError(error) {
  _logger2.default.error(error.message);
  _logger2.default.error(error);
  return errorObject(500, error.message);
};

var errorHandler = exports.errorHandler = function errorHandler(error, res) {
  var e = catchError(error);
  return res.status(500).json({ status: e, error: { message: e.message } });
};