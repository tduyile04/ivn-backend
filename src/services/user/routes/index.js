import User from '@user/controllers'
import composeAppRoute from 'lib/compose/app-route'
import allow from '_middlewares/allow'

export const routes = composeAppRoute(
  [
    ['put', '/users/follow', allow('auth'), 'follow']
  ],
  new User()
)
