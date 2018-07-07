const path = require('path')
const { initFiles, generateUser } = require('./util')

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries

  return knex('user').del()
    .then(function () {
      const filename = `${path.resolve(__dirname, './admins')}/${new Date().toISOString().split('T')[0]}.${process.env.NODE_ENV}`
      initFiles(filename)

      const adminUsers = [ generateUser(filename), generateUser(filename) ]
      // Inserts seed entries
      return knex('user').insert(adminUsers)
    })
}
