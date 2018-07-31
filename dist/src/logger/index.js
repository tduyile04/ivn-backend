'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var now = function now() {
  return _chalk2.default.magenta(new Date().toISOString().replace('T', '@').split('.')[0]);
};
var fmt = function fmt(args, level) {
  return args.map(function (arg) {
    return (typeof arg === 'undefined' ? 'undefined' : _typeof(arg)) === 'object' ? console.log(arg) : _chalk2.default[level](arg);
  });
};

var log = function log() {
  var _console;

  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (_console = console).log.apply(_console, [now()].concat(_toConsumableArray(fmt(args, 'green'))));
};
var info = function info() {
  var _console2;

  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  return (_console2 = console).log.apply(_console2, [now()].concat(_toConsumableArray(fmt(args, 'blue'))));
};
var error = function error() {
  var _console3;

  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  return (_console3 = console).error.apply(_console3, [now()].concat(_toConsumableArray(fmt(args, 'red'))));
};

var logger = {
  log: log,
  info: info,
  error: error
};

exports.default = logger;