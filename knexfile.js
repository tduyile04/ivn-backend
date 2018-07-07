require('dotenv').config()

module.exports = {
  [process.env.NODE_ENV]: {
    client: process.env.DB_CLIENT || 'pg',
    connection: {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}
