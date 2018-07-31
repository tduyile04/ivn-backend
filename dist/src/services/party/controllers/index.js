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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var model = 'something';

var Party = function Party() {
  _classCallCheck(this, Party);

  this.all = (0, _all2.default)(model);
  this.one = (0, _one2.default)(model);
  this.create = (0, _create2.default)(model);
  this.remove = (0, _remove2.default)(model);
  this.update = (0, _update2.default)(model);
  this.follow = (0, _follow2.default)(model);
  this.unfollow = (0, _unfollow2.default)(model);
};

exports.default = Party;