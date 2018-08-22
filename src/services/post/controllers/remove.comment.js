import check from 'body-checker'
import composeWaterfall from 'lib/compose/waterfall'
import knex from '_models'
import { errorHandler } from 'lib/error'

function checkBody (req, res, callback) {
  const data = {}
  return check(req.body, {
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
    data.fields.post = req.params.post_id
    return callback(null, data, res)
  })
}

function findPost (data, res, callback) {
  return knex('post')
    .where({ id: data.fields.post })
    .select('*')
    .then(result => {
      if (result.length === 1) {
        data.post = result[0]
        return callback(null, data, res)
      }
      return callback({ message: 'Post not found', code: 404 }) // eslint-disable-line
    })
    .catch(() => callback({ message: 'Post not found', code: 404 })) // eslint-disable-line
}

function findComment (data, res, callback) {
  return knex('comment_post')
    .where({ id: data.fields.comment, user_id: data.auth.user_id })
    .select('*')
    .then(result => {
      if (result.length === 1) {
        data.comment = result[0]
        return callback(null, data, res)
      }
      return callback({ message: 'Comment not found', code: 404 }) // eslint-disable-line
    })
    .catch(() => callback({ message: 'Comment not found', code: 404 })) // eslint-disable-line
}

function deleteComment (data, res, callback) {
  return knex('post_comment')
    .where({ id: data.comment.id })
    .del()
    .then(() => {
      return callback(null, data, res)
    })
    .catch(e => errorHandler(e, res))
}

function fmtResult (data, res, callback) {
  return callback(null, { statusCode: 204 })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    findPost,
    findComment,
    deleteComment,
    fmtResult
  ])
}
