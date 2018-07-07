const routeHandler = (routes, router) => {
  const routeIterator = routes.entries()
  for (let route of routeIterator) {
    router[route[1][0]](route[1][1], ...route[1].slice(2))
  }
}

export default routeHandler
