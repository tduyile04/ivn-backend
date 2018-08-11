/*
  global describe: true
  global it: true
  global expect: true
  global request: true
  global beforeEach: true
  global regularAuthorization: true
  global setUp: true
  global candidate: true
  global authorization: true
  global afterEach: true
  global tearDown: true
  global regular: true
*/

describe('Post [GET] /posts', () => {
  let p = null
  let comments = []
  beforeEach(done => {
    setUp().then(() => {
      let post = { content: 'Travel the world and see everything possible' }
      request
        .post('/api/v1/posts')
        .set('Authorization', authorization)
        .send(post)
        .expect(201)
        .end((err, res) => {
          if (err) console.log(err)
          
          p = res.body.data.post
          comments = []
          let comment = { comment: 'Yes please :)' }
          request
            .post(`/api/v1/post/${p.id}/comment`)
            .set('Authorization', regularAuthorization)
            .send(comment)
            .expect(201)
            .end((err, res) => {
              if (err) console.log(err)
              comments.push(comment)
              comment = { comment: 'Travel travel travel' }
              request
                .post(`/api/v1/post/${p.id}/comment`)
                .set('Authorization', regularAuthorization)
                .send(comment)
                .expect(201)
                .end((err, res) => {
                  if (err) console.log(err)
                  comments.unshift(comment)
                  done(err)
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
      .get('/api/v1/posts')
      .expect(403)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(403)
        done(err)
      })
  })

  it('should return posts information', done => {
    request
      .get('/api/v1/posts')
      .set('Authorization', regularAuthorization)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(200)
        expect(res.body.data.posts.length).to.equal(1)
        expect(res.body.data.posts[0].name).to.equal(p.name)
        expect(res.body.data.posts[0].author.id).to.equal(admin.id)
        expect(res.body.data.posts[0].author.firstName).to.equal(admin.firstName)
        expect(res.body.data.posts[0].comments.length).to.equal(2)
        console.log(JSON.stringify(res.body, null, 2))
        res.body.data.posts[0].comments.forEach((comment, index) => {
          expect(comment.comment).to.equal(comments[index].comment)
        })
        done(err)
      })
  })

  it('should return a list of paginated questions', done => {
    request
      .get('/api/v1/posts/?limit=1&page=1')
      .set('Authorization', regularAuthorization)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(200)
        expect(res.body.data.posts.length).to.equal(1)
        expect(res.body.metadata.total).to.equal(1)
        expect(res.body.metadata.page).to.equal(1)
        expect(res.body.metadata.totalPage).to.equal(1)
        expect(res.body.metadata.perPage).to.equal(1)
        done(err)
      })
  })

  it('should return default pagination option for invalid queries', done => {
    request
      .get('/api/v1/posts/?limit=io&page=p')
      .set('Authorization', regularAuthorization)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(200)
        expect(res.body.data.posts.length).to.equal(1)
        expect(res.body.metadata.total).to.equal(1)
        expect(res.body.metadata.page).to.equal(1)
        expect(res.body.metadata.totalPage).to.equal(1)
        expect(res.body.metadata.perPage).to.equal(10)
        done(err)
      })
  })
})
