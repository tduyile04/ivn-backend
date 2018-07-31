'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (model) {
  return function () {
    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return (0, _waterfall2.default)(args, [checkBody, validateBody, findParty, createParty, saveParty, fetchParty, fmtResult]);
  };
};

var _bodyChecker = require('body-checker');

var _bodyChecker2 = _interopRequireDefault(_bodyChecker);

var _waterfall = require('../../../../lib/compose/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _error = require('../../../../lib/error');

var _models = require('../../../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Check body object
// eslint-disable: standard/no-callback-literal

function checkBody(req, res, callback) {
  // Requires name
  return (0, _bodyChecker2.default)(req.body, {
    name: {
      type: 'string',
      required: true
    },
    avatar: {
      type: 'string',
      default: 'default.jpeg'
    },
    bio: {
      type: 'string',
      default: ''
    },
    slogan: {
      type: 'string'
    },
    about: {
      type: 'string'
    },
    motto: {
      type: 'string'
    }
  }, function (err, body) {
    if (err) {
      return callback({ message: 'party ' + err + ' is required', code: 400 }); // eslint-disable-line
    }
    body.admin = req.admin;
    return callback(null, body, res);
  });
}

// Validate body
function validateBody(data, res, callback) {
  if (typeof data.bio !== 'string') {
    return callback({ message: 'invalid party avatar', code: 400 }); // eslint-disable-line
  } else if (typeof data.avatar !== 'string') {
    return callback({ message: 'invalid party avatar', code: 400 }); // eslint-disable-line
  } else if (['png', 'jpeg', 'jpg'].indexOf(data.avatar.split('.').slice(-1)[0]) === -1) {
    return callback({ message: 'invalid party avatar', code: 400 }); // eslint-disable-line
  }
  return callback(null, data, res);
}

function findParty(data, res, callback) {
  return _models.db.query('SELECT id FROM party WHERE name=$1', [data.name]).then(function (res) {
    return res.rows.length === 0 ? callback(null, data, res) : callback({ message: 'party already exists', code: 409 });
  }) // eslint-disable-line
  .catch(function (error) {
    return (0, _error.errorHandler)(error, res);
  });
}

function createParty(data, res, callback) {
  var party = {
    name: data.name,
    bio: data.bio,
    avatar: data.avatar,
    created_by: data.admin.id,
    slogan: data.slogan,
    motto: data.motto,
    about: data.about
  };
  data.party = party;
  return callback(null, data, res);
}

function saveParty(data, res, callback) {
  return (0, _models2.default)('party').insert(data.party).then(function () {
    return callback(null, data, res);
  }).catch(function (error) {
    return (0, _error.errorHandler)(error, res);
  });
}

function fetchParty(data, res, callback) {
  // TODO: ADD only admin action
  return _models.db.query('SELECT * FROM party WHERE name = $1', [data.party.name]).then(function (res) {
    data.party = res.rows[0];
    return callback(null, data, res);
  }).catch(function (error) {
    return (0, _error.errorHandler)(error, res);
  });
}

function fmtResult(data, res, callback) {
  var party = data.party;
  return callback(null, { party: party, statusCode: 201 }, null);
}