import { db } from '_models'

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
  return db.query('SELECT u.*, p.role_id, r.name as role FROM "user_role" p LEFT JOIN "user" u ON u.id = p.user_id LEFT JOIN "role" r ON r.id = p.role_id WHERE u.id=$1', [user.id])
    .then(res => {
      req.auth = res.rows[0]
      req.auth.roles = res.rows.map(row => ({
        id: row.role_id,
        name: row.role
      }))
      return callback(null)
    })
    .catch(error => { console.log(error); return res.status(403).json(util.response) })
}

module.exports = auth
