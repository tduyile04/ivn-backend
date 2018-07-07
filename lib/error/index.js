import logger from 'lib/logger'

export const errorObject = (code = 500, message = 'unknown error') => {
  return {
    code,
    message,
    status: 'error'
  }
}

export const catchError = (error) => {
  logger.error(error.message)
  logger.error(error)
  return errorObject(500, error.message)
}

export const errorHandler = (error, res) => {
  return res.status(500).json(errorObject(500, error.message))
}
