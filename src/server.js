// import 'module-alias'
import express from 'express'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import http from 'http'

import logger from 'lib/logger'
import * as routes from './routes'

const { PORT = 10999, NODE_ENV = 'development' } = process.env

const app = express()

const server = http.createServer(app)

const router = express.Router()

let io = require('./config/socket')(server)

let socketIO = [{}, {}]
let socketUsers = {}

io.on('connection', function (socket) {
  console.log(socket.handshake.user.email, ' connected with ID', socket.id)

  socketUsers[socket.handshake.user.email] = socket.id
  socketIO[0][socket.handshake.user.email] = socket
  socketIO[1] = socketUsers

  socket.on('disconnect', function () {
    console.log(socket.handshake.user.email, 'with', socket.id, ' has diconnected')
  })
})

app.use(helmet())
app.use(bodyParser.json({ limit: '10mb' }))
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb', parameterLimit: 1000000 }))
app.use((req, res, next) => {
  console.log(socketIO)
  req.socket = socketIO
  next()
})
// app.use(logger)

routes.v1(app, router)

if (NODE_ENV !== 'test') {
  server.listen(PORT, () => logger.log(`server started on PORT:${PORT} 🚀\n----------------------------------------------`))
}

export default app
