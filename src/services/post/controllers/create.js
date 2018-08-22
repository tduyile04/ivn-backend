import check from 'body-checker'
import composeWaterfall from 'lib/compose/waterfall'
import knex from '_models'
import { errorHandler } from 'lib/error'
// import { fetchCandidate } from './util'

function checkBody (req, res, callback) {
  const data = {}
  return check(req.body, {
    content: {
      type: 'string',
      required: true
    }
  }, (err, body) => {
    if (err) {
      return callback({ message: `Post ${err}`, code: 400 }) // eslint-disable-line
    }
    data.auth = req.auth
    data.fields = body
    return callback(null, data, res)
  })
}

function validatePost (data, res, callback) {
  if (data.fields.content.length > 255) {
    return callback({ message: 'Posts cannot be more that 255 characters long', code: 400 }) // eslint-disable-line
  }
  return callback(null, data, res)
}

function createPost (data, res, callback) {
  data.post = {
    content: data.fields.content,
    author_id: data.auth.id
  }
  return callback(null, data, res)
}

function savePost (data, res, callback) {
  return knex('post')
    .returning(['id', 'content', 'author_id'])
    .insert(data.post)
    .then(response => {
      data.post = response[0]
      return callback(null, data, res)
    })
    .catch(e => errorHandler(e, res))
}

function fmtResult (data, res, callback) {
  return callback(null, { statusCode: 201, post: data.post })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    validatePost,
    createPost,
    savePost,
    fmtResult
  ])
}
