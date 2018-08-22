'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _all = require('./all');

var _all2 = _interopRequireDefault(_all);

var _one = require('./one');

var _one2 = _interopRequireDefault(_one);

var _login = require('./login');

var _login2 = _interopRequireDefault(_login);

var _create = require('./create');

var _create2 = _interopRequireDefault(_create);

var _follow = require('./follow');

var _follow2 = _interopRequireDefault(_follow);

var _update = require('./update');

var _update2 = _interopRequireDefault(_update);

var _endorse = require('./endorse');

var _endorse2 = _interopRequireDefault(_endorse);

var _add = require('./add.role');

var _add2 = _interopRequireDefault(_add);

var _timeline = require('./timeline');

var _timeline2 = _interopRequireDefault(_timeline);

var _unfollow = require('./unfollow');

var _unfollow2 = _interopRequireDefault(_unfollow);

var _deactivate = require('./deactivate');

var _deactivate2 = _interopRequireDefault(_deactivate);

var _remove = require('./remove.role');

var _remove2 = _interopRequireDefault(_remove);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var User = function User() {
  _classCallCheck(this, User);

  this.all = _all2.default;
  this.one = _one2.default;
  this.login = _login2.default;
  this.create = _create2.default;
  this.update = _update2.default;
  this.follow = _follow2.default;
  this.endorse = _endorse2.default;
  this.addRole = _add2.default;
  this.timeline = _timeline2.default;
  this.unfollow = _unfollow2.default;
  this.removeRole = _remove2.default;
  this.deactivate = _deactivate2.default;
};

exports.default = User;