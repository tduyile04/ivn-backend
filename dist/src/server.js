'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _routes = require('./routes');

var routes = _interopRequireWildcard(_routes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _process$env = process.env,
    _process$env$PORT = _process$env.PORT,
    PORT = _process$env$PORT === undefined ? 10999 : _process$env$PORT,
    _process$env$NODE_ENV = _process$env.NODE_ENV,
    NODE_ENV = _process$env$NODE_ENV === undefined ? 'development' : _process$env$NODE_ENV; // import 'module-alias'

var server = (0, _express2.default)();

var router = _express2.default.Router();

server.use((0, _helmet2.default)());
server.use(_bodyParser2.default.json({ limit: '10mb' }));
server.use(_bodyParser2.default.urlencoded({ extended: false, limit: '10mb', parameterLimit: 1000000 }));
// server.use(logger)

routes.v1(server, router);

if (NODE_ENV !== 'test') {
  server.listen(PORT, function () {
    return _logger2.default.log('server started on PORT:' + PORT + ' \uD83D\uDE80\n----------------------------------------------');
  });
}

exports.default = server;