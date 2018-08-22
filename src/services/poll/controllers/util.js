function isExist (col, list) {
  return col && list.filter(l => l.id === col).length === 0
}

function genUser (cell, row) {
  return {
    id: row[`${cell}_id`],
    avatar: row[`${cell}_avatar`],
    lastName: row[`${cell}_lastName`],
    firstName: row[`${cell}_firstName`],
    email: row[`${cell}_email`]
  }
}

export function fmtRawResponse (polls) {
  const keep = ['id', 'name', 'candidates', 'winner', 'disqualified', 'voters', 'created_at', 'level', 'state', 'country', 'local_government']
  return Object.values(polls.reduce((a, row) => {
    if (a[row.id]) {
      isExist(row.winner_id, a[row.id].winner) &&
        a[row.id].winner.push(genUser('winner', row))
      isExist(row.candidate_id, a[row.id].candidates) &&
        a[row.id].candidates.push(genUser('candidate', row))
      isExist(row.voter_id, a[row.id].voters) &&
        a[row.id].voters.push(genUser('voter', row))
      isExist(row.disqualified_id, a[row.id].disqualified) &&
        a[row.id].disqualified.push(genUser('disqualified', row))
    } else {
      console.log(row)
      a[row.id] = row
      a[row.id].winner = row.winner_id ? [genUser('winner', row)] : []
      a[row.id].candidates = row.candidate_id ? [genUser('candidate', row)] : []
      a[row.id].voters = row.voter_id ? [genUser('voter', row)] : []
      a[row.id].disqualified = row.disqualified_id ? [genUser('disqualified', row)] : []
      Object.keys(a[row.id]).forEach(r => {
        if (keep.indexOf(r) === -1) {
          delete a[row.id][r]
        }
      })
    }
    return a
  }, {}))
}
