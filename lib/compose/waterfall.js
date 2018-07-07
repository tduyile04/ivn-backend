import async from 'async'
import logger from 'lib/logger'
import composeResponse from 'lib/compose/response'

const composeWaterfall = ([req, res], waterfall) => {
  logger.log(`START: [${req.method}]`, req.originalUrl)
  const unfoldWaterfall = waterfall.map(fn => {
    return (...args) => {
      logger.log(`\tRunning block: ${fn.name}`)
      fn(...args)
    }
  })

  unfoldWaterfall[0] = async.apply(unfoldWaterfall[0], req, res)

  const response = composeResponse(res)

  const done = (error, result, metadata = null, code) => {
    logger.log(`DONE: [${req.method}]`, req.originalUrl)
    if (error) {
      logger.log(error.code)
      return response.error(error.code, error)
    } else {
      const { statusCode = 200 } = result
      delete result.statusCode
      return response.success(statusCode, result, metadata)
    }
  }

  // Do Async Op
  async.waterfall(unfoldWaterfall, done)
}

export default composeWaterfall
