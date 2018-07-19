/*
  global describe: true
  global it: true
  global expect: true
  global setUp: true
  global request: true
  global beforeEach: true
  global regularAuthorization: true
  global regular: true
  global admin: true
  global afterEach: true
  global tearDown: true
  global candidate: true
*/

describe('User [PUT] /api/v1/users/endorse', () => {
  beforeEach(done => {
    setUp()
      .then(() => {
        request
          .put(`/api/v1/users/endorse`)
          .set('Authorization', regularAuthorization)
          .send({ user: candidate.id })
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

  it('should not allow unauthenticated users endorse candidates', done => {
    let data = { user: regular.id }
    request
      .put(`/api/v1/users/endorse`)
      .send(data)
      .expect(403)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(403)
        done(err)
      })
  })

  it('should not allow users endorse already endorsed candidates', done => {
    request
      .put(`/api/v1/users/endorse`)
      .set('Authorization', regularAuthorization)
      .send({ user: candidate.id })
      .expect(409)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(409)
        expect(res.body.error.message).to.equal('Already endorsed this candidate')
        done(err)
      })
  })

  it('should require user id in request body', done => {
    let data = { ue: admin.id }
    request
      .put(`/api/v1/users/endorse`)
      .set('Authorization', regularAuthorization)
      .send(data)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('User Error: Illegal parameter "ue" provided')
        done(err)
      })
  })

  it('should return 404 if user to endorse is not found', done => {
    let data = { user: '8ddc07e1-01f7-4cc8-b3cd-611b915ec8d4' }
    request
      .put(`/api/v1/users/endorse`)
      .set('Authorization', regularAuthorization)
      .send(data)
      .expect(404)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(404)
        expect(res.body.error.message).to.equal('Candidate not found')
        done(err)
      })
  })

  it('should return 404 if user to endorse is not a candidate', done => {
    let data = { user: admin.id }
    request
      .put(`/api/v1/users/endorse`)
      .set('Authorization', regularAuthorization)
      .send(data)
      .expect(404)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(404)
        expect(res.body.error.message).to.equal('Candidate not found')
        done(err)
      })
  })

  it('should return 404 error if user to endorse is not a valid uuid', done => {
    let data = { user: '8ddc07e1-01f7-4cc8-b3cd611b915ec8d4' }
    request
      .put(`/api/v1/users/endorse`)
      .set('Authorization', regularAuthorization)
      .send(data)
      .expect(404)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(404)
        expect(res.body.error.message).to.equal('Candidate not found')
        done(err)
      })
  })

  it('should return 400 error if trying to endorse self', done => {
    let data = { user: regular.id }
    request
      .put(`/api/v1/users/endorse`)
      .set('Authorization', regularAuthorization)
      .send(data)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Cannot endorse yourself')
        done(err)
      })
  })
})
