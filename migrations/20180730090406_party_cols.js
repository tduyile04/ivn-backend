const { composeMigration } = require('./util')

exports.up = composeMigration(knex =>
  knex.schema
    .table('party', function (table) {
      table.text('manifesto')
      table.string('slogan')
      table.string('motto')
      table.text('about')
    }),
__filename
)

exports.down = composeMigration(knex => {
  return knex.schema.table('party', function (table) {
    table.dropColumn('manifesto')
    table.dropColumn('slogan')
    table.dropColumn('motto')
    table.dropColumn('about')
  })
}, __filename)
