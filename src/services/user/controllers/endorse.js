import check from 'body-checker'
import composeWaterfall from 'lib/compose/waterfall'
import knex, { db } from '_models'
import { errorHandler } from 'lib/error'

function checkBody (req, res, callback) {
  return check(req.body, {
    user: {
      type: 'string',
      required: true
    }
  }, (err, body) => {
    if (err) return callback({ message: `User ${err}`, code: 400 }) // eslint-disable-line
    body.auth = req.auth
    return callback(null, body, res)
  })
}

function validateBody (data, res, callback) {
  if (data.user === data.auth.id) {
    return callback({ message: 'Cannot endorse yourself', code: 400 }) // eslint-disable-line
  }
  return callback(null, data, res)
}

function findUser (data, res, callback) {
  return knex('user as u')
    .leftJoin('user_role as ur', 'u.id', 'ur.user_id')
    .leftJoin('role as r', 'ur.role_id', 'r.id')
    .select(['u.id', 'u.email', 'r.name as roleName'])
    .where(knex.raw('u.id = ?', [data.user]))
    .options({ nestTables: true })
    .then(users => {
      const roles = users.map(u => u.roleName)
      if (roles.indexOf('candidate') !== -1) {
        data.candidate = Object.assign({}, users[0])
        return callback(null, data, res)
      }
      return callback({ message: 'Candidate not found', code: 404 }) // eslint-disable-line
    }).catch(() => callback({ message: 'Candidate not found', code: 404 })) // eslint-disable-line
}

function findEndorsed (data, res, callback) {
  return knex('user_endorse')
    .where({ endorser_id: data.auth.id })
    .select('*')
    .then(endorsments => {
      return endorsments.map(e => e.candidate_id).indexOf(data.user) === -1
        ? callback(null, data, res)
        : callback({ message: 'Already endorsed this candidate', code: 409 })  // eslint-disable-line
    })
    .catch(error => errorHandler(error, res))
}

function createRelationship (data, res, callback) {
  const userEndorse = {
    endorser_id: data.auth.id,
    candidate_id: data.user
  }
  data.fields = userEndorse
  return callback(null, data, res)
}

function saveRelationship (data, res, callback) {
  const { fields } = data
  return db
    .query('INSERT INTO user_endorse (endorser_id, candidate_id) VALUES($1, $2)', [fields.endorser_id, fields.candidate_id])
    .then(() => callback(null, data, res))
    .catch(error => errorHandler(error, res))
}

function fmtResult (data, res, callback) {
  return callback(null, { statusCode: 200, message: 'Endorsed user' })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    validateBody,
    findUser,
    findEndorsed,
    createRelationship,
    saveRelationship,
    fmtResult
  ])
}
