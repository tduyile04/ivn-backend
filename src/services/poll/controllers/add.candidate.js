import axios from 'axios'
import check from 'body-checker'
import composeWaterfall from 'lib/compose/waterfall'
import { errorHandler } from 'lib/error'
import knex from '_models'

function checkBody (req, res, callback) {
  const data = {}
  return check(req.body, {
    candidate: {
      type: 'string',
      required: true
    }
  }, (err, body) => {
    if (err) {
      return callback({ message: `Poll ${err}`, code: 400 }) // eslint-disable-line
    }
    axios.defaults.headers.common['Authorization'] = req.headers.authorization
    axios.defaults.baseURL = `http://${req.headers.host}`
    data.auth = req.auth
    data.fields = body
    data.fields.poll = req.params.poll_id
    return callback(null, data, res)
  })
}
function findPoll (data, res, callback) {
  const error = { message: 'Poll not found', code: 404 }
  return knex('poll')
    .select('*')
    .where({ id: data.fields.poll })
    .then(result => {
      data.fields.poll = result[0]
      return data.fields.poll
        ? callback(null, data, res)
        : callback(error)
    })
    .catch(() => callback(error))
}

function findUser (data, res, callback) {
  const error = { message: 'User not found', code: 404 }
  return knex('user')
    .where({ id: data.fields.candidate })
    .then(result => {
      data.fields.candidate = result[0]
      return data.fields.candidate
        ? callback(null, data, res)
        : callback(error)
    })
    .catch(() => callback(error))
}

function validateUserRole (data, res, callback) {
  const error = { message: 'User is not a politician', code: 400 }
  return knex('role')
    .leftJoin('user_role', 'user_role.role_id', 'role.id')
    .select('*')
    .where({ name: 'politician', 'user_role.user_id': data.fields.candidate.id })
    .then(result => {
      return result.length
        ? callback(null, data, res)
        : callback(error)
    })
    .catch(e => errorHandler(e, res))
}

function findCandidacy (data, res, callback) {
  const error = { message: 'User is already a candidate in this poll', code: 409 }
  return knex('poll_candidate')
    .where({ poll_id: data.fields.poll.id, user_id: data.fields.candidate.id })
    .then(result => {
      return result.length
        ? callback(error)
        : callback(null, data, res)
    })
    .catch(e => errorHandler(e, res))
}

function createCandidacy (data, res, callback) {
  data.pollCandidate = {
    user_id: data.fields.candidate.id,
    poll_id: data.fields.poll.id
  }
  return callback(null, data, res)
}

function saveCandidate (data, res, callback) {
  return knex('poll_candidate')
    .insert(data.pollCandidate)
    .returning('*')
    .then(result => callback(null, Object.assign({}, data, { candidacy: result[0] }), res))
    .catch(e => errorHandler(e, res))
}

function updateRole (data, res, callback) {
  return axios.put(`/api/v1/user/${data.pollCandidate.user_id}/add_role`, {
    role: 'candidate'
  })
    .then(() => callback(null, data, res))
    .catch(e => {
      rollBack(data.candidacy.id)
        .then(() => callback({ message: 'Service unavailable at this time', code: 500 })) // eslint-disable-line
    })
}

function rollBack (id) {
  return knex('poll_candidate')
    .where({ id })
    .del()
}

function fmtResult (data, res, callback) {
  return callback(null, { statusCode: 200, message: 'User added', poll: data.poll })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    findPoll,
    findUser,
    validateUserRole,
    findCandidacy,
    createCandidacy,
    saveCandidate,
    updateRole,
    fmtResult
  ])
}
