/*
  global describe: true
  global it: true
  global expect: true
  global setUp: true
  global request: true
  global beforeEach: true
  global regularAuthorization: true
  global afterEach: true
  global tearDown: true
  global candidate: true
  global candidateAuthorization: true
  global regular: true
  global authorization: true
*/

describe('Answer [POST] /answers', () => {
  let q = null
  beforeEach(done => {
    setUp().then(() => {
      request
        .put(`/api/v1/user/${regular.id}/add_role`)
        .set('Authorization', authorization)
        .send({ role: 'candidate' })
        .expect(200)
        .end((err, res) => {
          if (err) console.log(err)
          expect(res.body.status.message).to.equal('success')
          expect(res.body.status.code).to.equal(200)
          let question = { candidate: candidate.id, question: 'Are you gay?' }
          request
            .post('/api/v1/questions')
            .set('Authorization', regularAuthorization)
            .send(question)
            .expect(201)
            .end((err, res) => {
              if (err) console.log(err)
              q = res.body.data.question
              expect(res.body.status.message).to.equal('success')
              expect(typeof res.body.data.question.id).to.equal('string')
              expect(res.body.data.question.candidate_id).to.equal(candidate.id)
              expect(res.body.data.question.question).to.equal(question.question)
              done(err)
            })
        })
    })
  })

  afterEach(done => {
    tearDown().then(() => done())
  })

  it('should not allow unauthenticated users answer', done => {
    let answer = { answer: 'No', question: q.id }
    request
      .post('/api/v1/answers')
      .send(answer)
      .expect(403)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(403)
        done(err)
      })
  })
  it('should not allow non candidate users to answer', done => {
    let answer = { answer: 'No', question: q.id }
    request
      .post('/api/v1/answers')
      .set('Authorization', authorization)
      .send(answer)
      .expect(403)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(403)
        done(err)
      })
  })
  it('should only allow target candidate to answer', done => {
    let answer = { answer: 'No', question: q.id }
    request
      .post('/api/v1/answers')
      .set('Authorization', regularAuthorization)
      .send(answer)
      .expect(403)
      .expect(403)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(403)
        done(err)
      })
  })
  it('should not allow answer with empty string', done => {
    let answer = { answer: '', question: q.id }
    request
      .post('/api/v1/answers')
      .set('Authorization', candidateAuthorization)
      .send(answer)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Answer Error: Missing required parameter answer')
        done(err)
      })
  })
  it('should require answer param', done => {
    let answer = { question: q.id }
    request
      .post('/api/v1/answers')
      .set('Authorization', candidateAuthorization)
      .send(answer)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Answer Error: Missing required parameter answer')
        done(err)
      })
  })
  it('should require question', done => {
    let answer = { answer: 'yes' }
    request
      .post('/api/v1/answers')
      .set('Authorization', candidateAuthorization)
      .send(answer)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Answer Error: Missing required parameter question')
        done(err)
      })
  })
  it('should 404 if question is not found', done => {
    let answer = { answer: 'Yes', question: 'bc9c5db6-54a5-425c-9eb6-1c4fcfb61f43' }
    request
      .post('/api/v1/answers')
      .set('Authorization', candidateAuthorization)
      .send(answer)
      .expect(404)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Question not found')
        done(err)
      })
  })
  it('should return 404 is uuid is invalid', done => {
    let answer = { answer: 'Yes', question: 'lc5db6-54a5-425c-9eb6-1c4fcfb61f43' }
    request
      .post('/api/v1/answers')
      .set('Authorization', candidateAuthorization)
      .send(answer)
      .expect(404)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Question not found')
        done(err)
      })
  })
  it('', done => {
    let answer = { answer: 'Yes', question: q.id }
    request
      .post('/api/v1/answers')
      .set('Authorization', candidateAuthorization)
      .send(answer)
      .expect(201)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('success')
        expect(typeof res.body.data.answer.id).to.equal('string')
        done(err)
      })
  })
  it('should return error if question already has an answer', done => {
    let answer = { answer: 'Yes', question: q.id }
    request
      .post('/api/v1/answers')
      .set('Authorization', candidateAuthorization)
      .send(answer)
      .expect(201)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('success')
        expect(typeof res.body.data.answer.id).to.equal('string')
        request
          .post('/api/v1/answers')
          .set('Authorization', candidateAuthorization)
          .send(answer)
          .expect(409)
          .end((err, res) => {
            if (err) console.log(err)
            expect(res.body.status.message).to.equal('failed')
            done(err)
          })
      })
  })
  it('should return error if answer is too long', done => {
    let iq = ''
    for (let i = 0; i < 260; i++) { iq += 'lo' }
    let answer = {
      answer: iq,
      question: q.id
    }
    request
      .post('/api/v1/answers')
      .set('Authorization', candidateAuthorization)
      .send(answer)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Answer cannot be more that 255 characters long')
        done(err)
      })
  })
})
