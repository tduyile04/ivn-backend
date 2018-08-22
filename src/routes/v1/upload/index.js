import composeRouter from 'lib/compose/router'
import { routes } from '@upload/routes'

export default router => composeRouter(routes, router)
