
exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('role').del()
    .then(function () {
      // Inserts seed entries
      return knex('role').insert([
        { name: 'admin' },
        { name: 'regular' },
        { name: 'candidate' },
        { name: 'politician' },
        { name: 'super admin' }
      ])
    })
}
