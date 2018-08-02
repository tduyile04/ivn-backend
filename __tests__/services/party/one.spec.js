/*
  global describe: true
  global it: true
  global expect: true
  global request: true
  global beforeEach: true
  global regularAuthorization: true
  global setUp: true
  global afterEach: true
  global tearDown: true
  global authorization: true
  global candidate: true
*/

describe('Party [GET] /party/:id', () => {
  let partyID = null
  beforeEach(done => {
    setUp().then(() => {
      let party = { name: 'WEE', avatar: 'WEE.jpeg', bio: 'xxxy' }
      request
        .post('/api/v1/parties')
        .set('Authorization', authorization)
        .send(party)
        .expect(201)
        .end((err, res) => {
          if (err) console.log(err)
          partyID = res.body.data.party.id
          request
            .post(`/api/v1/party/${partyID}/members`)
            .set('Authorization', authorization)
            .send({ user: candidate.id })
            .expect(201)
            .end((err, res) => {
              if (err) console.log(err)
              expect(res.body.status.message).to.equal('success')
              done(err)
            })
        })
    })
  })

  afterEach(done => {
    tearDown().then(() => done())
  })

  it('should return one party', done => {
    request
      .get(`/api/v1/party/${partyID}`)
      .set('Authorization', regularAuthorization)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(200)
        console.log(JSON.stringify(res.body, null, 2))
        expect(res.body.data.party.id).to.equal(partyID)
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
