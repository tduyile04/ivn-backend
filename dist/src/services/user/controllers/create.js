'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _waterfall2.default)(args, [checkBody, validateFirstName, validateLastName, validateEmail, validatePassword, validateDOB, validateGender, validateCountry, validateState, findUser, createUser, saveUser, findRole, addRole, generateToken, fmtResult]);
};

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _bodyChecker = require('body-checker');

var _bodyChecker2 = _interopRequireDefault(_bodyChecker);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _waterfall = require('../../../../lib/compose/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _models = require('../../../models');

var _models2 = _interopRequireDefault(_models);

var _error = require('../../../../lib/error');

var _databank = require('../../../../lib/databank');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var genders = ['male', 'female', 'non-binary', 'other'];

function checkBody(req, res, callback) {
  var data = {};
  return (0, _bodyChecker2.default)(req.body, {
    firstName: {
      type: 'string',
      required: true
    },
    lastName: {
      type: 'string',
      required: true
    },
    email: {
      type: 'string',
      required: true
    },
    password: {
      type: 'string',
      required: true
    },
    gender: {
      type: 'string',
      required: true
    },
    country: {
      type: 'string',
      required: true
    },
    state: {
      type: 'string',
      required: true
    },
    dateOfBirth: {
      type: 'string'
    },
    phoneNumber: {
      type: 'string'
    },
    bio: {
      type: 'string'
    },
    localGovernment: {
      type: 'string',
      required: true
    }
  }, function (err, body) {
    if (err) return callback({ message: 'User ' + err, code: 400 }); // eslint-disable-line
    data.fields = body;
    return callback(null, data, res);
  });
}
function validateFirstName(data, res, callback) {
  if (!_validator2.default.isAlpha(data.fields.firstName)) {
    return callback({ message: 'First name is invalid', code: 400 }); // eslint-disable-line
  } else if (data.fields.firstName.length > 16) {
    return callback({ message: 'First name is too long', code: 400 }); // eslint-disable-line
  }
  return callback(null, data, res);
}

function validateLastName(data, res, callback) {
  if (!_validator2.default.isAlpha(data.fields.lastName)) {
    return callback({ message: 'Last name is invalid', code: 400 }); // eslint-disable-line
  } else if (data.fields.lastName.length > 16) {
    return callback({ message: 'Last name is too long', code: 400 }); // eslint-disable-line
  }
  return callback(null, data, res);
}

function validateEmail(data, res, callback) {
  if (!_validator2.default.isEmail(data.fields.email)) {
    return callback({ message: 'Email is invalid', code: 400 }); // eslint-disable-line
  }
  return callback(null, data, res);
}

function validatePassword(data, res, callback) {
  if (data.fields.password.length < 8) {
    return callback({ message: 'Password must be at least 8 characters long', code: 400 }); // eslint-disable-line
  }
  return callback(null, data, res);
}

function validateDOB(data, res, callback) {
  if (data.fields.dateOfBirth) {
    if (!_validator2.default.toDate(data.fields.dateOfBirth)) {
      return callback({ message: 'Date of Birth is invalid', code: 400 }); // eslint-disable-line
    }
  }
  return callback(null, data, res);
}

function validateGender(data, res, callback) {
  if (genders.indexOf(data.fields.gender) === -1) {
    return callback({ message: 'Gender is invalid', code: 400 }); // eslint-disable-line 
  }
  return callback(null, data, res);
}

function validateCountry(data, res, callback) {
  var country = Object.keys(_databank.countries).filter(function (country) {
    return country.toLowerCase() === data.fields.country.toLowerCase();
  })[0];
  if (!country) {
    return callback({ message: 'Country is invalid', code: 400 }); // eslint-disable-line 
  }
  data.country = country;
  data.fields.country = country;
  return callback(null, data, res);
}

function validateState(data, res, callback) {
  var state = _databank.countries[data.country].filter(function (s) {
    return s.toLowerCase() === data.fields.state.toLowerCase();
  })[0];
  if (!state) {
    return callback({ message: 'State is invalid', code: 400 }); // eslint-disable-line 
  }
  data.fields.state = state;
  return callback(null, data, res);
}

function findUser(data, res, callback) {
  return (0, _models2.default)('user').where({ email: data.fields.email }).select('id').then(function (response) {
    return response.length === 0 ? callback(null, data, res) : callback({ message: 'User already exists', code: 409 }); // eslint-disable-line
  });
}

function createUser(data, res, callback) {
  return _bcrypt2.default.hash(data.fields.password, 10).then(function (hash) {
    data.fields.password = hash;
    return callback(null, data, res);
  }).catch(function (e) {
    return (0, _error.errorHandler)(e, res);
  });
}

function saveUser(data, res, callback) {
  return (0, _models2.default)('user').returning(['id', 'email', 'firstName', 'lastName']).insert(data.fields).then(function (user) {
    return callback(null, Object.assign({}, data, { user: user[0] }), res);
  }).catch(function (e) {
    return (0, _error.errorHandler)(e, res);
  });
}

function findRole(data, res, callback) {
  return (0, _models2.default)('role').where({ name: 'regular' }).select('id').then(function (roles) {
    data.role = roles[0].id;
    return callback(null, data, res);
  }).catch(function (e) {
    return (0, _error.errorHandler)(e, res);
  });
}

function addRole(data, res, callback) {
  return (0, _models2.default)('user_role').insert({ user_id: data.user.id, role_id: data.role }).then(function () {
    return callback(null, data, res);
  }).catch(function (e) {
    return (0, _error.errorHandler)(e, res);
  });
}

function generateToken(data, res, callback) {
  console.log(data.user);
  var token = _jsonwebtoken2.default.sign({ data: { id: data.user.id } }, process.env.TOKEN_SECRET, { expiresIn: '23h' });
  data.user.token = token;
  callback(null, data, res);
}

function fmtResult(data, res, callback) {
  return callback(null, { statusCode: 201, user: data.user });
}