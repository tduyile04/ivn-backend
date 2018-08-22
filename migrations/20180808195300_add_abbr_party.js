const { composeMigration } = require('./util')

exports.up = composeMigration(knex =>
  knex.schema
    .table('party', function (table) {
      table.string('abbr')
    }),
__filename
)

exports.down = composeMigration(knex => {
  return knex.schema.table('party', function (table) {
    table.dropColumn('abbr')
  })
}, __filename)
