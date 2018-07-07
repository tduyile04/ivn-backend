const composeAppRoute = (routes, Controller) => {
  return routes.map(route => {
    route[route.length - 1] = Controller[route[route.length - 1]]
    return route
  })
}

export default composeAppRoute
