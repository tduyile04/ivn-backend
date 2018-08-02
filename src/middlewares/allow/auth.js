import knex from '_models'

const async = require('async')
const jwt = require('jsonwebtoken')
const util = require('./util')

const auth = (req, res, next) => {
  async.waterfall([
    async.apply(check, req, res),
    decodeToken,
    getUser
  ], error => error
    ? res.status(403).json(util.response)
    : next()
  )
}

const check = (req, res, callback) => {
  if (!util.isAuth(req)) return callback(new Error({ message: 'unauthorized' }))
  return callback(null, req, res)
}

const decodeToken = (req, res, callback) => {
  const user = jwt.decode(
    req.headers.authorization,
    process.env.TOKEN_SECRET
  )
  return callback(null, req, res, user.data)
}

const getUser = (req, res, user, callback) => {
  return knex('user')
    .leftJoin('user_role', 'user_role.user_id', 'user.id')
    .leftJoin('role', 'role.id', 'user_role.role_id')
    .select(['user.*', 'role.name as role_name', 'role.id as role_id'])
    .where({ 'user.id': user.id })
    .then(result => {
      console.log(result)
      req.auth = Object.values(result.reduce((acc, u) => {
        if (acc[u.id]) {
          u.role_id && acc[u.id].roles.push({ name: u.role_name, id: u.role_id })
        } else {
          acc[u.id] = u
          acc[u.id].roles = u.role_id ? [{ name: u.role_name, id: u.role_id }] : []
        }
        return acc
      }, {}))[0]
      return callback(null)
    })
    .catch(error => { console.log(error); return res.status(403).json(util.response) })
}

module.exports = auth
