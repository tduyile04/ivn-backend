import composeWaterfall from 'lib/compose/waterfall'
import { errorHandler } from 'lib/error'
import { db } from '_models'

// Check query object
function checkQuery (req, res, callback) {
  return callback(null, req.query, res)
}

function fetchParties (data, res, callback) {
  // TODO: ADD only admin action
  return db
    .query('SELECT id, name, created_at, updated_at FROM party')
    .then(res => {
      data.parties = res.rows
      return callback(null, data, res)
    })
    .catch(error => errorHandler(error, res))
}

function fmtResult (data, res, callback) {
  const parties = data.parties.map(party => party)
  return callback(null, { parties })
}

export default function (model) {
  return (...args) => {
    return composeWaterfall(args, [
      checkQuery,
      fetchParties,
      fmtResult
    ])
  }
}
