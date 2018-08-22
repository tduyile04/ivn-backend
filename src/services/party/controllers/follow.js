import check from 'body-checker'
import composeWaterfall from 'lib/compose/waterfall'
import knex, { db } from '_models'
import { errorHandler } from 'lib/error'

function checkBody (req, res, callback) {
  const data = {}
  return check(req.body, {
    party: {
      type: 'string',
      required: true
    }
  }, (err, body) => {
    if (err) return callback({ message: `Party ${err}`, code: 400 }) // eslint-disable-line
    data.auth = req.auth
    data.body = body
    return callback(null, data, res)
  })
}

function findParty (data, res, callback) {
  return knex('party')
    .where({ id: data.body.party })
    .select('*')
    .then(party => {
      return party.length > 0
        ? callback(null, data, res)
        : callback({ message: 'Party not found', code: 404 }) // eslint-disable-line
    }).catch(() => callback({ message: 'Party not found', code: 404 })) // eslint-disable-line
}

function findFollowed (data, res, callback) {
  return knex('party_follow')
    .where({ follower_id: data.auth.id })
    .select('*')
    .then(followings => {
      return followings.map(f => f.following_id).indexOf(data.body.party) === -1
        ? callback(null, data, res)
        : callback({ message: 'Already followed this party', code: 409 })  // eslint-disable-line
    })
    .catch(error => errorHandler(error, res))
}

function createRelationship (data, res, callback) {
  const partyFollow = {
    follower_id: data.auth.id,
    party_id: data.body.party
  }
  data.fields = partyFollow
  return callback(null, data, res)
}

function saveRelationship (data, res, callback) {
  const { fields } = data
  return db
    .query('INSERT INTO party_follow (follower_id, party_id) VALUES($1, $2)', [fields.follower_id, fields.party_id])
    .then(() => callback(null, data, res))
    .catch(error => errorHandler(error, res))
}

function fmtResult (data, res, callback) {
  return callback(null, { statusCode: 200, message: 'followed party' })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    findParty,
    findFollowed,
    createRelationship,
    saveRelationship,
    fmtResult
  ])
}
