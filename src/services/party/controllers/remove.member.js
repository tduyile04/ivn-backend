import check from 'body-checker'
import composeWaterfall from 'lib/compose/waterfall'
import knex from '_models'
import { errorHandler } from 'lib/error'

function checkBody (req, res, callback) {
  const data = {}
  return check(req.body, {
    user: {
      type: 'string',
      required: true
    }
  }, (err, body) => {
    if (err) return callback({ message: `Party ${err}`, code: 400 }) // eslint-disable-line
    data.auth = req.auth
    data.body = { user: body.user, party: req.params.party_id }
    return callback(null, data, res)
  })
}

function findParty (data, res, callback) {
  return knex('party')
    .select('id')
    .where({ id: data.body.party })
    .then(result => {
      return result.length > 0
        ? callback(null, data, res)
        : callback({ message: 'Party not found', code: 404 }) // eslint-disable-line
    }).catch((e) => { console.log(e); callback({ message: 'Party not found', code: 404 }) }) // eslint-disable-line
}

function findUser (data, res, callback) {
  return knex('user')
    .select('id')
    .where({ id: data.body.user })
    .then(result => {
      return result.length > 0
        ? callback(null, Object.assign({}, data, { partyMember: result[0].id }), res)
        : callback({ message: 'User not found', code: 404 }) // eslint-disable-line
    })
}

function findMembership (data, res, callback) {
  return knex('party_member')
    .select('id')
    .where({ user_id: data.body.user, party_id: data.body.party })
    .then(result => {
      return result.length > 0
        ? callback(null, data, res)
        : callback({ message: 'User is not a member of this party', code: 400 }) // eslint-disable-line
    })
    .catch(e => errorHandler(e))
}

function removeMembership (data, res, callback) {
  return knex('party_member')
    .where({ id: data.partyMember })
    .del()
    .then(() => callback(null, data, res))
    .catch(e => errorHandler(e, res))
}
function fmtResult (data, res, callback) {
  return callback(null, { statusCode: 204 })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    findParty,
    findUser,
    findMembership,
    removeMembership,
    fmtResult
  ])
}
