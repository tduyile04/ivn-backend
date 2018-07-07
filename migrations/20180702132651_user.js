const { composeMigration } = require('./util')

exports.up = composeMigration(knex =>
  knex.schema
    .createTable('user', function (table) {
      table.uuid('id').unique().primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('email').unique().notNullable()
      table.boolean('is_active').defaultTo(false)
      table.string('social_provider')
      table.text('bio')
      table.string('password')
      table.date('date_of_birth')
      table.string('phone_number')
      table.boolean('is_registered')
      table.string('state')
      table.string('country')
      table.string('local_government')
      table.enum('gender', ['male', 'female', 'non-binary', 'other'])
      table.timestamps(true, true)
    }),
__filename
)

exports.down = composeMigration(knex => knex.schema.dropTableIfExists('user'), __filename)
