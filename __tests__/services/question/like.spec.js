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
*/

describe('Question [POST] /question/:question_id/like', () => {
  let q = null
  beforeEach(done => {
    setUp().then(() => {
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

  afterEach(done => {
    tearDown().then(() => done())
  })

  it('should not allow unauthenticated users like a question', done => {
    request
      .post(`/api/v1/question/${q.id}/like`)
      .expect(403)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(403)
        done(err)
      })
  })
  it('should 404 if question is not found', done => {
    request
      .post('/api/v1/question/bc9c5db6-54a5-425c-9eb6-1c4fcfb61f43/like')
      .set('Authorization', regularAuthorization)
      .expect(404)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Question not found')
        done(err)
      })
  })
  it('should return 404 is uuid is invalid', done => {
    request
      .post('/api/v1/question/lc5db6-54a5-425c-9eb6-1c4fcfb61f43/like')
      .set('Authorization', regularAuthorization)
      .expect(404)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Question not found')
        done(err)
      })
  })
  it('should toggle like to a question', done => {
    request
      .post(`/api/v1/question/${q.id}/like`)
      .set('Authorization', regularAuthorization)
      .expect(201)
      .end((err, res) => {
        if (err) console.log(err)
        request
          .post(`/api/v1/question/${q.id}/like`)
          .set('Authorization', regularAuthorization)
          .expect(204)
          .end((err, res) => {
            if (err) console.log(err)
            done(err)
          })
      })
  })
})
