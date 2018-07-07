/*
  global describe: true
  global it: true
  global expect: true
  global setUp: true
  global authorization: true
  global request: true
  global beforeEach: true
  global party: true
  global regularAuthorization: true
*/

describe('Party [DELETE] /party/:id', () => {
  beforeEach(done => {
    setUp()
      .then(() => {
        done()
      })
  })

  it('should not allow non-admin to delete party', done => {
    request
      .delete(`/api/v1/party/${party.id}`)
      .set('Authorization', regularAuthorization)
      .expect(403)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        done(err)
      })
  })

  it('should not allow admin to delete party that does not exist', done => {
    request
      .delete('/api/v1/party/5503d632-c064-4431-af05-345f7b2197a5')
      .set('Authorization', authorization)
      .expect(404)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        done(err)
      })
  })

  it('should not allow admin to delete party with invalid id', done => {
    request
      .delete('/api/v1/party/5503d632-c064-4431-af05-345f7b2197')
      .set('Authorization', authorization)
      .expect(500)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.error.message).to.equal('invalid input syntax for type uuid: "5503d632-c064-4431-af05-345f7b2197"')
        done(err)
      })
  })

  it('should allow admin to delete party', done => {
    request
      .delete(`/api/v1/party/${party.id}`)
      .set('Authorization', authorization)
      .expect(200)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('success')
        done(err)
      })
  })
})
