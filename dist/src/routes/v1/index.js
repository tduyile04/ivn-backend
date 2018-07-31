'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fourOhFour = require('../../../lib/error/fourOhFour');

var _fourOhFour2 = _interopRequireDefault(_fourOhFour);

var _party = require('./party');

var _party2 = _interopRequireDefault(_party);

var _user = require('./user');

var _user2 = _interopRequireDefault(_user);

var _question = require('./question');

var _question2 = _interopRequireDefault(_question);

var _answer = require('./answer');

var _answer2 = _interopRequireDefault(_answer);

var _comment = require('./comment');

var _comment2 = _interopRequireDefault(_comment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var BASE = '/api/v1';

exports.default = function (app, router) {
  (0, _user2.default)(router);
  (0, _party2.default)(router);
  (0, _answer2.default)(router);
  (0, _comment2.default)(router);
  (0, _question2.default)(router);
  app.use(BASE, router);
  app.use('*', _fourOhFour2.default);
};