const jwt = require('jsonwebtoken')

module.exports = function (server) {
  const io = require('socket.io')(server)
  console.log('here o')
  io.use((socket, next) => {
    console.log('here too')
    let token = socket.handshake.query.token
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
      console.log(decoded)
      socket.handshake.user = decoded
      return next()
    } catch (error) {
      return next(new Error('authentication error'))
    }
  })

  return io
}
