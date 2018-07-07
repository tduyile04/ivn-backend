import composeRouter from 'lib/compose/router'
import { routes } from '@party/routes'

export default router => composeRouter(routes, router)
