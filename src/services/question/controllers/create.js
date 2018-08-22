import check from 'body-checker'
import composeWaterfall from 'lib/compose/waterfall'
import knex from '_models'
import { errorHandler } from 'lib/error'
import { fetchCandidate } from './util'

function checkBody (req, res, callback) {
  const data = {}
  return check(req.body, {
    question: {
      type: 'string',
      required: true
    },
    candidate: {
      type: 'string',
      required: true
    }
  }, (err, body) => {
    if (err) {
      return callback({ message: `Question ${err}`, code: 400 }) // eslint-disable-line
    }
    data.auth = req.auth
    data.fields = body
    return callback(null, data, res)
  })
}

function validateQuestion (data, res, callback) {
  if (data.fields.question.length > 255) {
    return callback({ message: 'Question cannot be more that 255 characters long', code: 400 }) // eslint-disable-line
  }
  return callback(null, data, res)
}

function findCandidate (data, res, callback) {
  const errorMessage = { message: 'Candidate not found', code: 404 }
  return fetchCandidate(data.fields.candidate)
    .then(() => callback(null, data, res))
    .catch(() => callback(errorMessage))
  // return knex('user as u')
  //   .leftJoin('user_role as ur', 'u.id', 'ur.user_id')
  //   .leftJoin('role as r', 'ur.role_id', 'r.id')
  //   .select(['u.id', 'r.name as roleName'])
  //   .where(knex.raw('u.id = ?', [data.fields.candidate]))
  //   .then(result => {
  //     if (result.length === 0) {
  //       return callback(errorMessage)
  //     } else if (result.filter(r => r.roleName === 'candidate').length === 0) {
  //       return callback(errorMessage)
  //     }
  //     return callback(null, data, res)
  //   })
}

function createQuestion (data, res, callback) {
  data.question = {
    question: data.fields.question,
    candidate_id: data.fields.candidate,
    asker_id: data.auth.id
  }
  return callback(null, data, res)
}

function saveQuestion (data, res, callback) {
  return knex('question')
    .returning(['id', 'question', 'candidate_id'])
    .insert(data.question)
    .then(response => {
      data.question = response[0]
      return callback(null, data, res)
    })
    .catch(e => errorHandler(e, res))
}

function fmtResult (data, res, callback) {
  return callback(null, { statusCode: 201, question: data.question })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    validateQuestion,
    findCandidate,
    createQuestion,
    saveQuestion,
    fmtResult
  ])
}
