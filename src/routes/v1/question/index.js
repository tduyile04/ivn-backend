import composeRouter from 'lib/compose/router'
import { routes } from '@question/routes'

export default router => composeRouter(routes, router)
