
import composeWaterfall from 'lib/compose/waterfall'
import { errorHandler } from 'lib/error'

function checkBody (req, res, callback) {
  const data = {}
  return callback(null, data, res)
}

function fmtResult (data, res, callback) {
  return callback(null, { statusCode: 500, message: 'Resource inactive' })
}

export default function (...args) {
  return composeWaterfall(args, [
    checkBody,
    fmtResult
  ])
}
