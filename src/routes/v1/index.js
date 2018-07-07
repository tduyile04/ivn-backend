import fourOhFour from 'lib/error/fourOhFour'
import party from './party'

const BASE = '/api/v1'

export default (app, router) => {
  party(router)
  app.use(BASE, router)
  app.use('*', fourOhFour)
}
