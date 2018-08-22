import composeRouter from 'lib/compose/router'
import { routes } from '@answer/routes'

export default router => composeRouter(routes, router)
