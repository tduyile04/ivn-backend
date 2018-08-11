const fs = require('fs')
const faker = require('faker')

function generateUser (filename) {
  const user = {
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    email: faker.internet.email(),
    isActive: true,
    phoneNumber: faker.phone.phoneNumber(),
    dateOfBirth: faker.date.past(),
    isRegistered: true,
    state: 'Lagos',
    country: 'Nigeria',
    localGovernment: 'Maryland'
  }
  let text = '\n\nUser Info\n----------\n'
  Object.keys(user).forEach(k => { text += `${k}: ${user[k]}\n`; return true })
  fs.appendFile(filename, text, () => console.log('added user'))
  return user
}

function initFiles (filename) {
  return fs.writeFileSync(filename, '')
}

module.exports = { generateUser, initFiles }
