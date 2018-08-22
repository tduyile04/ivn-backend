import composeWaterfall from 'lib/compose/waterfall'
import knex from '_models'
import { formatUser } from './util'
// Check query object
function checkQuery (req, res, callback) {
  const data = { query: req.query, user: { id: req.params.user_id } }
  return callback(null, data, res)
}

function fetchUser (data, res, callback) {
  const fields = ['id', 'email', 'avatar', 'firstName', 'lastName'].reduce((acc, field) => {
    acc.push(
      `user.${field} as ${field}`,
      `follower.${field} as follower_${field}`,
      `following.${field} as following_${field}`,
      `endorsement.${field} as endorsement_${field}`
    )
    return acc
  }, [])
  return knex('user')
    .leftJoin('user_role', 'user_role.user_id', 'user.id')
    .leftJoin('role', 'role.id', 'user_role.role_id')
    .leftJoin('user_follow as following_user', 'following_user.follower_id', 'user.id')
    .leftJoin('user_follow as follower_user', 'follower_user.following_id', 'user.id')
    .leftJoin('user_endorse', 'user_endorse.candidate_id', 'user.id')
    .leftJoin('user as following', 'following.id', 'following_user.following_id')
    .leftJoin('user as follower', 'follower.id', 'follower_user.follower_id')
    .leftJoin('user as endorsement', 'endorsement.id', 'user_endorse.endorser_id')
    .select([
      'role.id as role_id',
      'role.name as role_name',
      'follower.id as follower_id'
    ].concat(fields))
    .where({ 'user.id': data.user.id })
    .options({ nestTables: true })
    .then(rows => {
      if (rows.length === 0) {
        return callback({ message: 'User not found', code: 404 }) // eslint-disable-line
      }
      data.user = formatUser(rows)
      return callback(null, data, res)
    })
    .catch(() => callback({ message: 'User not found', code: 404 })) // eslint-disable-line
}

function fmtResult (data, res, callback) {
  return callback(null, { user: data.user })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkQuery,
    fetchUser,
    fmtResult
  ])
}
