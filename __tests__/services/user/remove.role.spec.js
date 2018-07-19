/*
  global describe: true
  global it: true
  global expect: true
  global setUp: true
  global request: true
  global beforeEach: true
  global authorization: true
  global regular: true
  global admin: true
  global afterEach: true
  global tearDown: true
  global candidate: true
*/

describe('User [PUT] /api/v1/user/:user_id/remove_role', () => {
  beforeEach(done => {
    setUp()
      .then(() => {
        request
          .put(`/api/v1/user/${regular.id}/add_role`)
          .set('Authorization', authorization)
          .send({ role: 'admin' })
          .expect(200)
          .end((err, res) => {
            if (err) console.log(err)
            expect(res.body.status.message).to.equal('success')
            expect(res.body.status.code).to.equal(200)
            done()
          })
      })
  })

  afterEach(done => {
    tearDown().then(() => done())
  })

  it('should only allow admin users remove roles of other users', done => {
    let data = { user: regular.id }
    request
      .put(`/api/v1/user/:user_id/remove_role`)
      .send(data)
      .expect(403)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(403)
        done(err)
      })
  })

  it('should require role field in request body', done => {
    request
      .put(`/api/v1/user/:user_id/remove_role`)
      .set('Authorization', authorization)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('User Error: Missing required parameter role')
        done(err)
      })
  })

  it('should return 404 if target user is not found', done => {
    let data = { role: 'politician' }
    request
      .put(`/api/v1/user/8ddc07e1-01f7-4cc8-b3cd-611b915ec8d4/remove_role`)
      .set('Authorization', authorization)
      .send(data)
      .expect(404)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(404)
        expect(res.body.error.message).to.equal('User not found')
        done(err)
      })
  })

  it('should return 404 error if target user is not a valid uuid', done => {
    let data = { role: 'politician' }
    request
      .put(`/api/v1/user/:user_id/remove_role`)
      .set('Authorization', authorization)
      .send(data)
      .expect(404)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(404)
        expect(res.body.error.message).to.equal('User not found')
        done(err)
      })
  })

  it('should return 404 error if role to remove is not found', done => {
    let data = { role: 'politian' }
    request
      .put(`/api/v1/user/${candidate.id}/remove_role`)
      .set('Authorization', authorization)
      .send(data)
      .expect(404)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(404)
        expect(res.body.error.message).to.equal('Role "politian" not found')
        done(err)
      })
  })

  it('should return 400 error if trying to remove own role', done => {
    let data = { role: 'admin' }
    request
      .put(`/api/v1/user/${admin.id}/remove_role`)
      .set('Authorization', authorization)
      .send(data)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Cannot remove your own role')
        done(err)
      })
  })

  it('should not allow admin remove roles of other admin account', done => {
    let data = { role: 'admin' }
    request
      .put(`/api/v1/user/${regular.id}/remove_role`)
      .set('Authorization', authorization)
      .send(data)
      .expect(403)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(403)
        expect(res.body.error.message).to.equal('Cannot remove this user\'s role')
        done(err)
      })
  })

  it('should return 400 error if target user does not have role', done => {
    let data = { role: 'admin' }
    request
      .put(`/api/v1/user/${candidate.id}/remove_role`)
      .set('Authorization', authorization)
      .send(data)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('User does not have this role')
        done(err)
      })
  })
})
