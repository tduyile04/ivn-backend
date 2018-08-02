/*
  global describe: true
  global it: true
  global expect: true
  global request: true
  global beforeEach: true
  global regularAuthorization: true
  global setUp: true
  global admin: true
  global candidate: true
  global afterEach: true
  global tearDown: true
*/

describe('User [GET] /user/:user_id', () => {
  beforeEach(done => {
    setUp().then(() => {
      request
        .put(`/api/v1/users/follow`)
        .set('Authorization', regularAuthorization)
        .send({ user: candidate.id })
        .expect(200)
        .end((err, res) => {
          if (err) console.log(err)
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
  })

  afterEach(done => {
    tearDown().then(() => done())
  })

  it('should not allow unauthenticated users through', done => {
    request
      .get(`/api/v1/user/${admin.id}`)
      .expect(403)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(403)
        done(err)
      })
  })

  it('should return user information', done => {
    request
      .get(`/api/v1/user/${candidate.id}`)
      .set('Authorization', regularAuthorization)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(200)
        expect(res.body.data.user.firstName).to.equal(candidate.firstName)
        expect(res.body.data.user.lastName).to.equal(candidate.lastName)
        expect(res.body.data.user.email).to.equal(candidate.email)
        done(err)
      })
  })

  it('should return 404 if user does not exist', done => {
    request
      .get(`/api/v1/user/bc9c5db6-54a5-425c-9eb6-1c4fcfb61f43`)
      .set('Authorization', regularAuthorization)
      .expect(404)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(404)
        expect(res.body.status.message).to.equal('failed')
        done(err)
      })
  })

  it('should return 404 if user has invalid uuid', done => {
    request
      .get(`/api/v1/user/kckdmmkcdkmkcmkmdkmkcmdmkm`)
      .set('Authorization', regularAuthorization)
      .expect(404)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(404)
        expect(res.body.status.message).to.equal('failed')
        done(err)
      })
  })
})
