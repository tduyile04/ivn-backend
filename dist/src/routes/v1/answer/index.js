'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _router = require('../../../../lib/compose/router');

var _router2 = _interopRequireDefault(_router);

var _routes = require('../../../services/answer/routes');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (router) {
  return (0, _router2.default)(_routes.routes, router);
};