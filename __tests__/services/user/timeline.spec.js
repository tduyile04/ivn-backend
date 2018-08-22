/*
  global describe: true
  global it: true
  global expect: true
  global setUp: true
  global request: true
  global beforeEach: true
  global regularAuthorization: true
  global regular: true
  global admin: true
  global afterEach: true
  global tearDown: true
  global candidate: true
  global candidateAuthorization: true
*/

describe('User [PUT] /api/v1/users/follow', () => {
  let q = null
  let comments = []
  beforeEach(done => {
    setUp()
      .then(() => {
        let question = { candidate: candidate.id, question: 'Are you gay?' }
        request
          .put(`/api/v1/users/follow`)
          .set('Authorization', regularAuthorization)
          .send({ user: candidate.id })
          .expect(200)
          .end((err, res) => {
            if (err) console.log(err)
            expect(res.body.status.message).to.equal('success')
            expect(res.body.status.code).to.equal(200)
            request
              .post('/api/v1/questions')
              .set('Authorization', regularAuthorization)
              .send(question)
              .expect(201)
              .end((err, res) => {
                if (err) console.log(err)
                request
                  .post('/api/v1/questions')
                  .set('Authorization', regularAuthorization)
                  .send(Object.assign({}, question, { question: 'Where were you?' }))
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
                                request
                                  .post('/api/v1/questions')
                                  .set('Authorization', regularAuthorization)
                                  .send(Object.assign({}, question, { question: 'You are the one I need?' }))
                                  .expect(201)
                                  .end((err, res) => {
                                    if (err) console.log(err)
                                    done(err)
                                  })
                              })
                          })
                      })
                  })
              })
          })
      })
  })

  afterEach(done => {
    tearDown().then(() => done())
  })

  it('should only allow authenticated users see timeline', done => {
    request
      .get(`/api/v1/user/${regular.id}/timeline`)
      .set('authorization', regularAuthorization)
      .expect(200)
      .end((err, res) => {
        if (err) console.log(err)
        console.log(res.body)
        expect(res.body.status.message).to.equal('success')
        expect(res.body.data.timeline.length).to.equal(3)
        done(err)
      })
  })

  it('should allow authenticated users follow other users', done => {
    let data = { user: admin.id }
    request
      .put(`/api/v1/users/follow`)
      .set('Authorization', regularAuthorization)
      .send(data)
      .expect(200)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('success')
        expect(res.body.status.code).to.equal(200)
        done(err)
      })
  })

  it('should not allow users follow already followed users', done => {
    request
      .put(`/api/v1/users/follow`)
      .set('Authorization', regularAuthorization)
      .send({ user: candidate.id })
      .expect(409)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(409)
        expect(res.body.error.message).to.equal('Already followed this user')
        done(err)
      })
  })

  it('should require user id in request body', done => {
    let data = { ue: admin.id }
    request
      .put(`/api/v1/users/follow`)
      .set('Authorization', regularAuthorization)
      .send(data)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('User Error: Illegal parameter "ue" provided')
        done(err)
      })
  })

  it('should return 404 if user to follow is not found', done => {
    let data = { user: '8ddc07e1-01f7-4cc8-b3cd-611b915ec8d4' }
    request
      .put(`/api/v1/users/follow`)
      .set('Authorization', regularAuthorization)
      .send(data)
      .expect(404)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(404)
        expect(res.body.error.message).to.equal('User not found')
        done(err)
      })
  })

  it('should return 404 error if user to follow is not a valid uuid', done => {
    let data = { user: '8ddc07e1-01f7-4cc8-b3cd611b915ec8d4' }
    request
      .put(`/api/v1/users/follow`)
      .set('Authorization', regularAuthorization)
      .send(data)
      .expect(404)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(404)
        expect(res.body.error.message).to.equal('User not found')
        done(err)
      })
  })

  it('should return 400 error if trying to follow self', done => {
    let data = { user: regular.id }
    request
      .put(`/api/v1/users/follow`)
      .set('Authorization', regularAuthorization)
      .send(data)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(400)
        expect(res.body.error.message).to.equal('Cannot follow yourself')
        done(err)
      })
  })
})
