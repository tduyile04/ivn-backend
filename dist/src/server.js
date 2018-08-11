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

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _logger = require('../lib/logger');

var _logger2 = _interopRequireDefault(_logger);

var _routes = require('./routes');

var routes = _interopRequireWildcard(_routes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import 'module-alias'
var _process$env = process.env,
    _process$env$PORT = _process$env.PORT,
    PORT = _process$env$PORT === undefined ? 10999 : _process$env$PORT,
    _process$env$NODE_ENV = _process$env.NODE_ENV,
    NODE_ENV = _process$env$NODE_ENV === undefined ? 'development' : _process$env$NODE_ENV;


var app = (0, _express2.default)();

var server = _http2.default.createServer(app);

var router = _express2.default.Router();

var io = require('./config/socket')(server);

var socketIO = [{}, {}];
var socketUsers = {};

io.on('connection', function (socket) {
  console.log(socket.handshake.user.email, ' connected with ID', socket.id);

  socketUsers[socket.handshake.user.email] = socket.id;
  socketIO[0][socket.handshake.user.email] = socket;
  socketIO[1] = socketUsers;

  socket.on('disconnect', function () {
    console.log(socket.handshake.user.email, 'with', socket.id, ' has diconnected');
  });
});

app.use((0, _helmet2.default)());
app.use(_bodyParser2.default.json({ limit: '10mb' }));
app.use(_bodyParser2.default.urlencoded({ extended: false, limit: '10mb', parameterLimit: 1000000 }));
app.use(function (req, res, next) {
  console.log(socketIO);
  req.socket = socketIO;
  next();
});
// app.use(logger)

routes.v1(app, router);

if (NODE_ENV !== 'test') {
  server.listen(PORT, function () {
    return _logger2.default.log('server started on PORT:' + PORT + ' \uD83D\uDE80\n----------------------------------------------');
  });
}

exports.default = app;