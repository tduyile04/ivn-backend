import composeWaterfall from 'lib/compose/waterfall'
import { errorHandler } from 'lib/error'
import { db } from '_models'

function findParty (req, res, callback) {
  return db
    .query('SELECT id FROM party WHERE id = $1', [req.params.party_id])
    .then(res => {
      return res.rows.length > 0
        ? callback(null, { party: res.rows[0] }, res)
        : callback({ message: 'party not found', code: 404 }) // eslint-disable-line
    })
    .catch(error => errorHandler(error, res))
}

function deleteParty (data, res, callback) {
  return db
    .query('DELETE FROM party WHERE id = $1', [data.party.id])
    .then(res => callback(null, data, res))
    .catch(error => errorHandler(error, res))
}

function fmtResult (data, res, callback) {
  return callback(null, { statusCode: 200 })
}

export default function (model) {
  return (...args) => {
    return composeWaterfall(args, [
      findParty,
      deleteParty,
      fmtResult
    ])
  }
}
