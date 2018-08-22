/*
  global describe: true
  global it: true
  global expect: true
  global setUp: true
  global request: true
  global beforeEach: true
  global afterEach: true
  global tearDown: true
  global faker: true
*/

describe('User [POST] /users/login', () => {
  let user = {
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
  beforeEach(done => {
    setUp().then(() => {
      request
        .post('/api/v1/users')
        .send(user)
        .expect(201)
        .end((err) => {
          done(err)
        })
    })
  })

  afterEach(done => {
    tearDown().then(() => done())
  })

  it('should not log in user with invalid email', done => {
    let login = { email: 'user.email', password: user.password }
    request
      .post('/api/v1/users/login')
      .send(login)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Email and password do not match')
        done(err)
      })
  })

  it('should not log in user with email that does not exist', done => {
    let login = { email: 'user@gmail.co', password: user.password }
    request
      .post('/api/v1/users/login')
      .send(login)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Email and password do not match')
        done(err)
      })
  })

  it('should not log in user with invalid password', done => {
    let login = { email: user.email, password: 'user' }
    request
      .post('/api/v1/users/login')
      .send(login)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Email and password do not match')
        done(err)
      })
  })

  it('should not log in user with wrong password', done => {
    let login = { email: user.email, password: 'userpassword' }
    request
      .post('/api/v1/users/login')
      .send(login)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Email and password do not match')
        done(err)
      })
  })

  it('should require email and password field', done => {
    let login = { email: user.email, password: user.password }
    let fields = ['email', 'password']
    fields.forEach((field, index) => {
      const newLogin = Object.assign({}, login)
      delete newLogin[field]
      request
        .post('/api/v1/users/login')
        .send(newLogin)
        .expect(400)
        .end((err, res) => {
          if (err) console.log(err)
          expect(res.body.status.message).to.equal('failed')
          expect(res.body.status.code).to.equal(400)
          expect(res.body.error.message).to.equal(`User Error: Missing required parameter ${field}`)
          index === 1 && done(err)
        })
    })
  })

  it('should log in user with valid credentials', done => {
    let login = { email: user.email, password: user.password }
    request
      .post('/api/v1/users/login')
      .send(login)
      .expect(200)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('success')
        expect(res.body.status.code).to.equal(200)
        expect(typeof res.body.data.user.token).to.equal('string')
        done(err)
      })
  })
})
