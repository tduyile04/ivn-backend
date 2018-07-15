exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries

  return knex('user_role').del()
    .then(function () {
      return Promise.all([
        knex('user').select(['id', 'email']),
        knex('role').select(['id', 'name'])
      ])
        .then(([users, roles]) => {
          return new Promise((resolve, reject) => {
            users.forEach((user, index) => {
              roles.forEach(role => {
                return ['candidate'].indexOf(role.name) === -1 &&
                  knex('user_role')
                    .insert({
                      user_id: user.id,
                      role_id: role.id
                    })
                    .then(response => {
                      if (index === users.length - 1) {
                        return resolve(response)
                      }
                      return response
                    })
                    .catch(error => reject(error))
              })
            })
          })
        })
      // Inserts seed entries
    })
}
