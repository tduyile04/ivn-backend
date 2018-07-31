'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = require('../logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var composeResponse = function composeResponse(res) {
  return {
    error: function error(code, data) {
      _logger2.default.error(code, data);
      return res.status(code).json({
        status: { code: code, message: 'failed' },
        error: data
      });
    },
    success: function success(code, data, metadata) {
      return res.status(code || 200).json({
        status: { code: code || 200, message: 'success' },
        data: data,
        metadata: metadata || undefined
      });
    }
  };
};

exports.default = composeResponse;