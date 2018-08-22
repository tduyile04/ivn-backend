"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var composeAppRoute = function composeAppRoute(routes, Controller) {
  return routes.map(function (route) {
    route[route.length - 1] = Controller[route[route.length - 1]];
    return route;
  });
};

exports.default = composeAppRoute;