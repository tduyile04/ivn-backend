const fs = require('fs')
const path = require('path')
const templates = require('../template')

const servicePath = path.resolve(__dirname, '../../src/services')

// order of args name

function createService (service, version) {
  fs.mkdirSync(path.join(servicePath, service))
  const serviceControllerDir = path.join(servicePath, service, 'controllers')
  fs.mkdirSync(serviceControllerDir)
  fs.writeFileSync(path.join(serviceControllerDir, 'index.js'), templates.indexController(service))
  fs.writeFileSync(path.join(serviceControllerDir, 'create.js'), templates.controller(service))
  fs.writeFileSync(path.join(serviceControllerDir, 'one.js'), templates.controller(service))
  fs.writeFileSync(path.join(serviceControllerDir, 'remove.js'), templates.controller(service))
  fs.writeFileSync(path.join(serviceControllerDir, 'all.js'), templates.controller(service))
  const serviceRouteDir = path.join(servicePath, service, 'routes')
  fs.mkdirSync(serviceRouteDir)
  fs.writeFileSync(path.join(serviceRouteDir, 'index.js'), templates.serviceRoute(service))
  const routeServiceDir = path.join(servicePath, '..', 'routes', 'v1', service)
  fs.mkdirSync(routeServiceDir)
  return fs.writeFileSync(path.join(routeServiceDir, 'index.js'), templates.route(service))
}

function connectServiceRoute (service) {
  const filename = path.join(servicePath, '..', 'routes', 'v1', 'index.js')
  let routes = fs.readFileSync(filename)
  const routeByLine = routes.toString().split('\n')
  routeByLine.unshift(`import ${service} from './${service}'`)
  const newRouteByLine = routeByLine.reduce((a, b) => {
    a.push(b)
    b.includes('export') && a.push(`  ${service}(router)`)
    return a
  }, [])
  routes = newRouteByLine.join('\n')
  return fs.writeFileSync(filename, routes)
}

function addAlias (service) {
  const babelrcFilePath = path.join(path.resolve(__dirname, '../../'), '.babelrc')
  const babelrcfile = fs.readFileSync(babelrcFilePath)
  const babelrc = JSON.parse(babelrcfile.toString())
  babelrc.plugins[0][1].alias[`@${service}`] = `./src/services/${service}`
  return fs.writeFileSync(babelrcFilePath, JSON.stringify(babelrc, null, 2))
}

function kompodeService (args) {
  try {
    fs.readdirSync(servicePath)
  } catch (err) {
    console.log(err)
    throw new Error('Error: cannot find services directory')
  }
  createService(args[0])
  connectServiceRoute(args[0])
  addAlias(args[0])
}

module.exports = kompodeService
