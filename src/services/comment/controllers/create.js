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
    comment: {
      type: 'string',
      required: true
    }
  }, (err, body) => {
    if (err) {
      return callback({ message: `Comment ${err}`, code: 400 }) // eslint-disable-line
    }
    data.auth = req.auth
    data.fields = body
    return callback(null, data, res)
  })
}

function validateComment (data, res, callback) {
  if (data.fields.comment.length > 255) {
    return callback({ message: 'Comment cannot be more that 255 characters long', code: 400 }) // eslint-disable-line
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

function createComment (data, res, callback) {
  data.comment = {
    comment: data.fields.comment,
    question_id: data.question.id,
    user_id: data.auth.id
  }
  return callback(null, data, res)
}

function saveComment (data, res, callback) {
  return knex('comment')
    .returning('*')
    .insert(data.comment)
    .then(response => {
      data.comment = response[0]
      return callback(null, data, res)
    })
    .catch(e => errorHandler(e, res))
}

function fmtResult (data, res, callback) {
  return callback(null, { statusCode: 201, comment: data.comment })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    validateComment,
    findQuestion,
    createComment,
    saveComment,
    fmtResult
  ])
}
