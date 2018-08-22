/*
  global describe: true
  global it: true
  global admin: true
  global expect: true
  global setUp: true
  global request: true
  global beforeEach: true
  global regularAuthorization: true
  global afterEach: true
  global tearDown: true
  global candidate: true
*/

describe('Question [POST] /questions', () => {
  beforeEach(done => {
    setUp().then(() => done())
  })

  afterEach(done => {
    tearDown().then(() => done())
  })

  it('should not allow unauthenticated users ask questions', done => {
    let question = { candidate: candidate.id, question: 'Are you gay?' }
    request
      .post('/api/v1/questions')
      .send(question)
      .expect(403)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(403)
        done(err)
      })
  })
  it('should allow authenticated users to ask questions', done => {
    let question = { candidate: candidate.id, question: 'Are you gay?' }
    request
      .post('/api/v1/questions')
      .set('Authorization', regularAuthorization)
      .send(question)
      .expect(201)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('success')
        expect(typeof res.body.data.question.id).to.equal('string')
        expect(res.body.data.question.candidate_id).to.equal(candidate.id)
        expect(res.body.data.question.question).to.equal(question.question)
        done(err)
      })
  })
  it('should not allow question with empty string', done => {
    let question = { question: '', candidate: candidate.id }
    request
      .post('/api/v1/questions')
      .set('Authorization', regularAuthorization)
      .send(question)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Question Error: Missing required parameter question')
        done(err)
      })
  })
  it('should require question param', done => {
    let question = { candidate: candidate.id }
    request
      .post('/api/v1/questions')
      .set('Authorization', regularAuthorization)
      .send(question)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Question Error: Missing required parameter question')
        done(err)
      })
  })
  it('should require candidate', done => {
    let question = { question: 'Are you gay?' }
    request
      .post('/api/v1/questions')
      .set('Authorization', regularAuthorization)
      .send(question)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Question Error: Missing required parameter candidate')
        done(err)
      })
  })
  it('should 404 if candidate is not found', done => {
    let question = { question: 'Are you gay?', candidate: 'bc9c5db6-54a5-425c-9eb6-1c4fcfb61f43' }
    request
      .post('/api/v1/questions')
      .set('Authorization', regularAuthorization)
      .send(question)
      .expect(404)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Candidate not found')
        done(err)
      })
  })
  it('should 404 if candidate is not a candidate', done => {
    let question = { question: 'Are you gay?', candidate: admin.id }
    request
      .post('/api/v1/questions')
      .set('Authorization', regularAuthorization)
      .send(question)
      .expect(404)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Candidate not found')
        done(err)
      })
  })
  it('should return 404 is uuid is invalid', done => {
    let question = { question: 'Are you gay?', candidate: 'admin.id' }
    request
      .post('/api/v1/questions')
      .set('Authorization', regularAuthorization)
      .send(question)
      .expect(404)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Candidate not found')
        done(err)
      })
  })
  it('should return error if question is too long', done => {
    let iq = ''
    for (let i = 0; i < 260; i++) { iq += 'lo'}
    let question = {
      question: iq,
      candidate: candidate.id
    }
    request
      .post('/api/v1/questions')
      .set('Authorization', regularAuthorization)
      .send(question)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Question cannot be more that 255 characters long')
        done(err)
      })
  })
})
