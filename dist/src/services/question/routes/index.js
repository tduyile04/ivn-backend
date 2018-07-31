'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routes = undefined;

var _controllers = require('../controllers');

var _controllers2 = _interopRequireDefault(_controllers);

var _appRoute = require('../../../../lib/compose/app-route');

var _appRoute2 = _interopRequireDefault(_appRoute);

var _allow = require('../../../middlewares/allow');

var _allow2 = _interopRequireDefault(_allow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = exports.routes = (0, _appRoute2.default)([['get', '/questions', (0, _allow2.default)('auth'), 'all'], ['post', '/questions', (0, _allow2.default)('auth'), 'create'], ['get', '/question/:question_id', (0, _allow2.default)('auth'), 'one'], ['post', '/question/:question_id/like', (0, _allow2.default)('auth'), 'like']], new _controllers2.default());