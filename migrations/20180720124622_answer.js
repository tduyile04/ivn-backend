const { composeMigration } = require('./util')

exports.up = composeMigration(knex =>
  knex.schema
    .createTable('answer', function (table) {
      table.uuid('id').unique().primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('answer')
      table.uuid('candidate_id').references('id').inTable('user').onDelete('SET NULL')
      table.uuid('question_id').references('id').inTable('question').onDelete('SET NULL')
      table.timestamps(true, true)
    }),
__filename
)

exports.down = composeMigration(knex => knex.schema.dropTableIfExists('answer'), __filename)
