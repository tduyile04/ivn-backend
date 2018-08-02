export function formatParties (parties) {
  return Object.values(parties.reduce((acc, row) => {
    if (acc[row.id]) {
      row.follower && acc[row.id].followers.push(row.follower)
      row.member && acc[row.id].members.push(row.member)
    } else {
      acc[row.id] = row
      acc[row.id].followers = row.follower ? [row.follower] : []
      acc[row.id].members = row.member ? [row.member] : []
      delete acc[row.id].member
      delete acc[row.id].follower
    }
    return acc
  }, {}))
}

export function formatParty (party) {
  return Object.values(party.reduce((acc, row) => {
    const fields = ['id', 'firstName', 'lastName', 'avatar']
    if (acc[row.id]) {
      row.follower_id && acc[row.id].followers.push(getUser(row, fields, 'follower'))
      row.member_id && acc[row.id].members.push(getUser(row, fields, 'member'))
    } else {
      acc[row.id] = row
      acc[row.id].followers = row.follower_id ? [getUser(row, fields, 'follower')] : []
      acc[row.id].members = row.member_id ? [getUser(row, fields, 'member')] : []
      fields.forEach(field => {
        delete acc[row.id][`follower_${field}`]
        delete acc[row.id][`member_${field}`]
      })
    }
    return acc
  }, {}))[0]
}

function getUser (data, fields, type) {
  return fields.reduce((acc, field) => {
    acc[field] = data[`${type}_${field}`]
    return acc
  }, {})
}
