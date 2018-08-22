import check from 'body-checker'
import composeWaterfall from 'lib/compose/waterfall'
import knex from '_models'
import { errorHandler } from 'lib/error'

// Notifications
import { createNotifications } from '@notification/controllers/util'

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

function validateComment (data, res, callback) {
  if (data.fields.comment.length > 255) {
    return callback({ message: 'Comment cannot be more that 255 characters long', code: 400 }) // eslint-disable-line
  }
  return callback(null, data, res)
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

function createComment (data, res, callback) {
  data.comment = {
    comment: data.fields.comment,
    post_id: data.post.id,
    user_id: data.auth.id
  }
  return callback(null, data, res)
}

function saveComment (data, res, callback) {
  return knex('post_comment')
    .returning('*')
    .insert(data.comment)
    .then(response => {
      data.comment = response[0]
      return callback(null, data, res)
    })
    .catch(e => errorHandler(e, res))
}

function fmtResult (data, res, callback) {
  const notification = {
    note: `${data.auth.firstName} ${data.auth.lastName} just commented on your post`,
    context: 'post_comment',
    sender_id: data.auth.id,
    owner_id: data.post.author_id
  }
  createNotifications(notification)
  return callback(null, { statusCode: 201, comment: data.comment })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    validateComment,
    findPost,
    createComment,
    saveComment,
    fmtResult
  ])
}
