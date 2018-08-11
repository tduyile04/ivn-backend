/*
  global describe: true
  global it: true
  global expect: true
  global request: true
  global beforeEach: true
  global regularAuthorization: true
  global setUp: true
*/

describe('User [GET] /user/:user_id', () => {
  beforeEach(done => {
    setUp().then(() => done())
  })

  it('should not allow unauthenticated users through', done => {
    request
      .get('/api/v1/users')
      .expect(403)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(403)
        done(err)
      })
  })

  it('should return all users', done => {
    request
      .get('/api/v1/users')
      .set('Authorization', regularAuthorization)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(200)
        expect(res.body.data.users.length).to.equal(5)
        done(err)
      })
  })
  it('should return a list of paginated users', done => {
    request
      .get('/api/v1/users/?limit=2&page=1')
      .set('Authorization', regularAuthorization)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(200)
        expect(res.body.data.users.length).to.equal(2)
        expect(res.body.metadata.total).to.equal(5)
        expect(res.body.metadata.page).to.equal(1)
        expect(res.body.metadata.totalPage).to.equal(3)
        expect(res.body.metadata.perPage).to.equal(2)
        done(err)
      })
  })
  it('should return a list of paginated users', done => {
    request
      .get('/api/v1/users/?limit=10&page=1&roles=candidate,politician&state=lagos&country=nigeria')
      .set('Authorization', regularAuthorization)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(200)
        expect(res.body.data.users.length).to.equal(4)
        expect(res.body.metadata.total).to.equal(4)
        expect(res.body.metadata.page).to.equal(1)
        expect(res.body.metadata.totalPage).to.equal(1)
        expect(res.body.metadata.perPage).to.equal(10)
        done(err)
      })
  })
})
