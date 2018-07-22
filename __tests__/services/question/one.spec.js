/*
  global describe: true
  global it: true
  global expect: true
  global request: true
  global beforeEach: true
  global regularAuthorization: true
  global setUp: true
  global candidate: true
  global candidateAuthorization: true
  global afterEach: true
  global tearDown: true
  global regular: true
*/

describe('Question [GET] /question/:question_id', () => {
  let q = null
  let comments = []
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
          let answer = { answer: 'Yes', question: q.id }
          request
            .post('/api/v1/answers')
            .set('Authorization', candidateAuthorization)
            .send(answer)
            .expect(201)
            .end((err, res) => {
              if (err) console.log(err)
              comments = []
              let comment = { comment: 'Really??', question: q.id }
              request
                .post('/api/v1/comments')
                .set('Authorization', regularAuthorization)
                .send(comment)
                .expect(201)
                .end((err, res) => {
                  if (err) console.log(err)
                  comments.push(comment)
                  comment = { comment: 'My daddy was a baseman', question: q.id }
                  request
                    .post('/api/v1/comments')
                    .set('Authorization', regularAuthorization)
                    .send(comment)
                    .expect(201)
                    .end((err, res) => {
                      if (err) console.log(err)
                      comments.push(comment)
                      done(err)
                    })
                })
            })
        })
    })
  })

  afterEach(done => {
    tearDown().then(() => done())
  })

  it('should not allow unauthenticated users through', done => {
    request
      .get(`/api/v1/question/${q.id}`)
      .expect(403)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(403)
        done(err)
      })
  })

  it('should return question information', done => {
    request
      .get(`/api/v1/question/${q.id}`)
      .set('Authorization', regularAuthorization)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(200)
        expect(res.body.data.question.id).to.equal(q.id)
        expect(res.body.data.question.name).to.equal(q.name)
        expect(res.body.data.question.asker.id).to.equal(regular.id)
        expect(res.body.data.question.asker.firstName).to.equal(regular.firstName)
        expect(res.body.data.question.candidate.id).to.equal(candidate.id)
        expect(res.body.data.question.comments.length).to.equal(2)
        res.body.data.question.comments.forEach((comment, index) => {
          expect(comment.comment).to.equal(comments[index].comment)
        })
        done(err)
      })
  })

  it('should return 404 if question does not exist', done => {
    request
      .get(`/api/v1/question/bc9c5db6-54a5-425c-9eb6-1c4fcfb61f43`)
      .set('Authorization', regularAuthorization)
      .expect(404)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(404)
        expect(res.body.status.message).to.equal('failed')
        done(err)
      })
  })

  it('should return 404 if question has invalid uuid', done => {
    request
      .get(`/api/v1/question/kckdmmkcdkmkcmkmdkmkcmdmkm`)
      .set('Authorization', regularAuthorization)
      .expect(404)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(404)
        expect(res.body.status.message).to.equal('failed')
        done(err)
      })
  })
})
