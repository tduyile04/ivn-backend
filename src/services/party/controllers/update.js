import check from 'body-checker'
import composeWaterfall from 'lib/compose/waterfall'
import { errorHandler } from 'lib/error'
import { db } from '_models'

// Check body object
function checkBody (req, res, callback) {
  // Requires name
  return check(req.body, {
    name: { type: 'string' },
    avatar: { type: 'string' },
    bio: { type: 'string' },
    slogan: { type: 'string' },
    about: { type: 'string' },
    motto: { type: 'string' },
    manifesto: { type: 'string' }
  }, (err, body) => {
    if (err) {
      return callback({ message: `party ${err}`, code: 400 }) // eslint-disable-line
    }
    body.newParty = Object.assign({}, body)
    body.admin = req.admin
    body.party_id = req.params.party_id
    return callback(null, body, res)
  })
}

// Validate body
function validateBody (data, res, callback) {
  if (data.name !== undefined && (data.name === '' || typeof data.name !== 'string')) {
    return callback({ message: 'party Error: Missing required parameter name', code: 400 }) // eslint-disable-line
  } else if (data.avatar && ['png', 'jpeg', 'jpg'].indexOf(data.avatar.split('.').slice(-1)[0]) === -1) {
    return callback({ message: 'invalid party avatar', code: 400 }) // eslint-disable-line
  }
  return callback(null, data, res)
}

function findParty (data, res, callback) {
  return db
    .query('SELECT id FROM party WHERE id = $1', [data.party_id])
    .then(res => {
      data.party = res.rows[0]
      return res.rows.length > 0
        ? callback(null, data, res)
        : callback({ message: 'party not found', code: 404 }) // eslint-disable-line
    })
    .catch(error => errorHandler(error, res))
}

function updateParty (data, res, callback) {
  const party = data.party
  Object.keys(data.newParty).forEach(p => {
    party[p] = data.newParty[p]
  })
  data.fields = party
  return callback(null, data, res)
}

function partyNameExists (data, res, callback) {
  if (data.fields.name) {
    return db.query('SELECT id FROM party WHERE name = $1', [data.fields.name])
      .then(res => {
        return res.rows.length > 0
          ? callback({ message: 'party already exists', code: 409 }) // eslint-disable-line
          : callback(null, data, res)
      })
      .catch(error => errorHandler(error, res))
  }
  return callback(null, data, res)
}

function saveParty (data, res, callback) {
  let query = 'UPDATE party SET'
  Object.keys(data.fields).forEach((field, index) => {
    query += `${index === 0 ? ' ' : ', '}${field} = '${data.fields[field]}'`
  })
  query += ' WHERE id = $1'
  console.log(query)
  return db
    .query(query, [data.party_id])
    .then(() => callback(null, data, res))
    .catch(error => errorHandler(error, res))
}

function fetchParty (data, res, callback) {
  return db
    .query('SELECT * FROM party WHERE id = $1', [data.party_id])
    .then(res => callback(null, { party: res.rows[0] }, res))
    .catch(error => errorHandler(error, res))
}

function fmtResult (data, res, callback) {
  return callback(null, { party: data.party, statusCode: 200 })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    validateBody,
    findParty,
    updateParty,
    partyNameExists,
    saveParty,
    fetchParty,
    fmtResult
  ])
}
