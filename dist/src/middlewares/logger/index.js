'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.alarm = exports.warn = exports.log = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = function logger(req, res, next) {
  _chalk2.default.blue('new request', req);
  next();
};

var saveToFile = function saveToFile(data) {
  var date = (0, _moment2.default)().format('l').replace('-', '_');
  _fs2.default.appendFile(_path2.default.resolve(__dirname, './logs/log_' + date + '.logfile'), data);
};

var log = exports.log = function log() {
  var _console;

  for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
    params[_key] = arguments[_key];
  }

  saveToFile(Array.isArray(params) ? params.join(' ') : params);
  (_console = console).log.apply(_console, params);
};
var warn = exports.warn = function warn() {
  for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    params[_key2] = arguments[_key2];
  }

  saveToFile(Array.isArray(params) ? params.join(' ') : params);
};
var alarm = exports.alarm = function alarm() {
  for (var _len3 = arguments.length, params = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    params[_key3] = arguments[_key3];
  }

  saveToFile(Array.isArray(params) ? params.join(' ') : params);
};

exports.default = logger;