import composeRouter from 'lib/compose/router'
import { routes } from '@post/routes'

export default router => composeRouter(routes, router)
