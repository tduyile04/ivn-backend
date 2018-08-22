/*
  global describe: true
  global it: true
  global expect: true
  global request: true
  global beforeEach: true
  global regularAuthorization: true
  global setUp: true
  global authorization: true
  global candidate: true
  global tearDown: true
  global afterEach: true
*/

describe('Party [GET] /parties', () => {
  beforeEach(done => {
    let partyID = null
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

  it('should return all parties', done => {
    request
      .get('/api/v1/parties')
      .set('Authorization', regularAuthorization)
      .expect(200)
      .end((err, res) => {
        expect(res.body.status.code).to.equal(200)
        expect(res.body.data.parties.length).to.equal(3)
        done(err)
      })
  })
})
