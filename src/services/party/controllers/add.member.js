import check from 'body-checker'
import composeWaterfall from 'lib/compose/waterfall'
import knex from '_models'
import { errorHandler } from 'lib/error'

// Notifications
import { createNotifications } from '@notification/controllers/util'

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
    .select('*')
    .where({ id: data.body.party })
    .then(result => {
      return result.length > 0
        ? callback(null, Object.assign({}, data, { party: result[0] }), res)
        : callback({ message: 'Party not found', code: 404 }) // eslint-disable-line
    }).catch((e) => { console.log(e); callback({ message: 'Party not found', code: 404 }) }) // eslint-disable-line
}

function findMembership (data, res, callback) {
  return knex('party_member')
    .select('id')
    .where({ user_id: data.body.user, party_id: data.body.party })
    .then(result => {
      return result.length > 0
        ? callback({ message: 'User is already a member of this party', code: 409 }) // eslint-disable-line
        : callback(null, data, res)
    })
    .catch(e => errorHandler(e))
}

function findUser (data, res, callback) {
  return knex('user')
    .select('id')
    .where({ id: data.body.user })
    .then(result => {
      return result.length > 0
        ? callback(null, data, res)
        : callback({ message: 'User not found', code: 404 }) // eslint-disable-line
    })
    .catch(() => callback({ message: 'User not found', code: 404 })) // eslint-disable-line
}

function createNewMembership (data, res, callback) {
  const partyMember = { user_id: data.body.user, party_id: data.body.party }
  data.partyMember = partyMember
  return callback(null, data, res)
}
function saveMember (data, res, callback) {
  return knex('party_member')
    .insert(data.partyMember)
    .returning('*')
    .then(result => {
      data.partyMember = result[0]
      return callback(null, data, res)
    })
    .catch(e => errorHandler(e, res))
}
function fmtResult (data, res, callback) {
  const notification = {
    note: `You have been added to the party ${data.party.name}`,
    context: 'party_member_add',
    sender_id: data.auth.id,
    owner_id: data.partyMember.user_id
  }
  createNotifications(notification)
  return callback(null, { member: data.partyMember, statusCode: 201 })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    findParty,
    findUser,
    findMembership,
    createNewMembership,
    saveMember,
    fmtResult
  ])
}
