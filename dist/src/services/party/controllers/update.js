'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _waterfall2.default)(args, [checkBody, validateBody, findParty, updateParty, partyNameExists, saveParty, fetchParty, fmtResult]);
};

var _bodyChecker = require('body-checker');

var _bodyChecker2 = _interopRequireDefault(_bodyChecker);

var _waterfall = require('../../../../lib/compose/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _error = require('../../../../lib/error');

var _models = require('../../../models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Check body object
function checkBody(req, res, callback) {
  // Requires name
  return (0, _bodyChecker2.default)(req.body, {
    name: { type: 'string' },
    avatar: { type: 'string' },
    bio: { type: 'string' },
    slogan: { type: 'string' },
    about: { type: 'string' },
    motto: { type: 'string' },
    manifesto: { type: 'string' }
  }, function (err, body) {
    if (err) {
      return callback({ message: 'party ' + err, code: 400 }); // eslint-disable-line
    }
    body.newParty = Object.assign({}, body);
    body.admin = req.admin;
    body.party_id = req.params.party_id;
    return callback(null, body, res);
  });
}

// Validate body
function validateBody(data, res, callback) {
  if (data.name !== undefined && (data.name === '' || typeof data.name !== 'string')) {
    return callback({ message: 'party Error: Missing required parameter name', code: 400 }); // eslint-disable-line
  } else if (data.avatar && ['png', 'jpeg', 'jpg'].indexOf(data.avatar.split('.').slice(-1)[0]) === -1) {
    return callback({ message: 'invalid party avatar', code: 400 }); // eslint-disable-line
  }
  return callback(null, data, res);
}

function findParty(data, res, callback) {
  return _models.db.query('SELECT id FROM party WHERE id = $1', [data.party_id]).then(function (res) {
    data.party = res.rows[0];
    return res.rows.length > 0 ? callback(null, data, res) : callback({ message: 'party not found', code: 404 }); // eslint-disable-line
  }).catch(function (error) {
    return (0, _error.errorHandler)(error, res);
  });
}

function updateParty(data, res, callback) {
  var party = data.party;
  Object.keys(data.newParty).forEach(function (p) {
    party[p] = data.newParty[p];
  });
  data.fields = party;
  return callback(null, data, res);
}

function partyNameExists(data, res, callback) {
  if (data.fields.name) {
    return _models.db.query('SELECT id FROM party WHERE name = $1', [data.fields.name]).then(function (res) {
      return res.rows.length > 0 ? callback({ message: 'party already exists', code: 409 }) // eslint-disable-line
      : callback(null, data, res);
    }).catch(function (error) {
      return (0, _error.errorHandler)(error, res);
    });
  }
  return callback(null, data, res);
}

function saveParty(data, res, callback) {
  var query = 'UPDATE party SET';
  Object.keys(data.fields).forEach(function (field, index) {
    query += '' + (index === 0 ? ' ' : ', ') + field + ' = \'' + data.fields[field] + '\'';
  });
  query += ' WHERE id = $1';
  console.log(query);
  return _models.db.query(query, [data.party_id]).then(function () {
    return callback(null, data, res);
  }).catch(function (error) {
    return (0, _error.errorHandler)(error, res);
  });
}

function fetchParty(data, res, callback) {
  return _models.db.query('SELECT * FROM party WHERE id = $1', [data.party_id]).then(function (res) {
    return callback(null, { party: res.rows[0] }, res);
  }).catch(function (error) {
    return (0, _error.errorHandler)(error, res);
  });
}

function fmtResult(data, res, callback) {
  return callback(null, { party: data.party, statusCode: 200 });
}