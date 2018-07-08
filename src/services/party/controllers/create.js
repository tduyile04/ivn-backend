// eslint-disable: standard/no-callback-literal

import check from 'body-checker'
import composeWaterfall from 'lib/compose/waterfall'
import { errorHandler } from 'lib/error'
import { db } from '_models'

// Check body object
function checkBody (req, res, callback) {
  // Requires name
  return check(req.body, {
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
    }
  }, (err, body) => {
    if (err) {
      return callback({ message: `party ${err} is required`, code: 400 }) // eslint-disable-line
    }
    body.admin = req.admin
    return callback(null, body, res)
  })
}

// Validate body
function validateBody (data, res, callback) {
  if (typeof data.bio !== 'string') {
    return callback({ message: 'invalid party avatar', code: 400 }) // eslint-disable-line
  } else if (typeof data.avatar !== 'string') {
    return callback({ message: 'invalid party avatar', code: 400 }) // eslint-disable-line
  } else if (['png', 'jpeg', 'jpg'].indexOf(data.avatar.split('.').slice(-1)[0]) === -1) {
    return callback({ message: 'invalid party avatar', code: 400 }) // eslint-disable-line
  }
  return callback(null, data, res)
}

function findParty (data, res, callback) {
  return db
    .query('SELECT id FROM party WHERE name=$1', [data.name])
    .then(res => res.rows.length === 0
      ? callback(null, data, res)
      : callback({ message: 'party already exists', code: 409 })) // eslint-disable-line
    .catch(error => errorHandler(error, res))
}

function createParty (data, res, callback) {
  const party = {
    name: data.name,
    bio: data.bio,
    avatar: data.avatar,
    created_by: data.admin.id
  }
  data.party = party
  return callback(null, data, res)
}

function saveParty (data, res, callback) {
  return db
    .query('INSERT INTO party(name, bio, avatar, created_by) VALUES($1, $2, $3, $4)', [
      data.party.name,
      data.party.bio,
      data.party.avatar,
      data.party.created_by
    ])
    .then(() => callback(null, data, res))
}

function fetchParty (data, res, callback) {
  // TODO: ADD only admin action
  return db
    .query('SELECT * FROM party WHERE name = $1', [data.party.name])
    .then(res => {
      data.party = res.rows[0]
      return callback(null, data, res)
    })
    .catch(error => errorHandler(error, res))
}

function fmtResult (data, res, callback) {
  const party = data.party
  return callback(null, { party, statusCode: 201 }, null)
}

export default function (model) {
  return (...args) => {
    return composeWaterfall(args, [
      checkBody,
      validateBody,
      findParty,
      createParty,
      saveParty,
      fetchParty,
      fmtResult
    ])
  }
}
