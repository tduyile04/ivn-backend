/*
  global describe: true
  global beforeEach: true
  global it: true
  global expect: true
  global setUp: true
  global authorization: true
  global admin: true
*/

import httpMocks from 'node-mocks-http'
import allow from '_middlewares/allow'

let req = {}
let res = {}

describe('Allow middleware', () => {
  beforeEach(done => {
    setUp()
      .then(() => {
        req = httpMocks.createRequest({
          method: 'GET',
          url: '/api/v1/path',
          query: {
            user: '1234'
          }
        })
        res = httpMocks.createResponse()
        return done()
      })
  })

  describe('Auth', () => {
    it('should not allow an unauthenticated user through the endpoint', done => {
      allow('auth')(req, res, () => null)
      let response = JSON.parse(res._getData())
      expect(response.status.code).to.equal(403)
      expect(response.status.message).to.equal('failed')
      expect(response.error.message).to.equal('Unauthorized! You cannot access this resource')
      done()
    })
    it('should allow an authenticated user through the endpoint', done => {
      req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/v1/path',
        headers: {
          authorization
        }
      })
      let called = false
      allow('auth')(req, res, () => {
        called = true
        expect(called).to.equal(true)
        return done()
      })
    })
  })

  describe('Admin', () => {
    it('should not allow a regular user through the endpoint', done => {
      req.auth = admin
      allow('admin')(req, res, () => null)
      let response = JSON.parse(res._getData())
      expect(response.status.code).to.equal(403)
      expect(response.status.message).to.equal('failed')
      expect(response.error.message).to.equal('Unauthorized! You cannot access this resource')
      done()
    })
    it('should allow an admin user through the endpoint', done => {
      req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/v1/path',
        headers: {
          authorization
        }
      })
      allow('auth')(req, res, () => {
        return allow('admin')(req, res, () => {
          expect(req.admin).to.exist // eslint-disable-line
          done()
        })
      })
    })
  })

  describe('Candidate', () => {
    it('should not allow non-candidate user through the endpoint', done => {
      req.auth = admin
      allow('admin')(req, res, () => null)
      let response = JSON.parse(res._getData())
      expect(response.status.code).to.equal(403)
      expect(response.status.message).to.equal('failed')
      expect(response.error.message).to.equal('Unauthorized! You cannot access this resource')
      done()
    })
    it('should allow an admin user through the endpoint', done => {
      req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/v1/path',
        headers: {
          authorization
        }
      })
      allow('auth')(req, res, () => {
        return allow('candidate')(req, res, () => {
          expect(req.candidate).to.exist // eslint-disable-line
          done()
        })
      })
    })
  })

  describe('Politician', () => {
    it('should not allow non-politician user through the endpoint', done => {
      req.auth = admin
      allow('admin')(req, res, () => null)
      let response = JSON.parse(res._getData())
      expect(response.status.code).to.equal(403)
      expect(response.status.message).to.equal('failed')
      expect(response.error.message).to.equal('Unauthorized! You cannot access this resource')
      done()
    })
    it('should allow an admin user through the endpoint', done => {
      req = httpMocks.createRequest({
        method: 'GET',
        url: '/api/v1/path',
        headers: {
          authorization
        }
      })
      allow('auth')(req, res, () => {
        return allow('politician')(req, res, () => {
          expect(req.politician).to.exist // eslint-disable-line
          done()
        })
      })
    })
  })
})
