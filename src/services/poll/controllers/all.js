import composeWaterfall from 'lib/compose/waterfall'
import { errorHandler } from 'lib/error'
import knex from '_models'
import paginate from '../../../../lib/compose/paginate'

import { states, countries, localGovernments } from 'lib/databank'
import { fmtRawResponse } from './util'

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

function formatQuery (q) {
  return Object.keys(q).reduce((a, b) => {
    if (Array.isArray(q[b])) {
      a[b] = q[b][0]
    } else {
      a[b] = q[b]
    }
    return a
  }, {})
}

function checkBody (req, res, callback) {
  const data = {}
  let { limit = 10, page = 1, country = null, state = null, local = null, candidates = null, level = null } = req.query
  if (isNaN(limit) || isNaN(page)) {
    limit = 10
    page = 1
  }
  data.query = formatQuery({ limit: Number(limit), page: Number(page), country, state, local, candidates, level })
  return callback(null, data, res)
}

function createCountryFilterQuery (data, res, callback) {
  let query = []
  if (data.query.country) {
    query = data.query.country.split(',').map(getCountry)
  }
  data.filterCountryQuery = query
  return callback(null, data, res)
}

function createStateFilterQuery (data, res, callback) {
  let query = []
  if (data.query.state) {
    query = data.query.state.split(',').map(getState)
  }
  data.filterStateQuery = query
  return callback(null, data, res)
}

function createLocalFilterQuery (data, res, callback) {
  let query = []
  if (data.query.local) {
    query = data.query.local.split(',').map(getLocalGovernment)
  }
  data.filterLocalQuery = query
  return callback(null, data, res)
}

function createCandidateFilterQuery (data, res, callback) {
  let query = []
  if (data.query.candidates) {
    query = data.query.candidates.split(',')
  }
  data.filterCandidateQuery = query
  return callback(null, data, res)
}

function createLevelFilterQuery (data, res, callback) {
  let query = []
  if (data.query.level) {
    query = data.query.level.split(',')
  }
  data.filterLevelQuery = query
  return callback(null, data, res)
}

function fetchPolls (data, res, callback) {
  return knex('poll')
    .leftJoin('poll_candidate', 'poll_candidate.poll_id', 'poll.id')
    .leftJoin('poll_voter', 'poll_voter.poll_id', 'poll.id')
    .leftJoin('poll_candidate_disqualified', 'poll_candidate_disqualified.poll_id', 'poll.id')
    .leftJoin('user as candidate', 'candidate.id', 'poll_candidate.user_id')
    .leftJoin('user as voter', 'voter.id', 'poll_voter.user_id')
    .leftJoin('user as disqualified', 'disqualified.id', 'poll_candidate_disqualified.candidate_id')
    .leftJoin('user as winner', 'winner.id', 'poll.winner')
    .select([
      'poll.*',
      'winner.id as winner_id',
      'winner.firstName as winner_firstname',
      'winner.lastName as winner_lastname',
      'winner.avatar as winner_avatar',
      'winner.avatar as email_avatar',
      'candidate.id as candidate_id',
      'candidate.firstName as candidate_firstname',
      'candidate.lastName as candidate_lastname',
      'candidate.avatar as candidate_avatar',
      'candidate.email as candidate_email',
      'voter.id as voter_id',
      'voter.firstName as voter_firstname',
      'voter.lastName as voter_lastname',
      'voter.avatar as voter_avatar',
      'voter.email as voter_email',
      'disqualified.id as disqualified_id',
      'disqualified.firstName as disqualified_firstname',
      'disqualified.lastName as disqualified_lastname',
      'disqualified.avatar as disqualified_avatar',
      'disqualified.email as disqualified_email'
    ])
    .where(...(data.filterCountryQuery.length ? ['poll.country', 'in', data.filterCountryQuery] : [{}]))
    .andWhere(...(data.filterStateQuery.length ? ['poll.state', 'in', data.filterStateQuery] : [{}]))
    .andWhere(...(data.filterLocalQuery.length ? ['poll.local_government', 'in', data.filterLocalQuery] : [{}]))
    .andWhere(...(data.filterLevelQuery.length ? ['poll.level', 'in', data.filterLevelQuery] : [{}]))
    .options({ nestTables: true })
    .then(result => {
      data.polls = fmtRawResponse(result)
      return callback(null, data, res)
    })
    .catch(e => errorHandler(e, res))
}

function fmtResult (data, res, callback) {
  const result = paginate(data.polls, data.query.page, data.query.limit)
  return callback(null, { polls: result.data }, result.metadata)
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    createCountryFilterQuery,
    createStateFilterQuery,
    createLocalFilterQuery,
    createLevelFilterQuery,
    fetchPolls,
    fmtResult
  ])
}
