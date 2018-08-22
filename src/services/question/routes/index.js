import Question from '@question/controllers'
import composeAppRoute from 'lib/compose/app-route'
import allow from '_middlewares/allow'

export const routes = composeAppRoute(
  [
    ['get', '/questions', allow('auth'), 'all'],
    ['post', '/questions', allow('auth'), 'create'],
    ['get', '/question/:question_id', allow('auth'), 'one'],
    ['post', '/question/:question_id/like', allow('auth'), 'like']
  ],
  new Question()
)
