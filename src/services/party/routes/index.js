import Party from '@party/controllers'
import composeAppRoute from 'lib/compose/app-route'
import allow from '_middlewares/allow'

export const routes = composeAppRoute(
  [
    ['get', '/parties', allow('auth'), 'all'],
    ['post', '/parties', allow('auth'), allow('admin'), 'create'],
    ['get', '/party/:party_id', allow('auth'), 'one'],
    ['put', '/party/:party_id', allow('auth'), allow('admin'), 'update'],
    ['delete', '/party/:party_id', allow('auth'), allow('admin'), 'remove'],
    // ['post', '/party/:party_id/follow', allow('auth'), 'follow'],
    // ['delete', '/party/:party_id/unfollow', allow('auth'), 'unfollow']
  ],
  new Party()
)
