'use strict';

function allow(role) {
  switch (role) {
    case 'auth':
      return require('./auth');
    case 'admin':
      return require('./admin');
    // case 'owner':
    //   return require('./owner')
    case 'candidate':
      return require('./candidate');
    case 'politician':
      return require('./politician');
    default:
      return all;
  }
}

function all(req, res, next) {
  return next();
}

module.exports = allow;