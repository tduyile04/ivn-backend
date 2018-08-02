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

var routes = exports.routes = (0, _appRoute2.default)([['get', '/parties', (0, _allow2.default)('auth'), 'all'], ['post', '/parties', (0, _allow2.default)('auth'), (0, _allow2.default)('admin'), 'create'], ['get', '/party/:party_id', (0, _allow2.default)('auth'), 'one'], ['put', '/party/:party_id', (0, _allow2.default)('auth'), (0, _allow2.default)('admin'), 'update'], ['delete', '/party/:party_id', (0, _allow2.default)('auth'), (0, _allow2.default)('admin'), 'remove'], ['post', '/party/:party_id/follow', (0, _allow2.default)('auth'), 'follow'], ['delete', '/party/:party_id/unfollow', (0, _allow2.default)('auth'), 'unfollow'], ['post', '/party/:party_id/members', (0, _allow2.default)('auth'), (0, _allow2.default)('admin'), 'addMember'], ['delete', '/party/:party_id/members', (0, _allow2.default)('auth'), (0, _allow2.default)('admin'), 'removeMember']], new _controllers2.default());