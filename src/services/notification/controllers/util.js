import knex from '_models'

export function createNotifications (options) {
  if (options.sender_id === options.owner_id) return false
  return knex('notification')
    .insert(options)
    .then(result => result)
    .catch(e => console.error(e))
}
