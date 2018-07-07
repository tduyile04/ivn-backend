const path = require('path')
const { initFiles, generateUser } = require('./util')

exports.seed = function (knex, Promise) {
  const filename = `${path.resolve(__dirname, './regulars')}/${new Date().toISOString().split('T')[0]}.${process.env.NODE_ENV}`
  initFiles(filename)

  const regular = generateUser(filename)
  // Inserts seed entries
  return knex('user')
    .insert(regular)
    .then(() => {
      return Promise.all([
        knex('user').where({ email: regular.email }).select('id'),
        knex('role').where({ name: 'regular' }).select('id')
      ])
        .then(([user, role]) => {
          return knex('user_role')
            .insert({ role_id: role[0].id, user_id: user[0].id })
            .then(res => res)
            .catch(error => { throw error })
        })
        .catch(error => { throw error })
    })
    .catch(error => { throw error })
}
