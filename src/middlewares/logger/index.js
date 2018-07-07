import fs from 'fs'
import path from 'path'
import chalk from 'chalk'
import moment from 'moment'

const logger = (req, res, next) => {
  chalk.blue(`new request`, req)
  next()
}

const saveToFile = (data) => {
  const date = moment().format('l').replace('-', '_')
  fs.appendFile(path.resolve(__dirname, `./logs/log_${date}.logfile`), data)
}

export const log = (...params) => {
  saveToFile(Array.isArray(params) ? params.join(' ') : params)
  console.log(...params)
}
export const warn = (...params) => {
  saveToFile(Array.isArray(params) ? params.join(' ') : params)
}
export const alarm = (...params) => {
  saveToFile(Array.isArray(params) ? params.join(' ') : params)
}

export default logger
