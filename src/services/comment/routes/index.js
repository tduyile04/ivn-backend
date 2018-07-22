import Comment from '@comment/controllers'
import composeAppRoute from 'lib/compose/app-route'
import allow from '_middlewares/allow'

export const routes = composeAppRoute(
  [
    ['post', '/comments', allow('auth'), 'create']
  ],
  new Comment()
)
