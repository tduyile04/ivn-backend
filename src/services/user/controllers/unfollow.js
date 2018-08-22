import check from 'body-checker'
import composeWaterfall from 'lib/compose/waterfall'
import knex from '_models'
import { errorHandler } from 'lib/error'

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
    return callback({ message: 'Cannot unfollow yourself', code: 400 }) // eslint-disable-line
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
    })
    .catch(() => callback({ message: 'User not found', code: 404 })) // eslint-disable-line
}

function findFollowed (data, res, callback) {
  return knex('user_follow')
    .where({ follower_id: data.auth.id, following_id: data.user })
    .select('*')
    .then(followings => {
      console.log(followings)
      return followings.length
        ? callback(null, Object.assign({}, data, { relationship: followings[0] }), res)
        : callback({ message: 'User is not followed', code: 400 })  // eslint-disable-line
    })
    .catch(error => errorHandler(error, res))
}

function removeRelationship (data, res, callback) {
  return knex('user_follow')
    .where({ id: data.relationship.id })
    .del()
    .then(() => callback(null, data, res))
    .catch(error => errorHandler(error, res))
}

function fmtResult (data, res, callback) {
  callback(null, { statusCode: 200, message: 'Successfully unfollowed user' })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    validateBody,
    findUser,
    findFollowed,
    removeRelationship,
    fmtResult
  ])
}
