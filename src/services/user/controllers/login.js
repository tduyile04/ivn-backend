import bcrypt from 'bcrypt'
import check from 'body-checker'
import validator from 'validator'
import jwt from 'jsonwebtoken'
import composeWaterfall from 'lib/compose/waterfall'
import knex from '_models'

const errRes = { message: 'Email and password do not match', code: 400 }

function checkBody (req, res, callback) {
  let data = {}
  return check(
    req.body,
    {
      email: {
        type: 'string',
        required: true
      },
      password: {
        type: 'string',
        required: true
      }
    }, (err, body) => {
    if (err) return callback({ message: `User ${err}`, code: 400 }) // eslint-disable-line
      data.fields = body
      return callback(null, data, res)
    })
}

function validateEmail (data, res, callback) {
  if (!validator.isEmail(data.fields.email)) {
    return callback(errRes) // eslint-disable-line
  }
  return callback(null, data, res)
}

function validatePassword (data, res, callback) {
  if (data.fields.password.length < 8) {
    return callback(errRes) // eslint-disable-line
  }
  return callback(null, data, res)
}

function findUser (data, res, callback) {
  return knex('user')
    .where({ email: data.fields.email })
    .select(['id', 'email', 'firstName', 'lastName', 'avatar', 'password'])
    .then(user => {
      return user.length === 0
        ? callback(errRes)
        : callback(null, Object.assign({}, data, { user: user[0] }), res) // eslint-disable-line
    })
}

function validateHash (data, res, callback) {
  return bcrypt.compare(data.fields.password, data.user.password, (err, res) => {
    if (err || !res) return callback(errRes)
    return callback(null, data, res)
  })
}

function generateToken (data, res, callback) {
  const token = jwt.sign({ data: data.user.id }, process.env.TOKEN_SECRET, { expiresIn: '23h' })
  data.user.token = token
  callback(null, data, res)
}

function fmtResult (data, res, callback) {
  return callback(null, { statusCode: 200, user: data.user })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    validateEmail,
    validatePassword,
    findUser,
    validateHash,
    generateToken,
    fmtResult
  ])
}
