const { composeMigration } = require('./util')

exports.up = composeMigration(knex =>
  knex.schema
    .createTable('question_like', function (table) {
      table.uuid('id').unique().primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.uuid('user_id').references('id').inTable('user').onDelete('SET NULL')
      table.uuid('question_id').references('id').inTable('question').onDelete('SET NULL')
      table.timestamps(true, true)
    }),
__filename
)

exports.down = composeMigration(knex => knex.schema.dropTableIfExists('question_like'), __filename)
