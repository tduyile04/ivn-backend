/*
  global describe: true
  global it: true
  global expect: true
  global setUp: true
  global request: true
  global beforeEach: true
  global candidate: true
  global afterEach: true
  global tearDown: true
  global faker: true
  global authorization: true
  global regularAuthorization: true
*/

describe('User [PUT] /user/:user_id', () => {
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

  it('should not update if not authenticated', done => {
    request
      .put(`/api/v1/user/${user.id}`)
      .send({})
      .expect(403)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(403)
        done(err)
      })
  })
  it('should not update if email is invalid', done => {
    const newUser = { email: 'jj.com' }
    request
      .put(`/api/v1/user/${user.id}`)
      .set('authorization', token)
      .send(newUser)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Email is invalid')
        done(err)
      })
  })

  it('should not update if old passwords do not match', done => {
    const newUser = { password: 'whysorude', oldPassword: 'password' }
    request
      .put(`/api/v1/user/${user.id}`)
      .set('authorization', token)
      .send(newUser)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Old password is not correct')
        done(err)
      })
  })

  it('should not update if password is invalid', done => {
    const newUser = { password: 'jj.com', oldPassword: 'password1' }
    request
      .put(`/api/v1/user/${user.id}`)
      .set('authorization', token)
      .send(newUser)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Password must be at least 8 characters long')
        done(err)
      })
  })

  it('should not allow admin update password', done => {
    const newUser = { password: 'correctpasscode', oldPassword: 'password1' }
    request
      .put(`/api/v1/user/${user.id}`)
      .set('authorization', authorization)
      .send(newUser)
      .expect(403)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(403)
        expect(res.body.error.message).to.equal('Unauthorized! You cannot access this resource')
        done(err)
      })
  })

  it('should not allow other users update', done => {
    const newUser = { password: 'jj.com', oldPassword: 'password1' }
    request
      .put(`/api/v1/user/${user.id}`)
      .set('authorization', regularAuthorization)
      .send(newUser)
      .expect(403)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(403)
        done(err)
      })
  })

  it('should not update if date of birth is invalid', done => {
    const newUser = { dateOfBirth: 'jj.com' }
    request
      .put(`/api/v1/user/${user.id}`)
      .set('authorization', token)
      .send(newUser)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Date of Birth is invalid')
        done(err)
      })
  })

  it('should not update if gender is invalid', done => {
    const newUser = { gender: 'jj.com' }
    request
      .put(`/api/v1/user/${user.id}`)
      .set('authorization', token)
      .send(newUser)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Gender is invalid')
        done(err)
      })
  })

  it('should allow only admin update country', done => {
    const newUser = { country: 'jj.com' }
    request
      .put(`/api/v1/user/${user.id}`)
      .set('authorization', token)
      .send(newUser)
      .expect(403)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(403)
        expect(res.body.error.message).to.equal('Cannot update this information')
        done(err)
      })
  })

  it('should allow only admin update state', done => {
    const newUser = { state: 'jj.com' }
    request
      .put(`/api/v1/user/${user.id}`)
      .set('authorization', token)
      .send(newUser)
      .expect(403)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(403)
        expect(res.body.error.message).to.equal('Cannot update this information')
        done(err)
      })
  })

  it('should not update if country is invalid', done => {
    const newUser = { country: 'jj.com' }
    request
      .put(`/api/v1/user/${user.id}`)
      .set('authorization', authorization)
      .send(newUser)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Country is invalid')
        done(err)
      })
  })

  it('should not update if state is invalid', done => {
    const newUser = { state: 'jj.com' }
    request
      .put(`/api/v1/user/${user.id}`)
      .set('authorization', authorization)
      .send(newUser)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('State is invalid')
        done(err)
      })
  })

  it('should not update if firstName is too long', done => {
    const newUser = { firstName: 'ourlovewasmadeformoviescreenstakemybodytakemybody' }
    request
      .put(`/api/v1/user/${user.id}`)
      .set('authorization', token)
      .send(newUser)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('First name is too long')
        done(err)
      })
  })
  it('should not update if firstName has invalid chars', done => {
    const newUser = { firstName: 'Kodaline!' }
    request
      .put(`/api/v1/user/${user.id}`)
      .set('authorization', token)
      .send(newUser)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('First name is invalid')
        done(err)
      })
  })
  it('should not update if lastName has invalid chars', done => {
    const newUser = { lastName: 'Kodaline!' }
    request
      .put(`/api/v1/user/${user.id}`)
      .set('authorization', token)
      .send(newUser)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Last name is invalid')
        done(err)
      })
  })
  it('should not update if lastName is too long', done => {
    const newUser = { lastName: 'ourlovewasmadeformoviescreenstakemybodytakemybody' }
    request
      .put(`/api/v1/user/${user.id}`)
      .set('authorization', token)
      .send(newUser)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Last name is too long')
        done(err)
      })
  })
  it('should not update to an existing email', done => {
    const newUser = { email: candidate.email }
    request
      .put(`/api/v1/user/${user.id}`)
      .set('authorization', token)
      .send(newUser)
      .expect(409)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(409)
        expect(res.body.error.message).to.equal('Email is already in use')
        done(err)
      })
  })
  it('should update a user\'s firstName', done => {
    const newUser = { 'firstName': 'Collins' }
    request
      .put(`/api/v1/user/${user.id}`)
      .set('authorization', token)
      .send(newUser)
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.user.firstName).to.equal('Collins')
        done(err)
      })
  })
  it('should update a user\'s email', done => {
    const newUser = { email: 'collins.hay@gmail.com' }
    request
      .put(`/api/v1/user/${user.id}`)
      .set('authorization', token)
      .send(newUser)
      .expect(200)
      .end((err, res) => {
        expect(res.body.data.user.email).to.equal('collins.hay@gmail.com')
        done(err)
      })
  })

  it('should update country', done => {
    const newUser = { country: 'nigeria' }
    request
      .put(`/api/v1/user/${user.id}`)
      .set('authorization', authorization)
      .send(newUser)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('success')
        expect(res.body.status.code).to.equal(200)
        expect(res.body.data.user.country).to.equal('Nigeria')
        done(err)
      })
  })

  it('should update  state', done => {
    const newUser = { state: 'lagos' }
    request
      .put(`/api/v1/user/${user.id}`)
      .set('authorization', authorization)
      .send(newUser)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(200)
        expect(res.body.data.user.state).to.equal('Lagos')
        done(err)
      })
  })

  it('should update password', done => {
    const newUser = { password: 'justbeware', oldPassword: 'password1' }
    request
      .put(`/api/v1/user/${user.id}`)
      .set('authorization', token)
      .send(newUser)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(200)
        done(err)
      })
  })
  it('should update firstName and lastName', done => {
    const newUser = { firstName: 'Greg', lastName: 'Laswell' }
    request
      .put(`/api/v1/user/${user.id}`)
      .set('authorization', token)
      .send(newUser)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(200)
        expect(res.body.data.user.firstName).to.equal('Greg')
        expect(res.body.data.user.lastName).to.equal('Laswell')
        done(err)
      })
  })
})
