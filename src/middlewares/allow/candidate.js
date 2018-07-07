const async = require('async')
const util = require('./util')
const _ = require('lodash')

const candidate = (req, res, next) => {
  async.waterfall([
    async.apply(check, req, res),
    getCandidate
  ], (error, result) => error
    ? res.status(403).json(util.response)
    : next()
  )
}

const check = (req, res, callback) => {
  if (!util.isRole(req, 'candidate')) return callback(new Error())
  return callback(null, req, res)
}

const getCandidate = (req, res, callback) => {
  req.candidate = _.clone(req.auth)
  return callback(null)
}

module.exports = candidate
