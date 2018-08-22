"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (data, page, limit) {
  var offset = Number(page - 1) * Number(limit);
  var metadata = {
    total: data.length,
    perPage: limit,
    totalPage: Math.ceil(data.length / limit),
    page: page
  };
  return { data: data.slice(offset, offset + limit), metadata: metadata };
};