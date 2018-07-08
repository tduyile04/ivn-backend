/*
  global describe: true
  global it: true
  global expect: true
  global request: true
  global beforeEach: true
  global regularAuthorization: true
  global setUp: true
  global party: true
*/

describe('Party [GET] /party/:id', () => {
  beforeEach(done => {
    setUp()
      .then(() => done())
  })

  it('should return one party', done => {
    request
      .get(`/api/v1/party/${party.id}`)
      .set('Authorization', regularAuthorization)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(200)
        expect(res.body.data.party.id).to.equal(party.id)
        done(err)
      })
  })
  it('should return not found for non existent party id', done => {
    request
      .get('/api/v1/party/3fa96926-caec-4f20-9f59-c3cf6296c50a')
      .set('Authorization', regularAuthorization)
      .expect(404)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(404)
        expect(res.body.error.message).to.equal('party not found')
        done(err)
      })
  })
  it('should return not found for invalid uuid id', done => {
    request
      .get('/api/v1/party/3fa96926-caec-4f20-9f59c3cf6296c50a')
      .set('Authorization', regularAuthorization)
      .expect(404)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(404)
        expect(res.body.error.message).to.equal('party not found')
        done(err)
      })
  })
})
