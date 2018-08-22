const { composeMigration } = require('./util')

exports.up = composeMigration(knex =>
  knex.schema
    .createTable('party_member', function (table) {
      table.uuid('id').unique().primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.uuid('party_id').notNullable().references('id').inTable('party').onDelete('CASCADE')
      table.uuid('user_id').notNullable().references('id').inTable('user').onDelete('CASCADE')
      table.timestamps(true, true)
    }),
__filename
)

exports.down = composeMigration(knex => knex.schema.dropTableIfExists('party_member'), __filename)
