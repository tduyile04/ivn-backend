
import composeRouter from 'lib/compose/router'
import { routes } from '@poll/routes'

export default router => composeRouter(routes, router)
