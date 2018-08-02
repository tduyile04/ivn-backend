function mapUser (data, fields, type) {
  return fields.reduce((acc, field) => {
    acc[field] = data[`${type}_${field}`]
    return acc
  }, {})
}

export function formatUser (data) {
  const fields = ['id', 'email', 'avatar', 'firstName', 'lastName']
  return Object.values(data.reduce((acc, row) => {
    if (acc[row.id]) {
      row.following_id && acc[row.id].followings.push(mapUser(row, fields, 'following'))
      row.followers_id && acc[row.id].followers.push(mapUser(row, fields, 'follower'))
      row.endorsements_id && acc[row.id].endorsements.push(mapUser(row, fields, 'endorsement'))
      row.roles && acc[row.id].roles.push({ id: row.role_id, name: row.role_name })
    } else {
      acc[row.id] = row
      acc[row.id].followings = row.following_id ? [mapUser(row, fields, 'following')] : []
      acc[row.id].followers = row.follower_id ? [mapUser(row, fields, 'follower')] : []
      acc[row.id].endorsements = row.endorsement_id ? [mapUser(row, fields, 'endorsement')] : []
      acc[row.id].roles = row.role_id ? [{ id: row.role_id, name: row.role_name }] : []
      fields.forEach(field => {
        delete acc[row.id][`user_${field}`]
        delete acc[row.id][`follower_${field}`]
        delete acc[row.id][`following_${field}`]
        delete acc[row.id][`endorsement_${field}`]
      })
      delete acc[row.id].role_id
      delete acc[row.id].role_name
    }
    return acc
  }, {}))[0]
}
