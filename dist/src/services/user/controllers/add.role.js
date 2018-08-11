'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _waterfall2.default)(args, [checkBody, validate, findUser, isAdmin, findRole, findUserRole, createRole, saveRole, fmtResult]);
};

var _bodyChecker = require('body-checker');

var _bodyChecker2 = _interopRequireDefault(_bodyChecker);

var _waterfall = require('../../../../lib/compose/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _models = require('../../../models');

var _models2 = _interopRequireDefault(_models);

var _error = require('../../../../lib/error');

var _util = require('../../notification/controllers/util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function checkBody(req, res, callback) {
  var data = {};
  return (0, _bodyChecker2.default)(req.body, {
    role: {
      type: 'string',
      required: true
    }
  }, function (err, body) {
    if (err) return callback({ message: 'User ' + err, code: 400 }); // eslint-disable-line
    data.fields = body;
    data.auth = req.admin;
    data.user = { id: req.params.user_id };
    return callback(null, data, res);
  });
}

// Notifications


function validate(data, res, callback) {
  if (data.auth.id === data.user.id) {
    return callback({ message: 'Cannot upgrade your own role', code: 400 }); // eslint-disable-line
  }
  return callback(null, data, res);
}

function findUser(data, res, callback) {
  return (0, _models2.default)('user').where({ id: data.user.id }).select(['id']).then(function (users) {
    return users.length > 0 ? callback(null, Object.assign({}, data, { candiate: users[0] }), res) : callback({ message: 'User not found', code: 404 }); // eslint-disable-line
  }).catch(function () {
    return callback({ message: 'User not found', code: 404 });
  }); // eslint-disable-line
}

function isAdmin(data, res, callback) {
  return (0, _models2.default)('user as u').leftJoin('user_role as ur', 'u.id', 'ur.user_id').leftJoin('role as r', 'ur.role_id', 'r.id').select(['u.id', 'r.name as roleName']).where(_models2.default.raw('u.id = ?', [data.user.id])).options({ nestTables: true }).then(function (results) {
    var roles = results.filter(function (r) {
      return ['admin', 'super admin'].indexOf(r.roleName) !== -1;
    });
    if (roles.length && data.auth.roles.indexOf('super admin') === -1) {
      return callback({ message: 'Cannot upgrade this user\'s role', code: 403 }); // eslint-disable-line
    }
    return callback(null, data, res);
  });
}

function findRole(data, res, callback) {
  return (0, _models2.default)('role').where({ name: data.fields.role }).select(['id', 'name']).then(function (roles) {
    return roles.length > 0 ? callback(null, Object.assign({}, data, { role: roles[0] }), res) : callback({ message: 'Role "' + data.fields.role + '" not found', code: 404 }); // eslint-disable-line
  }).catch(function () {
    return callback({ message: 'Role "' + data.fields.role + '" not found', code: 404 });
  }); // eslint-disable-line
}

function findUserRole(data, res, callback) {
  return (0, _models2.default)('user_role').where({ user_id: data.user.id, role_id: data.role.id }).select(['id']).then(function (results) {
    return results.length === 0 ? callback(null, data, res) : callback({ message: 'User already has this role', code: 409 }); // eslint-disable-line
  }).catch(function (e) {
    return (0, _error.errorHandler)(e, res);
  }); // eslint-disable-line
}

function createRole(data, res, callback) {
  var userRole = {
    user_id: data.user.id,
    role_id: data.role.id
  };
  data.userRole = userRole;
  return callback(null, data, res);
}

function saveRole(data, res, callback) {
  return (0, _models2.default)('user_role').insert(data.userRole).then(function () {
    return callback(null, data, res);
  }).catch(function (e) {
    return (0, _error.errorHandler)(e, res);
  });
}

function fmtResult(data, res, callback) {
  var notification = {
    note: 'You now have ' + data.role.name + ' access',
    context: 'role_upgrade',
    sender_id: data.auth.id,
    owner_id: data.userRole.user_id
  };
  (0, _util.createNotifications)(notification);
  return callback(null, { statusCode: 200, message: 'Role added to user' });
}