import composeRouter from 'lib/compose/router'
import { routes } from '@user/routes'

export default router => composeRouter(routes, router)
