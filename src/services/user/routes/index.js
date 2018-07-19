import User from '@user/controllers'
import composeAppRoute from 'lib/compose/app-route'
import allow from '_middlewares/allow'

export const routes = composeAppRoute(
  [
    ['get', '/users', allow('auth'), 'all'],
    ['post', '/users', 'create'],
    ['post', '/users/login', 'login'],
    ['put', '/users/follow', allow('auth'), 'follow'],
    ['put', '/users/endorse', allow('auth'), 'endorse'],
    ['delete', '/users/unfollow', allow('auth'), 'unfollow'],
    ['get', '/user/:user_id', allow('auth'), 'one'],
    ['put', '/user/:user_id', allow('auth'), 'update'],
    ['delete', '/user/:user_id', allow('auth'), 'deactivate'],
    ['put', '/user/:user_id/add_role', allow('auth'), allow('admin'), 'addRole'],
    ['put', '/user/:user_id/remove_role', allow('auth'), allow('admin'), 'removeRole']
  ],
  new User()
)
