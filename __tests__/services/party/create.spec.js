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
*/

describe('Party [POST] /parties', () => {
  beforeEach(done => {
    setUp().then(() => done())
  })

  afterEach(done => {
    tearDown().then(() => done())
  })

  it.skip('should not allow non-admins to create parties', done => {
    let party = { name: 'QQW', avatar: 'qqw.jpeg', bio: 'xxxy' }
    request
      .post('/api/v1/parties')
      .set('Authorization', regularAuthorization)
      .send(party)
      .expect(403)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(403)
        done(err)
      })
  })
  it('should allow admins to create parties', done => {
    let party = { name: 'QQW', avatar: 'qqw.png', bio: 'xxxy' }
    request
      .post('/api/v1/parties')
      .set('Authorization', authorization)
      .send(party)
      .expect(201)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('success')
        expect(typeof res.body.data.party.id).to.equal('string')
        Object.keys(party).forEach(p => {
          expect(res.body.data.party[p]).to.equal(party[p])
        })
        done(err)
      })
  })
  it('should not allow empty non string name', done => {
    let party = { avatar: 'qqw.jpeg', bio: 'xxxy' }
    request
      .post('/api/v1/parties')
      .set('Authorization', authorization)
      .send(party)
      .expect(400)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('party Error: Missing required parameter name is required')
        done(err)
      })
  })
  it('should not allow empty name', done => {
    let party = { name: '', avatar: 'qqw.jpeg', bio: 'xxxy' }
    request
      .post('/api/v1/parties')
      .set('Authorization', authorization)
      .send(party)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('party Error: Missing required parameter name is required')
        done(err)
      })
  })
  it('should not allow non string avatar', done => {
    let party = { name: 'IOE', avatar: [['qqw.jpeg']], bio: 'xxxy' }
    request
      .post('/api/v1/parties')
      .set('Authorization', authorization)
      .send(party)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('party Error: Expected "avatar" to be type string, instead found object is required')
        done(err)
      })
  })
  it('should not allow non string type for bio', done => {
    let party = { name: 'IOE', avatar: 'qqw.jpg', bio: [['cnkd', 'cmdlcd']] }
    request
      .post('/api/v1/parties')
      .set('Authorization', authorization)
      .send(party)
      .expect(400)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.error.message).to.equal('party Error: Expected "bio" to be type string, instead found object is required')
        done(err)
      })
  })
  it.skip('should allow empty string type for avatar and set default avatar', done => {
    let party = { name: 'POL', avatar: '', bio: 'SOMETHING' }
    request
      .post('/api/v1/parties')
      .set('Authorization', authorization)
      .send(party)
      .expect(201)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('success')
        expect(typeof res.body.data.party.id).to.equal('string')
        Object.keys(party).forEach(p => {
          if (p === 'avatar') {
            expect(res.body.data.party[p]).to.equal('default.jpeg')
          } else {
            expect(res.body.data.party[p]).to.equal(party[p])
          }
        })
        done(err)
      })
  })
  it('should allow empty string type for bio', done => {
    let party = { name: 'KGB', avatar: 'kgb.jpg', bio: '' }
    request
      .post('/api/v1/parties')
      .set('Authorization', authorization)
      .send(party)
      .expect(201)
      .end((err, res) => {
        expect(res.body.status.message).to.equal('success')
        expect(typeof res.body.data.party.id).to.equal('string')
        Object.keys(party).forEach(p => {
          expect(res.body.data.party[p]).to.equal(party[p])
        })
        done(err)
      })
  })
  it('should not create existing party name', done => {
    let data = { name: 'La La Lang', avatar: '', bio: 'SOMETHING' }
    request
      .post('/api/v1/parties')
      .set('Authorization', authorization)
      .send(data)
      .expect(409)
      .end((err, res) => {
        if (err) console.log(err)
        expect(res.body.status.message).to.equal('failed')
        expect(res.body.status.code).to.equal(409)
        done(err)
      })
  })
})
