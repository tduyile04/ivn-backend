import composeWaterfall from 'lib/compose/waterfall'
import knex from '_models'
import { errorHandler } from 'lib/error'

function checkBody (req, res, callback) {
  const data = {}
  data.auth = req.auth
  data.question = { id: req.params.question_id }
  return callback(null, data, res)
}

function findQuestion (data, res, callback) {
  return knex('question')
    .where({ id: data.question.id })
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

function findLiked (data, res, callback) {
  return knex('question_like')
    .where({ user_id: data.auth.id, question_id: data.question.id })
    .then(result => {
      if (result.length === 1) {
        data.liked = true
        data.like = result[0]
      }
      return callback(null, data, res)
    })
    .catch(e => errorHandler(e, res))
}

function createLike (data, res, callback) {
  if (!data.liked) {
    data.like = {
      user_id: data.auth.id,
      question_id: data.question.id
    }
  }
  return callback(null, data, res)
}

function saveAnswer (data, res, callback) {
  return (data.liked
    ? knex('question_like').where({ id: data.like.id }).del()
    : knex('question_like').returning('*').insert(data.like))
    .then(response => {
      data.like = response[0]
      return callback(null, data, res)
    })
    .catch(e => errorHandler(e, res))
}

function fmtResult (data, res, callback) {
  return callback(null, { statusCode: data.liked ? 204 : 201, question: data.question })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    findQuestion,
    findLiked,
    createLike,
    saveAnswer,
    fmtResult
  ])
}
