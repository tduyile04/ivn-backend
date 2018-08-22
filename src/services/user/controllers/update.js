import bcrypt from 'bcrypt'
import check from 'body-checker'
import validator from 'validator'
import composeWaterfall from 'lib/compose/waterfall'
import knex from '_models'
import { errorHandler } from 'lib/error'
import { countries } from 'lib/databank'

function isAdmin (roles) {
  const filtered = roles.filter(r => r.name === 'admin' || r.name === 'super admin')
  return filtered.length > 0
}

const genders = ['male', 'female', 'non-binary', 'other']

function checkBody (req, res, callback) {
  let data = {}
  return check(
    req.body,
    {
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
      avatar: {
        type: 'string'
      },
      localGovernment: {
        type: 'string'
      }
    }, (err, body) => {
    if (err) return callback({ message: `User ${err}`, code: 400 }) // eslint-disable-line
      data.fields = body
      data.auth = req.auth
      data.user = { id: req.params.user_id }
      return callback(null, data, res)
    })
}

function checkAccess (data, res, callback) {
  if (!isAdmin(data.auth.roles) && data.auth.id !== data.user.id) {
    return callback({ message: 'Unauthorized! You cannot access this resource', code: 403 }) // eslint-disable-line
  }
  return callback(null, data, res)
}

function validateFirstName (data, res, callback) {
  if (data.fields.firstName) {
    if (!validator.isAlpha(data.fields.firstName)) {
      return callback({ message: 'First name is invalid', code: 400 }) // eslint-disable-line
    } else if (data.fields.firstName.length > 16) {
      return callback({ message: 'First name is too long', code: 400 }) // eslint-disable-line
    }
  }
  return callback(null, data, res)
}

function validateLastName (data, res, callback) {
  if (data.fields.lastName) {
    if (!validator.isAlpha(data.fields.lastName)) {
      return callback({ message: 'Last name is invalid', code: 400 }) // eslint-disable-line
    } else if (data.fields.lastName.length > 16) {
      return callback({ message: 'Last name is too long', code: 400 }) // eslint-disable-line
    }
  }
  return callback(null, data, res)
}

function validateEmail (data, res, callback) {
  if (data.fields.email) {
    if (!validator.isEmail(data.fields.email)) {
      return callback({ message: 'Email is invalid', code: 400 }) // eslint-disable-line
    } else {
      return knex('user')
        .where({ email: data.fields.email })
        .select('id')
        .then(response => {
          return response.length === 0
            ? callback(null, data, res)
            : callback({ message: 'Email is already in use', code: 409 }) // eslint-disable-line
        })
        .catch(e => errorHandler(e, res)) // eslint-disable-line
    }
  }
  return callback(null, data, res)
}

function validatePassword (data, res, callback) {
  if (data.fields.password || data.fields.oldPassword) {
    if (isAdmin(data.auth.roles) && data.auth.id !== data.user.id) {
      return callback({ message: 'Unauthorized! You cannot access this resource', code: 403 }) // eslint-disable-line
    } else if (!data.fields.password) {
      return callback({ message: 'Password must be at least 8 characters long', code: 400 }) // eslint-disable-line
    } else if (!data.fields.oldPassword) {
      return callback({ message: 'Old password is not correct', code: 400 }) // eslint-disable-line
    } else if (data.fields.password.length < 8) {
      return callback({ message: 'Password must be at least 8 characters long', code: 400 }) // eslint-disable-line
    } else if (data.fields.oldPassword.length < 8) {
      return callback({ message: 'Old password is not correct', code: 400 }) // eslint-disable-line
    }
    return bcrypt
      .hash(data.fields.password, 10)
      .then(hash => {
        data.fields.password = hash
        return callback(null, data, res)
      })
  }
  return callback(null, data, res)
}

function validateDOB (data, res, callback) {
  if (data.fields.dateOfBirth) {
    if (!validator.toDate(data.fields.dateOfBirth)) {
      return callback({ message: 'Date of Birth is invalid', code: 400 }) // eslint-disable-line
    }
  }
  return callback(null, data, res)
}

function validateGender (data, res, callback) {
  if (data.fields.gender) {
    if (genders.indexOf(data.fields.gender) === -1) {
      return callback({ message: 'Gender is invalid', code: 400 }) // eslint-disable-line 
    }
  }
  return callback(null, data, res)
}

function validateCountry (data, res, callback) {
  if (data.fields.country) {
    if (!isAdmin(data.auth.roles)) {
      return callback({ message: 'Cannot update this information', code: 403 }) // eslint-disable-line 
    }
    const country = Object
      .keys(countries)
      .filter(country => country.toLowerCase() === data.fields.country.toLowerCase())[0]
    if (!country) {
      return callback({ message: 'Country is invalid', code: 400 }) // eslint-disable-line 
    }
    data.country = country
    data.fields.country = country
  }
  return callback(null, data, res)
}

function findUser (data, res, callback) {
  return knex('user')
    .where({ id: data.user.id })
    .select('*')
    .then(response => {
      data.user = response[0]
      return response.length === 1
        ? callback(null, data, res)
        : callback({ message: 'User not found', code: 404 }) // eslint-disable-line
    })
    .catch(() => callback({ message: 'User not found', code: 404 })) // eslint-disable-line
}

function validateState (data, res, callback) {
  if (data.fields.state) {
    if (!isAdmin(data.auth.roles)) {
      return callback({ message: 'Cannot update this information', code: 403 }) // eslint-disable-line 
    }
    const state = countries[data.fields.country || data.user.country]
      .filter(s => s.toLowerCase() === data.fields.state.toLowerCase())[0]
    if (!state) {
      return callback({ message: 'State is invalid', code: 400 }) // eslint-disable-line 
    }
    data.fields.state = state
  }
  return callback(null, data, res)
}

function validateHash (data, res, callback) {
  return bcrypt.compare(data.fields.oldPassword, data.user.password, (err, res) => {
    if (!err && !res) {
      return callback({ message: 'Old password is not correct', code: 400 }) // eslint-disable-line
    }
    return callback(null, data, res)
  })
}

function updateUser (data, res, callback) {
  if (data.fields.oldPassword) {
    delete data.fields.oldPassword
  }
  return knex('user')
    .where({ id: data.user.id })
    .returning('*')
    .update(data.fields)
    .then(response => {
      data.user = response[0]
      return callback(null, data, res)
    })
    .catch(e => errorHandler(e, res))
}

function fmtResult (data, res, callback) {
  delete data.user.password
  return callback(null, { user: data.user })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    checkAccess,
    validateFirstName,
    validateLastName,
    validateEmail,
    validatePassword,
    validateDOB,
    validateGender,
    validateCountry,
    findUser,
    validateState,
    validateHash,
    updateUser,
    fmtResult
  ])
}
