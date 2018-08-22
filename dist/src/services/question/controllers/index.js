'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _all = require('./all');

var _all2 = _interopRequireDefault(_all);

var _one = require('./one');

var _one2 = _interopRequireDefault(_one);

var _like = require('./like');

var _like2 = _interopRequireDefault(_like);

var _create = require('./create');

var _create2 = _interopRequireDefault(_create);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Question = function Question() {
  _classCallCheck(this, Question);

  this.all = _all2.default;
  this.one = _one2.default;
  this.like = _like2.default;
  this.create = _create2.default;
};

exports.default = Question;