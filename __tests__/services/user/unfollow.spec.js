/*
  global describe: true
  global it: true
  global expect: true
  global setUp: true
  global request: true
  global beforeEach: true
  global regularAuthorization: true
  global regular: true
  global afterEach: true
  global tearDown: true
  global candidate: true
  global admin: true
*/

describe('User [DELETE] /api/v1/users/unfollow', () => {
  beforeEach(done => {
    setUp()
      .then(() => {
        request
          .put(`/api/v1/users/follow`)
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

  it('should only allow authenticated users unfollow other users', done => {
    let data = { user: regular.id }
    request
      .delete(`/api/v1/users/unfollow`)
      .send(data)
      .expect(403)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(403)
        done(err)
      })
  })

  it('should allow authenticated users unfollow other users', done => {
    let data = { user: candidate.id }
    request
      .delete(`/api/v1/users/unfollow`)
      .set('Authorization', regularAuthorization)
      .send(data)
      .expect(200)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.data.message).to.equal('Successfully unfollowed user')
        done(err)
      })
  })

  it('should not allow unfollow users that do not exist', done => {
    let data = { user: '0ac95e15-c9f6-42f1-89c4-fd217f3a6375' }
    request
      .delete(`/api/v1/users/unfollow`)
      .set('Authorization', regularAuthorization)
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

  it('should not allow unfollow of invalid uuid', done => {
    let data = { user: '0ac95e15c9f6-42f1-89c4-fd217f3a6375' }
    request
      .delete(`/api/v1/users/unfollow`)
      .set('Authorization', regularAuthorization)
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

  it('should only unfollow users that are followed', done => {
    let data = { user: admin.id }
    request
      .delete(`/api/v1/users/unfollow`)
      .set('Authorization', regularAuthorization)
      .send(data)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('User is not followed')
        done(err)
      })
  })

  it('should validate request body "user" param', done => {
    let data = { uer: candidate.id }
    request
      .delete(`/api/v1/users/unfollow`)
      .set('Authorization', regularAuthorization)
      .send(data)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('User Error: Illegal parameter "uer" provided')
        done(err)
      })
  })

  it('should not allow unfollow of self', done => {
    let data = { user: regular.id }
    request
      .delete(`/api/v1/users/unfollow`)
      .set('Authorization', regularAuthorization)
      .send(data)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        console.log(res.body)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Cannot unfollow yourself')
        done(err)
      })
  })
})
