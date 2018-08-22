import composeWaterfall from 'lib/compose/waterfall'
import knex from '_models'

// Check query object
function checkQuery (req, res, callback) {
  const data = { query: req.query, user: { id: req.params.user_id } }
  return callback(null, data, res)
}

function fetchUser (data, res, callback) {
  return knex('user as u')
    .leftJoin('user_role as ur', 'u.id', 'ur.user_id')
    .leftJoin('role as r', 'ur.role_id', 'r.id')
    .select(['u.id', 'u.email', 'u.firstName', 'u.lastName', 'r.name as roleName'])
    .where(knex.raw('u.id = ?', [data.user.id]))
    .options({ nestTables: true })
    .then(rows => {
      if (rows.length === 0) {
        return callback({ message: 'User not found', code: 404 }) // eslint-disable-line
      }
      data.user = Object.values(rows.reduce((acc, user) => {
        if (acc[user.id]) {
          acc[user.id].roles.push(user.roleName)
        } else {
          acc[user.id] = user
          acc[user.id].roles = [user.roleName]
          delete acc[user.id].roleName
        }
        return acc
      }, {}))[0]
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
