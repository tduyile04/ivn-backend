/*
  global describe: true
  global it: true
  global expect: true
  global setUp: true
  global request: true
  global beforeEach: true
  global regular: true
  global afterEach: true
  global tearDown: true
  global faker: true
*/

describe('User [POST] /users', () => {
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
  beforeEach(done => {
    setUp().then(() => done())
  })

  afterEach(done => {
    tearDown().then(() => done())
  })

  it('should not signup if required body params are missing', done => {
    const requiredBody = ['firstName', 'lastName', 'email', 'password', 'country', 'state', 'localGovernment', 'gender']
    const otherBody = ['dateOfBirth', 'phoneNumber', 'bio']
    const empty = []
    const allBody = empty.concat(requiredBody).concat(otherBody)
    allBody.forEach((body, index) => {
      const newUser = Object.assign({}, user)
      if (newUser[body] && requiredBody.indexOf(body) !== -1) {
        delete newUser[body]
        console.log('newuser', newUser)
        request
          .post('/api/v1/users')
          .send(newUser)
          .expect(400)
          .end((err, res) => {
            if (err) console.log(err)
            expect(res.body.status.message).to.equal('failed')
            expect(res.body.status.code).to.equal(400)
            expect(res.body.error.message).to.equal(`User Error: Missing required parameter ${body}`)
          })
      }
      if (index === allBody.length - 1) {
        done()
      }
    })
  })
  it('should not signup if email is invalid', done => {
    const newUser = Object.assign({}, user, { email: 'jj.com' })
    request
      .post('/api/v1/users')
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

  it('should not signup if password is invalid', done => {
    const newUser = Object.assign({}, user, { password: 'jj.com' })
    request
      .post('/api/v1/users')
      .send(newUser)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Password must be at least 8 characters long')
        done(err)
      })
  })

  it('should not signup if date of birth is invalid', done => {
    const newUser = Object.assign({}, user, { dateOfBirth: 'jj.com' })
    request
      .post('/api/v1/users')
      .send(newUser)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Date of Birth is invalid')
        done(err)
      })
  })

  it('should not signup if gender is invalid', done => {
    const newUser = Object.assign({}, user, { gender: 'jj.com' })
    request
      .post('/api/v1/users')
      .send(newUser)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Gender is invalid')
        done(err)
      })
  })

  it('should not signup if country is invalid', done => {
    const newUser = Object.assign({}, user, { country: 'jj.com' })
    request
      .post('/api/v1/users')
      .send(newUser)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Country is invalid')
        done(err)
      })
  })

  it('should not signup if state is invalid', done => {
    const newUser = Object.assign({}, user, { state: 'jj.com' })
    request
      .post('/api/v1/users')
      .send(newUser)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('State is invalid')
        done(err)
      })
  })

  it('should not signup if firstName is too long', done => {
    const newUser = Object.assign({}, user, { firstName: 'ourlovewasmadeformoviescreenstakemybodytakemybody' })
    request
      .post('/api/v1/users')
      .send(newUser)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('First name is too long')
        done(err)
      })
  })
  it('should not signup if firstName has invalid chars', done => {
    const newUser = Object.assign({}, user, { firstName: 'Kodaline!' })
    request
      .post('/api/v1/users')
      .send(newUser)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('First name is invalid')
        done(err)
      })
  })
  it('should not signup if lastName has invalid chars', done => {
    const newUser = Object.assign({}, user, { lastName: 'Kodaline!' })
    request
      .post('/api/v1/users')
      .send(newUser)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Last name is invalid')
        done(err)
      })
  })
  it('should not signup if lasttName is too long', done => {
    const newUser = Object.assign({}, user, { lastName: 'ourlovewasmadeformoviescreenstakemybodytakemybody' })
    request
      .post('/api/v1/users')
      .send(newUser)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Last name is too long')
        done(err)
      })
  })
  it('should not signup an existing email', done => {
    const newUser = Object.assign({}, user, { email: regular.email })
    request
      .post('/api/v1/users')
      .send(newUser)
      .expect(409)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(409)
        expect(res.body.error.message).to.equal('User already exists')
        done(err)
      })
  })
  it.only('should signup a user', done => {
    const newUser = Object.assign({}, user)
    console.log(newUser)
    request
      .post('/api/v1/users')
      .send({
        "firstName": "Tomi",
        "lastName": "Duyile",
        "email": "tomi@duyile.com",
        "phoneNumber": "+234920284892",
        "dateOfBirth": "2017-10-10T05:23:12.845Z",
        "state": "Lagos",
        "country": "Nigeria",
        "localGovernment": "Mende",
        "gender": "male",
        "password": "password1"
      })
      .expect(201)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('success')
        expect(res.body.status.code).to.equal(201)
        expect(typeof res.body.data.user.token).to.equal('string')
        done(err)
      })
  })
})
