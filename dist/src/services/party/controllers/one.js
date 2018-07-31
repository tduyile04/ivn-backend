'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (model) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (0, _waterfall2.default)(args, [checkQuery, findParty, fmtResult]);
  };
};

var _waterfall = require('../../../../lib/compose/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _models = require('../../../models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkQuery(req, res, callback) {
  var query = req.query;
  return callback(null, { query: query, party_id: req.params.party_id }, res);
}

function findParty(data, res, callback) {
  return _models.db.query('SELECT * FROM party WHERE id = $1', [data.party_id]).then(function (res) {
    return res.rows.length ? callback(null, Object.assign({}, data, { party: res.rows[0] }), res) : callback({ message: 'party not found', code: 404 }); // eslint-disable-line
  }).catch(function () {
    return callback({ message: 'party not found', code: 404 });
  }); // eslint-disable-line
}

function fmtResult(data, res, callback) {
  var party = data.party;
  return callback(null, { party: party, statusCode: 200 });
}