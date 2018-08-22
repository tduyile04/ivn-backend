'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _waterfall2.default)(args, [checkBody, findParty, findFollowed, createRelationship, saveRelationship, fmtResult]);
};

var _waterfall = require('../../../../lib/compose/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _models = require('../../../models');

var _models2 = _interopRequireDefault(_models);

var _error = require('../../../../lib/error');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkBody(req, res, callback) {
  var data = {};
  data.auth = req.auth;
  data.body = { party: req.params.party_id };
  return callback(null, data, res);
}

function findParty(data, res, callback) {
  return (0, _models2.default)('party').where({ id: data.body.party }).select('*').then(function (party) {
    return party.length > 0 ? callback(null, data, res) : callback({ message: 'Party not found', code: 404 }); // eslint-disable-line
  }).catch(function () {
    return callback({ message: 'Party not found', code: 404 });
  }); // eslint-disable-line
}

function findFollowed(data, res, callback) {
  return (0, _models2.default)('party_follow').where({ follower_id: data.auth.id }).select('*').then(function (followings) {
    return followings.map(function (f) {
      return f.following_id;
    }).indexOf(data.body.party) === -1 ? callback(null, data, res) : callback({ message: 'Already followed this party', code: 409 }); // eslint-disable-line
  }).catch(function (error) {
    return (0, _error.errorHandler)(error, res);
  });
}

function createRelationship(data, res, callback) {
  var partyFollow = {
    follower_id: data.auth.id,
    party_id: data.body.party
  };
  data.fields = partyFollow;
  return callback(null, data, res);
}

function saveRelationship(data, res, callback) {
  var fields = data.fields;

  return _models.db.query('INSERT INTO party_follow (follower_id, party_id) VALUES($1, $2)', [fields.follower_id, fields.party_id]).then(function () {
    return callback(null, data, res);
  }).catch(function (error) {
    return (0, _error.errorHandler)(error, res);
  });
}

function fmtResult(data, res, callback) {
  return callback(null, { statusCode: 200, message: 'followed party' });
}