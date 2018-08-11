import fourOhFour from 'lib/error/fourOhFour'
import party from './party'
import user from './user'
import question from './question'
import answer from './answer'
import upload from './upload'
import comment from './comment'
import post from './post'

const BASE = '/api/v1'

export default (app, router) => {
  user(router)
  post(router)
  party(router)
  answer(router)
  upload(router)
  comment(router)
  question(router)
  app.use(BASE, router)
  app.use('*', fourOhFour)
}
