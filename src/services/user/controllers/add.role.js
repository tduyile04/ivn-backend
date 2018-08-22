import check from 'body-checker'
import composeWaterfall from 'lib/compose/waterfall'
import knex from '_models'
import { errorHandler } from 'lib/error'

function checkBody (req, res, callback) {
  let data = {}
  return check(
    req.body,
    {
      role: {
        type: 'string',
        required: true
      }
    }, (err, body) => {
    if (err) return callback({ message: `User ${err}`, code: 400 }) // eslint-disable-line
      data.fields = body
      data.auth = req.admin
      data.user = { id: req.params.user_id }
      return callback(null, data, res)
    })
}

function validate (data, res, callback) {
  if (data.auth.id === data.user.id) {
    return callback({ message: 'Cannot upgrade your own role', code: 400 }) // eslint-disable-line
  }
  return callback(null, data, res)
}

function findUser (data, res, callback) {
  return knex('user')
    .where({ id: data.user.id })
    .select(['id'])
    .then(users => {
      return users.length > 0
        ? callback(null, Object.assign({}, data, { candiate: users[0] }), res)
        : callback({ message: 'User not found', code: 404 }) // eslint-disable-line
    })
    .catch(() => callback({ message: 'User not found', code: 404 })) // eslint-disable-line
}

function isAdmin (data, res, callback) {
  return knex('user as u')
    .leftJoin('user_role as ur', 'u.id', 'ur.user_id')
    .leftJoin('role as r', 'ur.role_id', 'r.id')
    .select(['u.id', 'r.name as roleName'])
    .where(knex.raw('u.id = ?', [data.user.id]))
    .options({ nestTables: true })
    .then(results => {
      const roles = results.filter(r => ['admin', 'super admin'].indexOf(r.roleName) !== -1)
      if (roles.length && data.auth.roles.indexOf('super admin') === -1) {
        return callback({ message: 'Cannot upgrade this user\'s role', code: 403 }) // eslint-disable-line
      }
      return callback(null, data, res)
    })
}

function findRole (data, res, callback) {
  return knex('role')
    .where({ name: data.fields.role })
    .select(['id'])
    .then(roles => {
      return roles.length > 0
        ? callback(null, Object.assign({}, data, { role: roles[0] }), res)
        : callback({ message: `Role "${data.fields.role}" not found`, code: 404 }) // eslint-disable-line
    })
    .catch(() => callback({ message: `Role "${data.fields.role}" not found`, code: 404 })) // eslint-disable-line
}

function findUserRole (data, res, callback) {
  return knex('user_role')
    .where({ user_id: data.user.id, role_id: data.role.id })
    .select(['id'])
    .then(results => {
      return results.length === 0
        ? callback(null, data, res)
        : callback({ message: 'User already has this role', code: 409 }) // eslint-disable-line
    })
    .catch(e => errorHandler(e, res)) // eslint-disable-line
}

function createRole (data, res, callback) {
  const userRole = {
    user_id: data.user.id,
    role_id: data.role.id
  }
  data.userRole = userRole
  return callback(null, data, res)
}

function saveRole (data, res, callback) {
  return knex('user_role')
    .insert(data.userRole)
    .then(() => callback(null, data, res))
    .catch(e => errorHandler(e, res))
}

function fmtResult (data, res, callback) {
  return callback(null, { statusCode: 200, message: 'Role added to user' })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    validate,
    findUser,
    isAdmin,
    findRole,
    findUserRole,
    createRole,
    saveRole,
    fmtResult
  ])
}
