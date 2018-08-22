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

var routes = exports.routes = (0, _appRoute2.default)([['get', '/users', (0, _allow2.default)('auth'), 'all'], ['post', '/users', 'create'], ['post', '/users/login', 'login'], ['put', '/users/follow', (0, _allow2.default)('auth'), 'follow'], ['put', '/users/endorse', (0, _allow2.default)('auth'), 'endorse'], ['delete', '/users/unfollow', (0, _allow2.default)('auth'), 'unfollow'], ['get', '/user/:user_id', (0, _allow2.default)('auth'), 'one'], ['put', '/user/:user_id', (0, _allow2.default)('auth'), 'update'], ['delete', '/user/:user_id', (0, _allow2.default)('auth'), 'deactivate'], ['get', '/user/:user_id/timeline', (0, _allow2.default)('auth'), 'timeline'], ['put', '/user/:user_id/add_role', (0, _allow2.default)('auth'), (0, _allow2.default)('admin'), 'addRole'], ['put', '/user/:user_id/remove_role', (0, _allow2.default)('auth'), (0, _allow2.default)('admin'), 'removeRole']], new _controllers2.default());