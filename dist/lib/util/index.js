'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isAdmin = exports.isAdmin = function isAdmin(roles) {
  var filtered = roles.filter(function (r) {
    return r.name === 'admin' || r.name === 'super admin';
  });
  return filtered.length > 0;
};