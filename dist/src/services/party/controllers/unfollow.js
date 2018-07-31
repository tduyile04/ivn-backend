'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _waterfall2.default)(args, [checkBody, findParty, findFollowed, removeRelationship, fmtResult]);
};

var _bodyChecker = require('body-checker');

var _bodyChecker2 = _interopRequireDefault(_bodyChecker);

var _waterfall = require('../../../../lib/compose/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _models = require('../../../models');

var _models2 = _interopRequireDefault(_models);

var _error = require('../../../../lib/error');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkBody(req, res, callback) {
  var data = {};
  return (0, _bodyChecker2.default)(req.body, {
    party: {
      type: 'string',
      required: true
    }
  }, function (err, body) {
    if (err) return callback({ message: 'Party ' + err, code: 400 }); // eslint-disable-line
    data.auth = req.auth;
    data.body = body;
    return callback(null, data, res);
  });
}

function findParty(data, res, callback) {
  return (0, _models2.default)('party').where({ id: data.body.party }).select('*').then(function (party) {
    return party.length > 0 ? callback(null, data, res) : callback({ message: 'Party not found', code: 404 }); // eslint-disable-line
  }).catch(function () {
    return callback({ message: 'Party not found', code: 404 });
  }); // eslint-disable-line
}

function findFollowed(data, res, callback) {
  return (0, _models2.default)('party_follow').where({ follower_id: data.auth.id, party_id: data.body.party }).select('*').then(function (followings) {
    return followings.length ? callback(null, Object.assign({}, data, { relationship: followings[0] }), res) : callback({ message: 'Party is not followed', code: 400 }); // eslint-disable-line
  }).catch(function (error) {
    return (0, _error.errorHandler)(error, res);
  });
}

function removeRelationship(data, res, callback) {
  return (0, _models2.default)('party_follow').where({ id: data.relationship.id }).del().then(function () {
    return callback(null, data, res);
  }).catch(function (error) {
    return (0, _error.errorHandler)(error, res);
  });
}

function fmtResult(data, res, callback) {
  callback(null, { statusCode: 200, message: 'Successfully unfollowed party' });
}