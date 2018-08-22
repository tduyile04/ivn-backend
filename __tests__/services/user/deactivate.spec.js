/*
  global describe: true
  global it: true
  global expect: true
  global setUp: true
  global authorization: true
  global request: true
  global beforeEach: true
  global regularAuthorization: true
  global afterEach: true
  global tearDown: true
  global faker: true
*/

describe('Party [DELETE] /party/:id', () => {
  const user = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    phoneNumber: faker.phone.phoneNumber(),
    dateOfBirth: faker.date.past(),
    state: 'Lagos',
    country: 'Nigeria',
    localGovernment: 'Mende',
    gender: 'male',
    password: 'password1'
  }
  let token = null
  beforeEach(done => {
    setUp().then(() => {
      if (user.id) {
        delete user.id
      }
      request
        .post('/api/v1/users')
        .send(user)
        .expect(201)
        .end((err, res) => {
          user.id = res.body.data.user.id
          token = res.body.data.user.token
          done(err)
        })
    })
  })

  afterEach(done => {
    tearDown().then(() => done())
  })

  it('should not allow non-admin to delete user', done => {
    request
      .delete(`/api/v1/user/${user.id}`)
      .set('Authorization', regularAuthorization)
      .expect(403)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        done(err)
      })
  })

  it('should not allow admin to delete user that does not exist', done => {
    request
      .delete('/api/v1/user/5503d632-c064-4431-af05-345f7b2197a5')
      .set('Authorization', authorization)
      .expect(404)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        done(err)
      })
  })

  it('should not allow admin to delete user with invalid id', done => {
    request
      .delete('/api/v1/user/5503d632-c064-4431-af05-345f7b2197')
      .set('Authorization', authorization)
      .expect(404)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.error.message).to.equal('User not found')
        done(err)
      })
  })

  it('should allow admin to delete user', done => {
    request
      .delete(`/api/v1/user/${user.id}`)
      .set('Authorization', authorization)
      .expect(204)
      .end((err, res) => {
        if (err) console.log(err)
        done(err)
      })
  })

  it('should allow user delete their own account', done => {
    request
      .delete(`/api/v1/user/${user.id}`)
      .set('Authorization', token)
      .expect(204)
      .end((err, res) => {
        if (err) console.log(err)
        done(err)
      })
  })
})
