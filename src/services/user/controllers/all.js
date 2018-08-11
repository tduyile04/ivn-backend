import composeWaterfall from 'lib/compose/waterfall'
import { errorHandler } from 'lib/error'
import knex from '_models'
import paginate from '../../../../lib/compose/paginate'
import { states, countries, localGovernments } from 'lib/databank'

function getCountry (country) {
  return Object
    .keys(countries)
    .filter(c => c.toLowerCase() === country.toLowerCase())[0] || country
}

function getState (state) {
  return Object
    .keys(states)
    .filter(s => s.toLowerCase() === state.toLowerCase())[0] || state
}

function getLocalGovernment (lg) {
  return localGovernments
    .filter(l => l.toLowerCase() === lg.toLowerCase())[0] || lg
}

// Check query object
function checkQuery (req, res, callback) {
  const data = {}
  let { limit = 10, page = 1, country = null, state = null, localGovernment = null, roles = null } = req.query
  if (isNaN(limit) || isNaN(page)) {
    limit = 10
    page = 1
  }
  data.query = { limit: Number(limit), page: Number(page), country, state, localGovernment, roles }
  return callback(null, data, res)
}

function createLocationFilterQuery (data, res, callback) {
  const query = {}
  if (data.query.country) {
    data.query.country = getCountry(data.query.country)
    query.country = data.query.country
  }
  if (data.query.state) {
    data.query.state = getState(data.query.state)
    query.state = data.query.state
  }
  if (data.query.localGovernment) {
    data.query.localGovernment = getLocalGovernment(data.query.localGovernment)
    data.query.localGovernment = data.query.localGovernment
  }
  data.filterQuery = query
  return callback(null, data, res)
}

function createRoleFilterQuery (data, res, callback) {
  const query = { roles: ['regular', 'candidate', 'politician'] }
  if (data.query.roles) {
    query.roles = data.query.roles.split(',').filter(r => query.roles.indexOf(r) >= 0)
  }
  data.filterRoleQuery = query.roles
  return callback(null, data, res)
}

function fetchUsers (data, res, callback) {
  console.log(data.filterQuery, data.filterRoleQuery)
  return knex('user as u')
    .leftJoin('user_role as ur', 'u.id', 'ur.user_id')
    .leftJoin('role as r', 'ur.role_id', 'r.id')
    .select(['u.id', 'u.email', 'u.firstName', 'u.lastName', 'r.name as roleName'])
    .where(data.filterQuery)
    .whereIn('r.name', data.filterRoleQuery)
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
    createLocationFilterQuery,
    createRoleFilterQuery,
    fetchUsers,
    fmtResult
  ])
}
