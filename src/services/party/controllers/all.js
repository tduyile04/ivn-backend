import composeWaterfall from 'lib/compose/waterfall'
import { errorHandler } from 'lib/error'
import knex from '_models'
import { formatParties } from './util'

// Check query object
function checkQuery (req, res, callback) {
  return callback(null, req.query, res)
}

function fetchParties (data, res, callback) {
  // TODO: ADD only admin action
  return knex('party')
    .leftJoin('party_follow', 'party_follow.party_id', 'party.id')
    .leftJoin('party_member', 'party_member.party_id', 'party.id')
    .select(['party.*', 'party_follow.id as follower', 'party_member.id as member'])
    .then(res => {
      data.parties = formatParties(res)
      return callback(null, data, res)
    })
    .catch(error => errorHandler(error, res))
}

function fmtResult (data, res, callback) {
  const parties = data.parties.map(party => party)
  return callback(null, { parties })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkQuery,
    fetchParties,
    fmtResult
  ])
}
