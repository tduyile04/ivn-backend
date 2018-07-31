'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (model) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (0, _waterfall2.default)(args, [findParty, deleteParty, fmtResult]);
  };
};

var _waterfall = require('../../../../lib/compose/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _error = require('../../../../lib/error');

var _models = require('../../../models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function findParty(req, res, callback) {
  return _models.db.query('SELECT id FROM party WHERE id = $1', [req.params.party_id]).then(function (res) {
    return res.rows.length > 0 ? callback(null, { party: res.rows[0] }, res) : callback({ message: 'party not found', code: 404 }); // eslint-disable-line
  }).catch(function (error) {
    return (0, _error.errorHandler)(error, res);
  });
}

function deleteParty(data, res, callback) {
  return _models.db.query('DELETE FROM party WHERE id = $1', [data.party.id]).then(function (res) {
    return callback(null, data, res);
  }).catch(function (error) {
    return (0, _error.errorHandler)(error, res);
  });
}

function fmtResult(data, res, callback) {
  return callback(null, { statusCode: 200 });
}