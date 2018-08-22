import composeWaterfall from 'lib/compose/waterfall'
import { errorHandler } from 'lib/error'
import knex from '_models'
import paginate from '../../../../lib/compose/paginate'

// Check query object
function checkQuery (req, res, callback) {
  const data = {}
  let { limit = 10, page = 1 } = req.query
  if (isNaN(limit) || isNaN(page)) {
    limit = 10
    page = 1
  }
  data.query = { limit: Number(limit), page: Number(page) }
  return callback(null, data, res)
}

function fetchUsers (data, res, callback) {
  return knex('user as u')
    .leftJoin('user_role as ur', 'u.id', 'ur.user_id')
    .leftJoin('role as r', 'ur.role_id', 'r.id')
    .select(['u.id', 'u.email', 'u.firstName', 'u.lastName', 'r.name as roleName'])
    .options({ nestTables: true })
    .then(users => {
      data.users = Object.values(users.reduce((acc, user) => {
        if (acc[user.id]) {
          acc[user.id].roles.push(user.roleName)
        } else {
          acc[user.id] = user
          acc[user.id].roles = [user.roleName]
          delete acc[user.id].roleName
        }
        return acc
      }, {}))
      return callback(null, data, res)
    })
    .catch(e => errorHandler(e, res))
}

function fmtResult (data, res, callback) {
  const result = paginate(data.users, data.query.page, data.query.limit)
  return callback(null, { users: result.data }, result.metadata)
}

export default function (...args) {
  return composeWaterfall(args, [
    checkQuery,
    fetchUsers,
    fmtResult
  ])
}
