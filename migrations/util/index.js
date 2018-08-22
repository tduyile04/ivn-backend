const handleError = (error) => {
  console.error(`${error.message}`)
  console.error(error)
}

function composeMigration (fn, filename) {
  return (knex, P) => fn(knex, P)
    .then(() => console.log(`\t✅ \tDone: ${(filename || '').split('/').reverse()[0]}`))
    .catch(error => {
      console.log(`❌ ${(filename || '').split('/').reverse()[0]}`)
      handleError(error)
    })
}

module.exports = { handleError, composeMigration }
