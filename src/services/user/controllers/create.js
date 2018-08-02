import bcrypt from 'bcrypt'
import check from 'body-checker'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import composeWaterfall from 'lib/compose/waterfall'
import knex from '_models'
import { errorHandler } from 'lib/error'
import { countries } from 'lib/databank'

const genders = ['male', 'female', 'non-binary', 'other']

function checkBody (req, res, callback) {
  let data = {}
  return check(
    req.body,
    {
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
    }, (err, body) => {
    if (err) return callback({ message: `User ${err}`, code: 400 }) // eslint-disable-line
      data.fields = body
      return callback(null, data, res)
    })
}
function validateFirstName (data, res, callback) {
  if (!validator.isAlpha(data.fields.firstName)) {
    return callback({ message: 'First name is invalid', code: 400 }) // eslint-disable-line
  } else if (data.fields.firstName.length > 16) {
    return callback({ message: 'First name is too long', code: 400 }) // eslint-disable-line
  }
  return callback(null, data, res)
}

function validateLastName (data, res, callback) {
  if (!validator.isAlpha(data.fields.lastName)) {
    return callback({ message: 'Last name is invalid', code: 400 }) // eslint-disable-line
  } else if (data.fields.lastName.length > 16) {
    return callback({ message: 'Last name is too long', code: 400 }) // eslint-disable-line
  }
  return callback(null, data, res)
}

function validateEmail (data, res, callback) {
  if (!validator.isEmail(data.fields.email)) {
    return callback({ message: 'Email is invalid', code: 400 }) // eslint-disable-line
  }
  return callback(null, data, res)
}

function validatePassword (data, res, callback) {
  if (data.fields.password.length < 8) {
    return callback({ message: 'Password must be at least 8 characters long', code: 400 }) // eslint-disable-line
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
  if (genders.indexOf(data.fields.gender) === -1) {
    return callback({ message: 'Gender is invalid', code: 400 }) // eslint-disable-line 
  }
  return callback(null, data, res)
}

function validateCountry (data, res, callback) {
  const country = Object
    .keys(countries)
    .filter(country => country.toLowerCase() === data.fields.country.toLowerCase())[0]
  if (!country) {
    return callback({ message: 'Country is invalid', code: 400 }) // eslint-disable-line 
  }
  data.country = country
  data.fields.country = country
  return callback(null, data, res)
}

function validateState (data, res, callback) {
  const state = countries[data.country]
    .filter(s => s.toLowerCase() === data.fields.state.toLowerCase())[0]
  if (!state) {
    return callback({ message: 'State is invalid', code: 400 }) // eslint-disable-line 
  }
  data.fields.state = state
  return callback(null, data, res)
}

function findUser (data, res, callback) {
  return knex('user')
    .where({ email: data.fields.email })
    .select('id')
    .then(response => {
      return response.length === 0
        ? callback(null, data, res)
        : callback({ message: 'User already exists', code: 409 }) // eslint-disable-line
    })
}

function createUser (data, res, callback) {
  return bcrypt
    .hash(data.fields.password, 10)
    .then(hash => {
      data.fields.password = hash
      return callback(null, data, res)
    })
    .catch(e => errorHandler(e, res))
}

function saveUser (data, res, callback) {
  return knex('user')
    .returning(['id', 'email', 'firstName', 'lastName'])
    .insert(data.fields)
    .then(user => callback(null, Object.assign({}, data, { user: user[0] }), res))
    .catch(e => errorHandler(e, res))
}

function findRole (data, res, callback) {
  return knex('role')
    .where({ name: 'regular' })
    .select('id')
    .then(roles => {
      data.role = roles[0].id
      return callback(null, data, res)
    })
    .catch(e => errorHandler(e, res))
}

function addRole (data, res, callback) {
  return knex('user_role')
    .insert({ user_id: data.user.id, role_id: data.role })
    .then(() => callback(null, data, res))
    .catch(e => errorHandler(e, res))
}

function generateToken (data, res, callback) {
  console.log(data.user)
  const token = jwt.sign({ data: { id: data.user.id } }, process.env.TOKEN_SECRET, { expiresIn: '23h' })
  data.user.token = token
  callback(null, data, res)
}

function fmtResult (data, res, callback) {
  return callback(null, { statusCode: 201, user: data.user })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    validateFirstName,
    validateLastName,
    validateEmail,
    validatePassword,
    validateDOB,
    validateGender,
    validateCountry,
    validateState,
    findUser,
    createUser,
    saveUser,
    findRole,
    addRole,
    generateToken,
    fmtResult
  ])
}
