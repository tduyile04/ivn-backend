const { composeMigration } = require('./util')

exports.up = composeMigration(knex =>
  knex.schema
    .createTable('post_comment', function (table) {
      table.uuid('id').unique().primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('comment')
      table.uuid('user_id').references('id').inTable('user').onDelete('SET NULL')
      table.uuid('post_id').references('id').inTable('post').onDelete('SET NULL')
      table.timestamps(true, true)
    }),
__filename
)

exports.down = composeMigration(knex => knex.schema.dropTableIfExists('post_comment'), __filename)
