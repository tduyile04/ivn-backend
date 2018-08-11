import composeWaterfall from 'lib/compose/waterfall'
import q, { fmtRawResponse } from './util'

// Check query object
function checkQuery (req, res, callback) {
  const data = { query: req.query, post: { id: req.params.post_id } }
  return callback(null, data, res)
}

function fetchPost (data, res, callback) {
  return q.get({ 'post.id': data.post.id })
    .then(rows => {
      if (rows.length === 0) {
        return callback({ message: 'Post not found', code: 404 }) // eslint-disable-line
      }
      data.post = fmtRawResponse(rows)[0]
      return callback(null, data, res)
    })
    .catch(() => callback({ message: 'Post not found', code: 404 })) // eslint-disable-line
}

function fmtResult (data, res, callback) {
  return callback(null, { post: data.post })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkQuery,
    fetchPost,
    fmtResult
  ])
}
