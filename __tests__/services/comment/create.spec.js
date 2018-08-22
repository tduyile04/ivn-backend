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

describe('Comment [POST] /comments', () => {
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

  it('should not allow unauthenticated users comment', done => {
    let comment = { comment: 'No', question: q.id }
    request
      .post('/api/v1/comments')
      .send(comment)
      .expect(403)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(403)
        done(err)
      })
  })
  it('should not allow comment with empty string', done => {
    let comment = { comment: '', question: q.id }
    request
      .post('/api/v1/comments')
      .set('Authorization', regularAuthorization)
      .send(comment)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Comment Error: Missing required parameter comment')
        done(err)
      })
  })
  it('should require comment param', done => {
    let comment = { question: q.id }
    request
      .post('/api/v1/comments')
      .set('Authorization', regularAuthorization)
      .send(comment)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Comment Error: Missing required parameter comment')
        done(err)
      })
  })
  it('should require question', done => {
    let comment = { comment: 'yes' }
    request
      .post('/api/v1/comments')
      .set('Authorization', regularAuthorization)
      .send(comment)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Comment Error: Missing required parameter question')
        done(err)
      })
  })
  it('should 404 if question is not found', done => {
    let comment = { comment: 'Yes', question: 'bc9c5db6-54a5-425c-9eb6-1c4fcfb61f43' }
    request
      .post('/api/v1/comments')
      .set('Authorization', regularAuthorization)
      .send(comment)
      .expect(404)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Question not found')
        done(err)
      })
  })
  it('should return 404 is uuid is invalid', done => {
    let comment = { comment: 'Yes', question: 'lc5db6-54a5-425c-9eb6-1c4fcfb61f43' }
    request
      .post('/api/v1/comments')
      .set('Authorization', regularAuthorization)
      .send(comment)
      .expect(404)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Question not found')
        done(err)
      })
  })
  it('should add a comment to question', done => {
    let comment = { comment: 'Really??', question: q.id }
    request
      .post('/api/v1/comments')
      .set('Authorization', regularAuthorization)
      .send(comment)
      .expect(201)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('success')
        expect(typeof res.body.data.comment.id).to.equal('string')
        expect(res.body.data.comment.comment).to.equal('Really??')
        done(err)
      })
  })
  it('should return error if answer is too long', done => {
    let iq = ''
    for (let i = 0; i < 260; i++) { iq += 'lo' }
    let comment = {
      comment: iq,
      question: q.id
    }
    request
      .post('/api/v1/comments')
      .set('Authorization', regularAuthorization)
      .send(comment)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Comment cannot be more that 255 characters long')
        done(err)
      })
  })
})
