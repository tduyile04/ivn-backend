const { composeMigration } = require('./util')

exports.up = composeMigration(knex =>
  knex.schema
    .createTable('notification', function (table) {
      table.uuid('id').unique().primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.uuid('owner_id').references('id').inTable('user').onDelete('CASCADE')
      table.uuid('sender_id').references('id').inTable('user').onDelete('CASCADE')
      table.text('note')
      table.boolean('active').defaultTo(true)
      table.string('context')
      table.timestamps(true, true)
    }),
__filename
)

exports.down = composeMigration(knex => knex.schema.dropTableIfExists('notification'), __filename)
