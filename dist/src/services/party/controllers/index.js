'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _all = require('./all');

var _all2 = _interopRequireDefault(_all);

var _one = require('./one');

var _one2 = _interopRequireDefault(_one);

var _create = require('./create');

var _create2 = _interopRequireDefault(_create);

var _remove = require('./remove');

var _remove2 = _interopRequireDefault(_remove);

var _update = require('./update');

var _update2 = _interopRequireDefault(_update);

var _follow = require('./follow');

var _follow2 = _interopRequireDefault(_follow);

var _unfollow = require('./unfollow');

var _unfollow2 = _interopRequireDefault(_unfollow);

var _add = require('./add.member');

var _add2 = _interopRequireDefault(_add);

var _remove3 = require('./remove.member');

var _remove4 = _interopRequireDefault(_remove3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var model = 'something';

var Party = function Party() {
  _classCallCheck(this, Party);

  this.all = _all2.default;
  this.one = _one2.default;
  this.create = _create2.default;
  this.remove = _remove2.default;
  this.update = _update2.default;
  this.follow = _follow2.default;
  this.unfollow = _unfollow2.default;
  this.addMember = _add2.default;
  this.removeMember = _remove4.default;
};

exports.default = Party;