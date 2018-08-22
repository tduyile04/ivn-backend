const { composeMigration } = require('./util')

exports.up = composeMigration(knex =>
  knex.schema
    .createTable('poll', function (table) {
      table.uuid('id').unique().primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('name')
      table.string('level')
      table.uuid('winner').references('id').inTable('user').onDelete('SET NULL')
      table.string('country')
      table.string('state')
      table.string('local_government')
      table.boolean('is_active').defaultTo(true)
      table.timestamps(true, true)
    }),
__filename
)

exports.down = composeMigration(knex => knex.schema.dropTableIfExists('poll'), __filename)
