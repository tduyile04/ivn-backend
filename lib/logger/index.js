import chalk from 'chalk'

const now = () => chalk.magenta(new Date().toISOString().replace('T', '@').split('.')[0])
const fmt = (args, level) => args.map(arg => typeof arg === 'object' ? console.log(arg) : chalk[level](arg))

const log = (...args) => console.log(now(), ...fmt(args, 'green'))
const info = (...args) => console.log(now(), ...fmt(args, 'blue'))
const error = (...args) => console.error(now(), ...fmt(args, 'red'))

const logger = {
  log,
  info,
  error
}

export default logger
