import fourOhFour from 'lib/error/fourOhFour'
import party from './party'
import user from './user'

const BASE = '/api/v1'

export default (app, router) => {
  party(router)
  user(router)
  app.use(BASE, router)
  app.use('*', fourOhFour)
}
