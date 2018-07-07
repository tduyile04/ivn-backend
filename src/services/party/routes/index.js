import Party from '@party/controllers'
import composeAppRoute from 'lib/compose/app-route'
import allow from '_middlewares/allow'

export const routes = composeAppRoute(
  [
    ['get', '/parties', allow('auth'), 'all'],
    ['post', '/parties', allow('auth'), allow('admin'), 'create']
  ],
  new Party()
)
