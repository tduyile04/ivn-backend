'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _create = require('./create');

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Comment = function Comment() {
  _classCallCheck(this, Comment);

  this.create = _create2.default;
};

exports.default = Comment;