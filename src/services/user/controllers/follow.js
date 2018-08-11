import check from 'body-checker'
import composeWaterfall from 'lib/compose/waterfall'
import knex, { db } from '_models'
import { errorHandler } from 'lib/error'

// Notifications
import { createNotifications } from '@notification/controllers/util'

function checkBody (req, res, callback) {
  return check(req.body, {
    user: {
      type: 'string',
      required: true
    }
  }, (err, body) => {
    if (err) return callback({ message: `User ${err}`, code: 400 }) // eslint-disable-line
    body.auth = req.auth
    return callback(null, body, res)
  })
}

function validateBody (data, res, callback) {
  if (data.user === data.auth.id) {
    return callback({ message: 'Cannot follow yourself', code: 400 }) // eslint-disable-line
  }
  return callback(null, data, res)
}

function findUser (data, res, callback) {
  return knex('user')
    .where({ id: data.user })
    .select('*')
    .then(users => {
      return users.length > 0
        ? callback(null, data, res)
        : callback({ message: 'User not found', code: 404 }) // eslint-disable-line
    }).catch((err) => {
      console.log(err)
      return callback({ message: 'User not found', code: 404 }) // eslint-disable-line
    })
}

function findFollowed (data, res, callback) {
  return knex('user_follow')
    .where({ follower_id: data.auth.id })
    .select('*')
    .then(followings => {
      return followings.map(f => f.following_id).indexOf(data.user) === -1
        ? callback(null, data, res)
        : callback({ message: 'Already followed this user', code: 409 })  // eslint-disable-line
    })
    .catch(error => errorHandler(error, res))
}

function createRelationship (data, res, callback) {
  const userFollow = {
    follower_id: data.auth.id,
    following_id: data.user
  }
  data.fields = userFollow
  return callback(null, data, res)
}

function saveRelationship (data, res, callback) {
  const { fields } = data
  return db
    .query('INSERT INTO user_follow (follower_id, following_id) VALUES($1, $2)', [fields.follower_id, fields.following_id])
    .then(() => callback(null, data, res))
    .catch(error => errorHandler(error, res))
}

function fmtResult (data, res, callback) {
  const notification = {
    note: `${data.auth.firstName} ${data.auth.lastName} just followed you`,
    context: 'user_follow',
    sender_id: data.auth.id,
    owner_id: data.fields.following_id
  }
  createNotifications(notification)
  return callback(null, { statusCode: 200, message: 'followed user' })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    validateBody,
    findUser,
    findFollowed,
    createRelationship,
    saveRelationship,
    fmtResult
  ])
}
