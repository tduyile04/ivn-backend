const { composeMigration } = require('./util')

exports.up = composeMigration(knex =>
  knex.schema
    .createTable('poll_voter', function (table) {
      table.uuid('id').unique().primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.uuid('user_id').references('id').inTable('user').onDelete('CASCADE')
      table.uuid('poll_id').references('id').inTable('poll').onDelete('CASCADE')
      table.uuid('poll_candidate_id').references('id').inTable('poll_candidate').onDelete('CASCADE')
      table.uuid('candidate_id').references('id').inTable('user').onDelete('CASCADE')
      table.timestamps(true, true)
    }),
__filename
)

exports.down = composeMigration(knex => knex.schema.dropTableIfExists('poll_voter'), __filename)
