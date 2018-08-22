const kompodeService = require('./service')

const kompodeArgs = ['service', 'route', 'test', 'controller']

function isKompodeArg (arg) {
  return kompodeArgs.includes(arg)
}

(function () {
  if (!isKompodeArg(process.argv[2])) {
    throw new Error(`${process.argv[2]} is not a valid argument`)
  }
  process.argv[2] === 'service' && kompodeService(process.argv.slice(3))
  console.log(`Kompoding ${process.argv[2]}`)
  process.exit(0)
})()
