import Post from '@post/controllers'
import composeAppRoute from 'lib/compose/app-route'
import allow from '_middlewares/allow'

export const routes = composeAppRoute(
  [
    ['get', '/posts', allow('auth'), 'all'],
    ['post', '/posts', allow('auth'), 'create'],
    ['get', '/post/:post_id', allow('auth'), 'one'],
    ['delete', '/post/:post_id', allow('auth'), 'remove'],
    ['put', '/post/:post_id/like', allow('auth'), 'like'],
    ['post', '/post/:post_id/comment', allow('auth'), 'comment'],
    ['post', '/post/:post_id/remove_comment', allow('auth'), 'removeComment']
  ],
  new Post()
)
