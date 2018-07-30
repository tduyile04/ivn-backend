import check from 'body-checker'
import composeWaterfall from 'lib/compose/waterfall'
import knex from '_models'
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
    .where({ follower_id: data.auth.id, party_id: data.body.party })
    .select('*')
    .then(followings => {
      return followings.length
        ? callback(null, Object.assign({}, data, { relationship: followings[0] }), res)
        : callback({ message: 'Party is not followed', code: 400 })  // eslint-disable-line
    })
    .catch(error => errorHandler(error, res))
}

function removeRelationship (data, res, callback) {
  return knex('party_follow')
    .where({ id: data.relationship.id })
    .del()
    .then(() => callback(null, data, res))
    .catch(error => errorHandler(error, res))
}

function fmtResult (data, res, callback) {
  callback(null, { statusCode: 200, message: 'Successfully unfollowed party' })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    findParty,
    findFollowed,
    removeRelationship,
    fmtResult
  ])
}
