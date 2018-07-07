const async = require('async')
const util = require('./util')
const _ = require('lodash')

const admin = (req, res, next) => {
  async.waterfall([
    async.apply(check, req, res),
    getAdmin
  ], (error, result) => error
    ? res.status(403).json(util.response)
    : next()
  )
}

const check = (req, res, callback) => {
  if (!util.isRole(req, 'admin')) return callback(new Error())
  return callback(null, req, res)
}

const getAdmin = (req, res, callback) => {
  req.admin = _.clone(req.auth)
  return callback(null)
}

module.exports = admin
