import composeWaterfall from 'lib/compose/waterfall'
import { db } from '_models'

function checkQuery (req, res, callback) {
  const query = req.query
  return callback(null, { query, party_id: req.params.party_id }, res)
}

function findParty (data, res, callback) {
  return db
    .query('SELECT * FROM party WHERE id = $1', [data.party_id])
    .then(res => {
      return res.rows.length
        ? callback(null, Object.assign({}, data, { party: res.rows[0] }), res)
        : callback({ message: 'party not found', code: 404 }) // eslint-disable-line
    })
    .catch(() => callback({ message: 'party not found', code: 404 })) // eslint-disable-line
}

function fmtResult (data, res, callback) {
  const party = data.party
  return callback(null, { party, statusCode: 200 })
}

export default function (model) {
  return (...args) => {
    return composeWaterfall(args, [
      checkQuery,
      findParty,
      fmtResult
    ])
  }
}
