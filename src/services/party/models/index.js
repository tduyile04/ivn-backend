export default connectionString =>
  require('knex')({
    client: 'pg',
    connection: connectionString,
    searchPath: ['knex', 'public']
  })
