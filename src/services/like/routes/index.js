import Like from '@like/controllers'
import composeAppRoute from 'lib/compose/app-route'
import allow from '_middlewares/allow'

export const routes = composeAppRoute(
  [
    ['post', '/likes', allow('auth'), 'create']
  ],
  new Like()
)
