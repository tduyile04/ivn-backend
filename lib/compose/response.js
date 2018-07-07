import logger from 'lib/logger'

const composeResponse = (res) => {
  return {
    error: (code, data) => {
      logger.error(code, data)
      return res
        .status(code)
        .json({
          status: { code, message: 'failed' },
          error: data
        })
    },
    success: (code, data, metadata) => {
      return res
        .status(code || 200)
        .json({
          status: { code: code || 200, message: 'success' },
          data,
          metadata: metadata || undefined
        })
    }
  }
}

export default composeResponse
