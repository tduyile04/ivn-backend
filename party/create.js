const axios = require('axios')
const csv = require('csvtojson')
const path = require('path')

csv()
  .fromFile(path.resolve(__dirname, './party_a.csv'))
  .then((jsonObj) => {
    jsonObj.forEach(({ name, slogan, abbr, motto }) => {
      return axios.post('https://ivotenaija.herokuapp.com/api/v1/parties', {
        name,
        slogan,
        abbr,
        motto
      }).then(response => {
        console.log('Success')
        console.log(response)
      }).catch(error => {
        console.log('Failed', error.response.data)
      })
    })
  })
