const { composeMigration } = require('./util')

exports.up = composeMigration(knex =>
  knex.schema
    .createTable('user', function (table) {
      table.uuid('id').unique().primary().defaultTo(knex.raw('uuid_generate_v4()'))
      table.string('firstName').notNullable()
      table.string('lastName').notNullable()
      table.string('email').unique().notNullable()
      table.boolean('isActive').defaultTo(false)
      table.string('socialProvider')
      table.text('bio')
      table.string('password')
      table.date('dateOfBirth')
      table.string('phoneNumber')
      table.boolean('isRegistered')
      table.string('state')
      table.string('country')
      table.string('localGovernment')
      table.string('avatar')
      table.enum('gender', ['male', 'female', 'non-binary', 'other'])
      table.timestamps(true, true)
    }),
__filename
)

exports.down = composeMigration(knex => knex.schema.dropTableIfExists('user'), __filename)
