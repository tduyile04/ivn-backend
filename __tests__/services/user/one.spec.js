/*
  global describe: true
  global it: true
  global expect: true
  global request: true
  global beforeEach: true
  global regularAuthorization: true
  global setUp: true
  global admin: true
*/

describe('User [GET] /users', () => {
  beforeEach(done => {
    setUp().then(() => done())
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
      .get(`/api/v1/user/${admin.id}`)
      .set('Authorization', regularAuthorization)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(200)
        expect(res.body.data.user.firstName).to.equal(admin.firstName)
        expect(res.body.data.user.lastName).to.equal(admin.lastName)
        expect(res.body.data.user.email).to.equal(admin.email)
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
