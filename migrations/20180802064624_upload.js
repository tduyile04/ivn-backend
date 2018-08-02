const { composeMigration } = require('./util')

exports.up = composeMigration(knex =>
  knex.schema
    .createTable('upload', function (table) {
      table.uuid('id').unique().primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('filename')
      table.string('filetype')
      table.string('comment')
      table.string('url')
      table.uuid('user_id').notNullable().references('id').inTable('user').onDelete('CASCADE')
      table.timestamps(true, true)
    }),
__filename
)

exports.down = composeMigration(knex => knex.schema.dropTableIfExists('upload'), __filename)
