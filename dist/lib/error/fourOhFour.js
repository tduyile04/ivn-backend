'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _response = require('../compose/response');

var _response2 = _interopRequireDefault(_response);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (req, res) {
  return (0, _response2.default)(res).error(404, { message: 'resource not found' });
};