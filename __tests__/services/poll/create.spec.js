/*
  global describe: true
  global it: true
  global expect: true
  global setUp: true
  global request: true
  global beforeEach: true
  global authorization: true
  global afterEach: true
  global tearDown: true
*/

describe('Poll [POST] /polls', () => {
  let poll = {
    state: { name: 'Lagos State General Election', level: 'state', country: 'nigeria', state: 'lagos' },
    lg: { name: 'Alimosho LG Election', level: 'local', country: 'nigeria', state: 'lagos', localGovernment: 'alimosho' },
    feds: { name: '2019 General Election', level: 'federal', country: 'nigeria' }
  }
  beforeEach(done => {
    setUp().then(() => done())
  })

  afterEach(done => {
    tearDown().then(() => done())
  })

  it('should not allow non admins create polls', done => {
    request
      .post('/api/v1/polls')
      .send(poll.state)
      .expect(403)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(403)
        done(err)
      })
  })

  it('should allow admins create polls', done => {
    request
      .post('/api/v1/polls')
      .set('authorization', authorization)
      .send(poll.lg)
      .expect(201)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('success')
        expect(res.body.status.code).to.equal(201)
        expect(res.body.data.poll.name).to.equal(poll.lg.name)
        done(err)
      })
  })

  it('should not allow poll in country that does not exist', done => {
    request
      .post('/api/v1/polls')
      .set('authorization', authorization)
      .send(Object.assign({}, poll.feds, { country: 'alysaa' }))
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Country is not yet supported')
        done(err)
      })
  })

  it('should not allow poll in state that does not exist', done => {
    request
      .post('/api/v1/polls')
      .set('authorization', authorization)
      .send(Object.assign({}, poll.state, { state: 'alysaa' }))
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('State is not yet supported')
        done(err)
      })
  })

  it('should not allow poll in Local government that does not exist', done => {
    request
      .post('/api/v1/polls')
      .set('authorization', authorization)
      .send(Object.assign({}, poll.lg, { localGovernment: 'alysaa' }))
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Local government is not yet supported')
        done(err)
      })
  })

  it('should not allow poll for level that is not supported', done => {
    request
      .post('/api/v1/polls')
      .set('authorization', authorization)
      .send(Object.assign({}, poll.lg, { level: 'alysaa' }))
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Level is not yet supported')
        done(err)
      })
  })
})
