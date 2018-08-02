/*
  global describe: true
  global it: true
  global expect: true
  global setUp: true
  global authorization: true
  global request: true
  global beforeEach: true
  global regularAuthorization: true
  global afterEach: true
  global tearDown: true
  global candidate: true
  global politician: true
*/

describe('Party [DELETE] /party/:id/members', () => {
  let partyID = null
  beforeEach(done => {
    setUp()
      .then(() => {
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
                expect(res.body.data.member.party_id).to.equal(partyID)
                expect(res.body.data.member.user_id).to.equal(candidate.id)
                done(err)
              })
          })
      })
  })

  afterEach(done => {
    tearDown().then(() => done())
  })

  it('should not allow non-admin to add a member to a party', done => {
    request
      .delete(`/api/v1/party/${partyID}/members`)
      .set('Authorization', regularAuthorization)
      .send({ user: candidate.id })
      .expect(403)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message)
          .to.equal('failed')
        done(err)
      })
  })

  it('should allow admin remove a member of a party', done => {
    request
      .delete(`/api/v1/party/${partyID}/members`)
      .set('Authorization', authorization)
      .send({ user: candidate.id })
      .expect(204)
      .end((err, res) => {
        if (err) console.log(err)
        done(err)
      })
  })

  it('should not remove member that is not in a party', done => {
    request
      .delete(`/api/v1/party/${partyID}/members`)
      .set('Authorization', authorization)
      .send({ user: politician.id })
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        done(err)
      })
  })
  it('should require user param', done => {
    request
      .delete(`/api/v1/party/${partyID}/members`)
      .set('Authorization', authorization)
      .send({ })
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Party Error: Missing required parameter user')
        done(err)
      })
  })
  it('should return 404 if user is not found', done => {
    request
      .delete(`/api/v1/party/${partyID}/members`)
      .set('Authorization', authorization)
      .send({ user: '3805aad4-1bdf-49af-93f8-bb2022438c26' })
      .expect(404)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('User not found')
        done(err)
      })
  })
  it('should return 404 if party is not found', done => {
    request
      .delete('/api/v1/party/9805aad4-1bdf-49af-93f8-bb2022438c26/members')
      .set('Authorization', authorization)
      .send({ user: candidate.id })
      .expect(404)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('Party not found')
        done(err)
      })
  })
})
