const controller = `
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
`

const serviceRoute = `
import Service from '@sx/controllers'
import composeAppRoute from 'lib/compose/app-route'
import allow from '_middlewares/allow'

export const routes = composeAppRoute(
  [
    ['get', '/sxs', allow('auth'), 'all'],
    ['post', '/sxs', allow('auth'), 'create'],
    ['get', '/sx/:sx_id', allow('auth'), 'one'],
    ['delete', '/sx/:sx_id', allow('auth'), 'remove']
  ],
  new Service()
)
`

const route = `
import composeRouter from 'lib/compose/router'
import { routes } from '@sx/routes'

export default router => composeRouter(routes, router)
`

const indexController = `
import all from './all'
import one from './one'
import create from './create'
import remove from './remove'

class Service {
  all = all
  one = one
  create = create
  remove = remove
}

export default Service
`

function mapTemplate (template, service) {
  return template.split('\n').map(t => {
    return t.replace(/sx/g, service)
  }).join('\n')
}

function createTemplate (type) {
  return function (service) {
    if (type === 'controller') {
      return controller
    } else if (type === 'serviceRoute') {
      return mapTemplate(serviceRoute, service)
    } else if (type === 'route') {
      return mapTemplate(route, service)
    } else if (type === 'indexController') {
      return mapTemplate(indexController, service)
    }
  }
}

module.exports = {
  controller: createTemplate('controller'),
  serviceRoute: createTemplate('serviceRoute'),
  route: createTemplate('route'),
  indexController: createTemplate('indexController')
}
