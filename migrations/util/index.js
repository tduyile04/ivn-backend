const handleError = (error) => {
  console.error(`${error.message}`)
  console.error(error)
}

function composeMigration (fn, filename) {
  return (knex, P) => fn(knex, P)
    .then(() => console.log(`Done: ${(filename || '').split('/').reverse()[0]}\t✅ `))
    .catch(error => {
      console.log(`❌ ${(filename || '').split('/').reverse()[0]}`)
      handleError(error)
    })
}

module.exports = { handleError, composeMigration }
