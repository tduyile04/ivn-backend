
import Service from '@poll/controllers'
import composeAppRoute from 'lib/compose/app-route'
import allow from '_middlewares/allow'

export const routes = composeAppRoute(
  [
    ['get', '/polls', allow('auth'), 'all'],
    ['post', '/polls', allow('auth'), allow('admin'), 'create'],
    ['get', '/poll/:poll_id', allow('auth'), 'one'],
    ['delete', '/poll/:poll_id', allow('auth'), allow('admin'), 'remove'],
    ['post', '/poll/:poll_id/add_candidate', allow('auth'), allow('admin'), 'addCandidate']
  ],
  new Service()
)
