const { composeMigration } = require('./util')

exports.up = composeMigration(knex =>
  knex.schema
    .createTable('work_experience', function (table) {
      table.uuid('id').unique().primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.uuid('user_id').references('id').inTable('user').onDelete('CASCADE')
      table.date('from')
      table.date('to')
      table.string('office')
      table.text('description')
      table.string('title')
    }),
__filename
)

exports.down = composeMigration(knex => knex.schema.dropTableIfExists('work_experience'), __filename)
