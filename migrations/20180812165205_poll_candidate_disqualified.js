const { composeMigration } = require('./util')

exports.up = composeMigration(knex =>
  knex.schema
    .createTable('poll_candidate_disqualified', function (table) {
      table.uuid('id').unique().primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.uuid('candidate_id').references('id').inTable('user').onDelete('CASCADE')
      table.uuid('poll_id').references('id').inTable('poll').onDelete('CASCADE')
      table.text('reason')
    }),
__filename
)

exports.down = composeMigration(knex => knex.schema.dropTableIfExists('poll_candidate_disqualified'), __filename)
