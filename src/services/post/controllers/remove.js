import composeWaterfall from 'lib/compose/waterfall'
import knex from '_models'
import { errorHandler } from 'lib/error'

// Check query object
function checkQuery (req, res, callback) {
  const data = { query: req.query, post: { id: req.params.post_id } }
  data.auth = req.auths
  return callback(null, data, res)
}

function fetchPost (data, res, callback) {
  return knex('post')
    .where({ id: data.post.id, author_id: data.auth.id })
    .then(rows => {
      if (rows.length === 0) {
        return callback({ message: 'Post not found', code: 404 }) // eslint-disable-line
      }
      data.post = rows[0]
      return callback(null, data, res)
    })
    .catch(() => callback({ message: 'Post not found', code: 404 })) // eslint-disable-line
}

function deletePost (data, res, callback) {
  return knex('post')
    .where({ id: data.post.id })
    .del()
    .then(() => callback(null, data, res))
    .catch(e => errorHandler(e, res))
}

function fmtResult (data, res, callback) {
  return callback(null, { statusCode: 204 })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkQuery,
    fetchPost,
    deletePost,
    fmtResult
  ])
}
