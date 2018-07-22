import composeWaterfall from 'lib/compose/waterfall'
import q, { fmtRawResponse, fetchCandidate } from './util'
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

function findCandidate (data, res, callback) {
  const errorMessage = { message: 'Candidate not found', code: 404 }
  if (data.query.candidate) {
    return fetchCandidate(data.query.candidate)
      .then(() => callback(null, data, res))
      .catch(() => callback(errorMessage))
  }
  return callback(null, data, res)
}

function fetchQuestions (data, res, callback) {
  return q.get({})
    .then(rows => {
      data.questions = fmtRawResponse(rows)
      return callback(null, data, res)
    })
    .catch(e => errorHandler(e, res))
}

function fmtResult (data, res, callback) {
  const result = paginate(data.questions, data.query.page, data.query.limit)
  return callback(null, { questions: result.data }, result.metadata)
}

export default function (...args) {
  return composeWaterfall(args, [
    checkQuery,
    findCandidate,
    fetchQuestions,
    fmtResult
  ])
}
