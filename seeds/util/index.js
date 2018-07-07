const fs = require('fs')
const faker = require('faker')

function generateUser (filename) {
  const user = {
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    email: faker.internet.email(),
    is_active: true,
    phone_number: faker.phone.phoneNumber(),
    date_of_birth: faker.date.past(),
    is_registered: true,
    state: faker.address.state(),
    country: 'nigeria',
    local_government: 'Maryland'
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
