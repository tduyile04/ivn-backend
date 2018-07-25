const path = require('path')
const { initFiles, generateUser } = require('./util')

exports.seed = function (knex, Promise) {
  if (process.env.NODE_ENV !== 'test') return null
  const filename = `${path.resolve(__dirname, './super-admins')}/${new Date().toISOString().split('T')[0]}.${process.env.NODE_ENV}`
  initFiles(filename)

  const superAdmin = generateUser(filename)
  // Inserts seed entries
  return process.env.NODE_ENV === 'test'
    ? knex('user')
      .insert(superAdmin)
      .then(() => {
        return Promise.all([
          knex('user').where({ email: superAdmin.email }).select('id'),
          knex('role').where({ name: 'super admin' }).select('id')
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
    : null
}
