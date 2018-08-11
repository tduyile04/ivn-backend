import composeWaterfall from 'lib/compose/waterfall'
import q, { fmtRawResponse } from './util'
import { errorHandler } from 'lib/error'
import paginate from '../../../../lib/compose/paginate'

// Check query object
function checkQuery (req, res, callback) {
  const data = {}
  let { limit = 10, page = 1, candidate } = req.query
  if (isNaN(limit) || isNaN(page)) {
    limit = 10
    page = 1
  }
  data.query = { limit: Number(limit), page: Number(page), candidate }
  return callback(null, data, res)
}

function fetchPosts (data, res, callback) {
  return q.get({})
    .then(rows => {
      data.posts = fmtRawResponse(rows)
      return callback(null, data, res)
    })
    .catch(e => errorHandler(e, res))
}

function fmtResult (data, res, callback) {
  const result = paginate(data.posts, data.query.page, data.query.limit)
  return callback(null, { posts: result.data }, result.metadata)
}

export default function (...args) {
  return composeWaterfall(args, [
    checkQuery,
    fetchPosts,
    fmtResult
  ])
}
