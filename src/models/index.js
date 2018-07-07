import { Client } from 'pg'
import knex from 'knex'
const client = new Client(require('../../knexfile')[process.env.NODE_ENV].connection)
client.connect()
export const db = client

export default knex(require('../../knexfile')[process.env.NODE_ENV])
