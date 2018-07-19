const { composeMigration } = require('./util')

exports.up = composeMigration(knex =>
  knex.schema
    .createTable('user_endorse', function (table) {
      table.uuid('id').unique().primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.uuid('candidate_id').notNullable().references('id').inTable('user').onDelete('CASCADE')
      table.uuid('endorser_id').notNullable().references('id').inTable('user').onDelete('CASCADE')
      table.timestamps(true, true)
    }),
__filename
)

exports.down = composeMigration(knex => knex.schema.dropTableIfExists('user_endorse'), __filename)
