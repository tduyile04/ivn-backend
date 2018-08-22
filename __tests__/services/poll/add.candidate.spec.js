/*
  global describe: true
  global it: true
  global expect: true
  global request: true
  global beforeEach: true
  global regularAuthorization: true
  global setUp: true
  global politician: true
  global authorization: true
  global afterEach: true
  global tearDown: true
  global regular: true
*/

describe('Poll [POST] /poll/:poll_id/add_candidate', () => {
  let poll = {
    state: { name: 'Lagos State General Election', level: 'state', country: 'nigeria', state: 'lagos' },
    lg: { name: 'Alimosho LG Election', level: 'local', country: 'nigeria', state: 'lagos', localGovernment: 'alimosho' },
    feds: { name: '2019 General Election', level: 'federal', country: 'nigeria' }
  }
  beforeEach(done => {
    setUp().then(() => {
      delete poll.lg.id
      request
        .post('/api/v1/polls')
        .set('Authorization', authorization)
        .send(poll.lg)
        .expect(201)
        .end((err, res) => {
          if (err) console.log(err)
          poll.lg.id = res.body.data.poll.id
          done(err)
        })
    })
  })

  afterEach(done => {
    tearDown().then(() => done())
  })

  it.only('should only allow admins add candidates to polls', done => {
    request
      .post(`/api/v1/poll/${poll.lg.id}/add_candidate`)
      .set('Authorization', regularAuthorization)
      .send({ candidate: politician.id })
      .expect(403)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(403)
        expect(res.body.status.message).to.equal('failed')
        done(err)
      })
  })

  it.only('should return poll information', done => {
    request
      .post(`/api/v1/poll/${poll.lg.id}/add_candidate`)
      .set('Authorization', authorization)
      .send({ candidate: politician.id })
      .expect(200)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(200)
        done(err)
      })
  })

  it.only('should return 404 for poll that do not exist', done => {
    request
      .post(`/api/v1/poll/poll.lg.id/add_candidate`)
      .set('Authorization', authorization)
      .send({ candidate: politician.id })
      .expect(404)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(404)
        expect(res.body.error.message).to.equal('Poll not found')
        done(err)
      })
  })

  it.only('should return 404 if user does not exist', done => {
    request
      .post(`/api/v1/poll/${poll.lg.id}/add_candidate`)
      .set('Authorization', authorization)
      .send({ candidate: poll.lg.id })
      .expect(404)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(404)
        expect(res.body.error.message).to.equal('User not found')
        done(err)
      })
  })

  it.only('should return error if user is not a politician', done => {
    request
      .post(`/api/v1/poll/${poll.lg.id}/add_candidate`)
      .set('Authorization', authorization)
      .send({ candidate: regular.id })
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('User is not a politician')
        done(err)
      })
  })

  it.only('should return error if user is already contesting', done => {
    request
      .post(`/api/v1/poll/${poll.lg.id}/add_candidate`)
      .set('Authorization', authorization)
      .send({ candidate: politician.id })
      .expect(200)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.code).to.equal(200)
        return request
          .post(`/api/v1/poll/${poll.lg.id}/add_candidate`)
          .set('Authorization', authorization)
          .send({ candidate: politician.id })
          .expect(409)
          .end((err, res) => {
            expect(res.body.status.code).to.equal(409)
            expect(res.body.error.message).to.equal('User is already a candidate in this poll')
            done(err)
          })
      })
  })

  it.skip('should return error if user is already disqualified', done => {
    request
      .post(`/api/v1/poll/${poll.lg.id}/add_candidate`)
      .set('Authorization', authorization)
      .send({ candidate: regular.id })
      .expect(409)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(409)
        console.log(JSON.stringify(res.body, null, 2))
        done(err)
      })
  })
})
