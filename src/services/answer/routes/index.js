import Answer from '@answer/controllers'
import composeAppRoute from 'lib/compose/app-route'
import allow from '_middlewares/allow'

export const routes = composeAppRoute(
  [
    ['post', '/answers', allow('auth'), 'create']
  ],
  new Answer()
)
