'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  return (0, _waterfall2.default)(args, [checkBody, checkAccess, validateFirstName, validateLastName, validateEmail, validatePassword, validateDOB, validateGender, validateCountry, findUser, validateState, validateHash, updateUser, fmtResult]);
};

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _bodyChecker = require('body-checker');

var _bodyChecker2 = _interopRequireDefault(_bodyChecker);

var _validator = require('validator');

var _validator2 = _interopRequireDefault(_validator);

var _waterfall = require('../../../../lib/compose/waterfall');

var _waterfall2 = _interopRequireDefault(_waterfall);

var _models = require('../../../models');

var _models2 = _interopRequireDefault(_models);

var _error = require('../../../../lib/error');

var _databank = require('../../../../lib/databank');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isAdmin(roles) {
  var filtered = roles.filter(function (r) {
    return r.name === 'admin' || r.name === 'super admin';
  });
  return filtered.length > 0;
}

var genders = ['male', 'female', 'non-binary', 'other'];

function checkBody(req, res, callback) {
  var data = {};
  return (0, _bodyChecker2.default)(req.body, {
    firstName: {
      type: 'string'
    },
    lastName: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    password: {
      type: 'string'
    },
    oldPassword: {
      type: 'string'
    },
    gender: {
      type: 'string'
    },
    country: {
      type: 'string'
    },
    state: {
      type: 'string'
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
      type: 'string'
    }
  }, function (err, body) {
    if (err) return callback({ message: 'User ' + err, code: 400 }); // eslint-disable-line
    data.fields = body;
    data.auth = req.auth;
    data.user = { id: req.params.user_id };
    return callback(null, data, res);
  });
}

function checkAccess(data, res, callback) {
  if (!isAdmin(data.auth.roles) && data.auth.id !== data.user.id) {
    return callback({ message: 'Unauthorized! You cannot access this resource', code: 403 }); // eslint-disable-line
  }
  return callback(null, data, res);
}

function validateFirstName(data, res, callback) {
  if (data.fields.firstName) {
    if (!_validator2.default.isAlpha(data.fields.firstName)) {
      return callback({ message: 'First name is invalid', code: 400 }); // eslint-disable-line
    } else if (data.fields.firstName.length > 16) {
      return callback({ message: 'First name is too long', code: 400 }); // eslint-disable-line
    }
  }
  return callback(null, data, res);
}

function validateLastName(data, res, callback) {
  if (data.fields.lastName) {
    if (!_validator2.default.isAlpha(data.fields.lastName)) {
      return callback({ message: 'Last name is invalid', code: 400 }); // eslint-disable-line
    } else if (data.fields.lastName.length > 16) {
      return callback({ message: 'Last name is too long', code: 400 }); // eslint-disable-line
    }
  }
  return callback(null, data, res);
}

function validateEmail(data, res, callback) {
  if (data.fields.email) {
    if (!_validator2.default.isEmail(data.fields.email)) {
      return callback({ message: 'Email is invalid', code: 400 }); // eslint-disable-line
    } else {
      return (0, _models2.default)('user').where({ email: data.fields.email }).select('id').then(function (response) {
        return response.length === 0 ? callback(null, data, res) : callback({ message: 'Email is already in use', code: 409 }); // eslint-disable-line
      }).catch(function (e) {
        return (0, _error.errorHandler)(e, res);
      }); // eslint-disable-line
    }
  }
  return callback(null, data, res);
}

function validatePassword(data, res, callback) {
  if (data.fields.password || data.fields.oldPassword) {
    if (isAdmin(data.auth.roles) && data.auth.id !== data.user.id) {
      return callback({ message: 'Unauthorized! You cannot access this resource', code: 403 }); // eslint-disable-line
    } else if (!data.fields.password) {
      return callback({ message: 'Password must be at least 8 characters long', code: 400 }); // eslint-disable-line
    } else if (!data.fields.oldPassword) {
      return callback({ message: 'Old password is not correct', code: 400 }); // eslint-disable-line
    } else if (data.fields.password.length < 8) {
      return callback({ message: 'Password must be at least 8 characters long', code: 400 }); // eslint-disable-line
    } else if (data.fields.oldPassword.length < 8) {
      return callback({ message: 'Old password is not correct', code: 400 }); // eslint-disable-line
    }
    return _bcrypt2.default.hash(data.fields.password, 10).then(function (hash) {
      data.fields.password = hash;
      return callback(null, data, res);
    });
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
  if (data.fields.gender) {
    if (genders.indexOf(data.fields.gender) === -1) {
      return callback({ message: 'Gender is invalid', code: 400 }); // eslint-disable-line 
    }
  }
  return callback(null, data, res);
}

function validateCountry(data, res, callback) {
  if (data.fields.country) {
    if (!isAdmin(data.auth.roles)) {
      return callback({ message: 'Cannot update this information', code: 403 }); // eslint-disable-line 
    }
    var country = Object.keys(_databank.countries).filter(function (country) {
      return country.toLowerCase() === data.fields.country.toLowerCase();
    })[0];
    if (!country) {
      return callback({ message: 'Country is invalid', code: 400 }); // eslint-disable-line 
    }
    data.country = country;
    data.fields.country = country;
  }
  return callback(null, data, res);
}

function findUser(data, res, callback) {
  return (0, _models2.default)('user').where({ id: data.user.id }).select('*').then(function (response) {
    data.user = response[0];
    return response.length === 1 ? callback(null, data, res) : callback({ message: 'User not found', code: 404 }); // eslint-disable-line
  }).catch(function () {
    return callback({ message: 'User not found', code: 404 });
  }); // eslint-disable-line
}

function validateState(data, res, callback) {
  if (data.fields.state) {
    if (!isAdmin(data.auth.roles)) {
      return callback({ message: 'Cannot update this information', code: 403 }); // eslint-disable-line 
    }
    var state = _databank.countries[data.fields.country || data.user.country].filter(function (s) {
      return s.toLowerCase() === data.fields.state.toLowerCase();
    })[0];
    if (!state) {
      return callback({ message: 'State is invalid', code: 400 }); // eslint-disable-line 
    }
    data.fields.state = state;
  }
  return callback(null, data, res);
}

function validateHash(data, res, callback) {
  return _bcrypt2.default.compare(data.fields.oldPassword, data.user.password, function (err, res) {
    if (!err && !res) {
      return callback({ message: 'Old password is not correct', code: 400 }); // eslint-disable-line
    }
    return callback(null, data, res);
  });
}

function updateUser(data, res, callback) {
  if (data.fields.oldPassword) {
    delete data.fields.oldPassword;
  }
  return (0, _models2.default)('user').where({ id: data.user.id }).returning('*').update(data.fields).then(function (response) {
    data.user = response[0];
    return callback(null, data, res);
  }).catch(function (e) {
    return (0, _error.errorHandler)(e, res);
  });
}

function fmtResult(data, res, callback) {
  delete data.user.password;
  return callback(null, { user: data.user });
}