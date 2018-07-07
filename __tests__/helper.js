import supertest from 'supertest'
import chai from 'chai'
import sinon from 'sinon'
import jwt from 'jsonwebtoken'
import { Client } from 'pg'

import app from '../src/server'

const client = new Client(Object.assign(
  {},
  require('../knexfile').test.connection,
  {
    host: '127.0.0.1',
    port: 5432
  }
))

client.connect()

global.app = app
global.request = supertest(app)
global.expect = chai.expect
global.assert = chai.assert
global.jwt = jwt
global.tokenize = id => jwt.sign({ data: id }, process.env.TOKEN_SECRET)
global.sinon = sinon
global.admin = {}

global.db = client

global.authorization = null
global.regularAuthorization = null
global.superAuthorization = null
global.politicianAuthorization = null
global.candidateAuthorization = null

global.setUp = () => {
  return client.query('SELECT u.*, p.role_id, r.name as role_name FROM "user_role" p LEFT JOIN "user" u ON u.id = p.user_id LEFT JOIN "role" r ON r.id = p.role_id')
    .then(res => {
      const users = fmtUsers(res.rows)
      global.admin = getRole(users, 'admin')
      global.superAdmin = getRole(users, 'super admin')
      global.regular = getRegular(users)
      global.politician = getRole(users, 'politician')
      global.candidate = getRole(users, 'candidate')
      global.authorization = jwt.sign({ data: { id: global.admin.id } }, process.env.TOKEN_SECRET)
      global.superAuthorization = jwt.sign({ data: { id: global.superAdmin.id } }, process.env.TOKEN_SECRET)

      global.regularAuthorization = jwt.sign({ data: { id: global.regular.id } }, process.env.TOKEN_SECRET)
      global.politicianAuthorization = jwt.sign({ data: { id: global.politician.id } }, process.env.TOKEN_SECRET)
      global.candidateAuthorization = jwt.sign({ data: { id: global.candidate.id } }, process.env.TOKEN_SECRET)
    })
    .catch(error => console.error(error))
}

function fmtUsers (rows) {
  return rows.reduce((acc, user) => {
    if (acc[user.id]) {
      acc[user.id].roles.push(user.role_name)
    } else {
      acc[user.id] = user
      acc[user.id].roles = [user.role_name]
    }
    return acc
  }, {})
}

function getRole (users, role) {
  return Object
    .values(users)
    .filter(user => user.roles.indexOf(role) !== -1)[0]
}

function getRegular (users) {
  return Object
    .values(users)
    .filter(user => user.roles.length === 1 && user.roles[0] === 'regular')[0]
}
