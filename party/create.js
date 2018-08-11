const axios = require('axios')
const csv = require('csvtojson')
const path = require('path')

'cdefghijk'.split('').forEach(c => {
  csv()
    .fromFile(path.resolve(__dirname, `./party_${c}.csv`))
    .then((jsonObj) => {
      jsonObj.forEach(({ name, slogan, abbr, motto }) => {
        return axios.post('https://ivotenaija.herokuapp.com/api/v1/parties', {
          name,
          slogan,
          abbr,
          motto
        }).then(response => {
          console.log('Success')
          console.log(response.data)
        }).catch(error => {
          console.log('Failed', error.response.data)
        })
      })
    })
})
