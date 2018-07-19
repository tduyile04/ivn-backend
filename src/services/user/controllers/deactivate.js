import composeWaterfall from 'lib/compose/waterfall'
import knex from '_models'
import { errorHandler } from 'lib/error'
import { isAdmin } from 'src/util'

function checkBody (req, res, callback) {
  const data = { auth: req.auth, user: { id: req.params.user_id } }
  if (!isAdmin(data.auth.roles) && data.auth.id !== data.user.id) {
    return callback({ message: 'Unauthorized! You cannot access this resource', code: 403 }) // eslint-disable-line
  }
  return callback(null, data, res)
}

function findUser (data, res, callback) {
  return knex('user')
    .where({ id: data.user.id })
    .select('*')
    .then(users => {
      return users.length > 0
        ? callback(null, data, res)
        : callback({ message: 'User not found', code: 404 }) // eslint-disable-line
    }).catch(() => callback({ message: 'User not found', code: 404 })) // eslint-disable-line
}

function deactivateUser (data, res, callback) {
  return knex('user')
    .where({ id: data.user.id })
    .del()
    .then(() => callback(null, data, res))
    .catch(error => errorHandler(error, res))
}

function fmtResult (data, res, callback) {
  return callback(null, { statusCode: 204 })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    findUser,
    deactivateUser,
    fmtResult
  ])
}
