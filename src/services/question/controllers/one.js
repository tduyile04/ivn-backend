import composeWaterfall from 'lib/compose/waterfall'
import q, { fmtRawResponse } from './util'

// Check query object
function checkQuery (req, res, callback) {
  const data = { query: req.query, question: { id: req.params.question_id } }
  return callback(null, data, res)
}

function fetchQuestion (data, res, callback) {
  return q.get({ 'question.id': data.question.id })
    .then(rows => {
      if (rows.length === 0) {
        return callback({ message: 'Question not found', code: 404 }) // eslint-disable-line
      }
      data.question = fmtRawResponse(rows)[0]
      return callback(null, data, res)
    })
    .catch(() => callback({ message: 'Question not found', code: 404 })) // eslint-disable-line
}

function fmtResult (data, res, callback) {
  return callback(null, { question: data.question })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkQuery,
    fetchQuestion,
    fmtResult
  ])
}
