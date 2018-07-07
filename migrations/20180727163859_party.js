const { composeMigration } = require('./util')

exports.up = composeMigration(knex =>
  knex.schema
    .createTable('party', function (table) {
      table.uuid('id').unique().primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('name').unique().notNullable()
      table.string('bio')
      table.string('avatar').defaultTo('default.jpg')
      table.uuid('created_by').references('id').inTable('user').onDelete('SET NULL')
      table.timestamps(true, true)
    }),
__filename
)

exports.down = composeMigration(knex => knex.schema.dropTableIfExists('party'), __filename)
