'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _waterfall2.default)(args, [checkQuery, findParty, fmtResult]);
};

var _waterfall = require('../../../../lib/compose/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _models = require('../../../models');

var _models2 = _interopRequireDefault(_models);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkQuery(req, res, callback) {
  var query = req.query;
  return callback(null, { query: query, party_id: req.params.party_id }, res);
}

function findParty(data, res, callback) {
  var userSelect = ['id', 'firstName', 'lastName', 'avatar'].reduce(function (acc, field) {
    acc.push('follower.' + field + ' as follower_' + field, 'member.' + field + ' as member_' + field);
    return acc;
  }, []);
  return (0, _models2.default)('party').leftJoin('party_follow', 'party_follow.party_id', 'party.id').leftJoin('party_member as pm', 'pm.party_id', 'party.id').leftJoin('user as member', 'member.id', 'pm.user_id').leftJoin('user as follower', 'follower.id', 'party_follow.follower_id').select(['party.*'].concat(userSelect)).where({ 'party.id': data.party_id }).options({ nestTables: true }).then(function (result) {
    if (result.length > 0) {
      data.party = (0, _util.formatParty)(result);
      return callback(null, data, res);
    }
    return callback({ message: 'party not found', code: 404 }); // eslint-disable-line
  }).catch(function (e) {
    console.log(e);callback({ message: 'party not found', code: 404 });
  }); // eslint-disable-line
}

function fmtResult(data, res, callback) {
  var party = data.party;
  return callback(null, { party: party, statusCode: 200 });
}