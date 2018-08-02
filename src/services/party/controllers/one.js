import composeWaterfall from 'lib/compose/waterfall'
import knex from '_models'
import { formatParty } from './util'

function checkQuery (req, res, callback) {
  const query = req.query
  return callback(null, { query, party_id: req.params.party_id }, res)
}

function findParty (data, res, callback) {
  const userSelect = ['id', 'firstName', 'lastName', 'avatar'].reduce((acc, field) => {
    acc.push(`follower.${field} as follower_${field}`, `member.${field} as member_${field}`)
    return acc
  }, [])
  return knex('party')
    .leftJoin('party_follow', 'party_follow.party_id', 'party.id')
    .leftJoin('party_member as pm', 'pm.party_id', 'party.id')
    .leftJoin('user as member', 'member.id', 'pm.user_id')
    .leftJoin('user as follower', 'follower.id', 'party_follow.follower_id')
    .select(['party.*'].concat(userSelect))
    .where({ 'party.id': data.party_id })
    .options({ nestTables: true })
    .then(result => {
      if (result.length > 0) {
        data.party = formatParty(result)
        return callback(null, data, res)
      }
      return callback({ message: 'party not found', code: 404 }) // eslint-disable-line
    })
    .catch((e) => { console.log(e); callback({ message: 'party not found', code: 404 })}) // eslint-disable-line
}

function fmtResult (data, res, callback) {
  const party = data.party
  return callback(null, { party, statusCode: 200 })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkQuery,
    findParty,
    fmtResult
  ])
}
