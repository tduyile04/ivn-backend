const jwt = require('jsonwebtoken')
const logger = require('lib/logger')

exports.isAuth = function (req) {
  const authorization = req.headers.authorization
  if (authorization) {
    try {
      return !!jwt.decode(authorization, process.env.TOKEN_SECRET)
    } catch (e) {
      logger.error(e)
      return false
    }
  }
  return false
}

exports.isRole = function (req, role) {
  if (!req.auth) return false
  else if (!Array.isArray(req.auth.roles)) return false
  return req.auth.roles.map(r => r.name).indexOf(role) !== -1
}

exports.response = {
  status: {
    code: 403,
    message: 'failed'
  },
  error: {
    message: 'Unauthorized! You cannot access this resource'
  }
}
