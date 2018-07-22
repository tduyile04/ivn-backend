import check from 'body-checker'
import composeWaterfall from 'lib/compose/waterfall'
import knex from '_models'
import { errorHandler } from 'lib/error'

function checkBody (req, res, callback) {
  const data = {}
  return check(req.body, {
    question: {
      type: 'string',
      required: true
    },
    answer: {
      type: 'string',
      required: true
    }
  }, (err, body) => {
    if (err) {
      return callback({ message: `Answer ${err}`, code: 400 }) // eslint-disable-line
    }
    data.auth = req.auth
    data.fields = body
    return callback(null, data, res)
  })
}

function validateAnswer (data, res, callback) {
  if (data.fields.answer.length > 255) {
    return callback({ message: 'Answer cannot be more that 255 characters long', code: 400 }) // eslint-disable-line
  }
  return callback(null, data, res)
}

function findCandidate (data, res, callback) {
  const errorMessage = { message: 'Unauthorized', code: 403 }
  if (data.auth.roles.filter(r => r.name === 'candidate').length === 0) {
    return callback(errorMessage)
  }
  return callback(null, data, res)
}

function findQuestion (data, res, callback) {
  return knex('question')
    .where({ id: data.fields.question })
    .select('*')
    .then(result => {
      if (result.length === 1) {
        data.question = result[0]
        return callback(null, data, res)
      }
      return callback({ message: 'Question not found', code: 404 }) // eslint-disable-line
    })
    .catch(() => callback({ message: 'Question not found', code: 404 })) // eslint-disable-line
}

function findAnswer (data, res, callback) {
  return knex('answer')
    .where({ question_id: data.question.id })
    .select('id')
    .then(result => {
      return result.length === 1
        ? callback({ message: 'Question already answered', code:  409 }) // eslint-disable-line
        : callback(null, data, res)
    })
    .catch(e => errorHandler(e, res))
}

function checkTargetCandidate (data, res, callback) {
  if (data.auth.id !== data.question.candidate_id) {
    return callback({ message: 'Unauthorized', code: 403 }) // eslint-disable-line
  }
  return callback(null, data, res) 
}

function createAnswer (data, res, callback) {
  data.answer = {
    answer: data.fields.answer,
    candidate_id: data.auth.id,
    question_id: data.question.id
  }
  return callback(null, data, res)
}

function saveAnswer (data, res, callback) {
  return knex('answer')
    .returning(['id', 'answer', 'question_id'])
    .insert(data.answer)
    .then(response => {
      data.answer = response[0]
      return callback(null, data, res)
    })
    .catch(e => errorHandler(e, res))
}

function fmtResult (data, res, callback) {
  return callback(null, { statusCode: 201, answer: data.answer })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    validateAnswer,
    findCandidate,
    findQuestion,
    findAnswer,
    checkTargetCandidate,
    createAnswer,
    saveAnswer,
    fmtResult
  ])
}
