/*
  global describe: true
  global it: true
  global expect: true
  global request: true
  global beforeEach: true
  global regularAuthorization: true
  global setUp: true
*/

describe('Party [GET] /parties', () => {
  beforeEach(done => {
    setUp()
      .then(() => done())
  })

  it('should return all parties', done => {
    request
      .get('/api/v1/parties')
      .set('Authorization', regularAuthorization)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(200)
        expect(res.body.data.parties.length).to.equal(2)
        done(err)
      })
  })
})
