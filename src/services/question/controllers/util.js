import knex from '_models'

function getQuestions (where) {
  return knex('question')
    .leftJoin('answer', 'answer.question_id', 'question.id')
    .leftJoin('comment', 'comment.question_id', 'question.id')
    .leftJoin('question_like', 'question_like.question_id', 'question.id')
    .leftJoin('user as cm', 'cm.id', 'comment.user_id')
    .leftJoin('user as candidate', 'candidate.id', 'question.candidate_id')
    .leftJoin('user as lu', 'lu.id', 'question_like.user_id')
    .leftJoin('user as asker', 'asker.id', 'question.asker_id')
    .select([
      'question.*',
      'answer.answer',
      'answer.id as answer_id',
      'comment.id as comment_id',
      'comment.comment',
      'comment.user_id as comment_user_id',
      'question_like.id as like_id',
      'question_like.user_id as like_user_id',
      'cm.id as comment_user_id',
      'cm.firstName as comment_user_firstName',
      'cm.lastName as comment_user_lastName',
      'cm.avatar as comment_user_avatar',
      'candidate.id as candidate_user_id',
      'candidate.firstName as candidate_user_firstName',
      'candidate.lastName as candidate_user_lastName',
      'candidate.avatar as candidate_user_avatar',
      'lu.id as like_user_id',
      'lu.firstName as like_user_firstName',
      'lu.lastName as like_user_lastName',
      'lu.avatar as like_user_avatar',
      'asker.id as asker_user_id',
      'asker.firstName as asker_user_firstName',
      'asker.lastName as asker_user_lastName',
      'asker.avatar as asker_user_avatar'
    ])
    .where(where)
    .options({ nestTables: true })
}

function genUser (cell, row) {
  return {
    id: row[`${cell}_user_id`],
    avatar: row[`${cell}_user_avatar`],
    lastName: row[`${cell}_user_lastName`],
    firstName: row[`${cell}_user_firstName`]
  }
}

function isExist (col, list) {
  return col && list.filter(l => l.id === col).length === 0
}

export function fmtRawResponse (data) {
  const keep = ['id', 'likes', 'comments', 'answers', 'question', 'asker', 'created_at', 'candidate']
  return Object.values(data.reduce((acc, row) => {
    if (acc[row.id]) {
      isExist(row.like_id, acc[row.id].likes) &&
        acc[row.id].likes.push({ id: row.like_id, user: genUser('like', row) })
      isExist(row.answer_id, acc[row.id].answers) &&
        acc[row.id].answers
          .push({ id: row.answer_id, answer: row.answer, user: genUser('candidate', row) })
      isExist(row.comment_id, acc[row.id].comments) &&
          acc[row.id].comments
            .push({ id: row.comment_id, comment: row.comment, user: genUser('comment', row) })
    } else {
      acc[row.id] = row
      acc[row.id].asker = genUser('asker', row)
      acc[row.id].candidate = genUser('candidate', row)
      acc[row.id].answers = row.answer_id
        ? [{ id: row.answer_id, answer: row.answer, user: genUser('candidate', row) }] : []
      acc[row.id].comments = row.comment_id
        ? [{ id: row.comment_id, comment: row.comment, user: genUser('comment', row) }] : []
      acc[row.id].likes = row.like_id
        ? [{ id: row.like_id, user: genUser('like', row) }] : []
      Object.keys(acc[row.id]).forEach(r => {
        if (keep.indexOf(r) === -1) {
          delete acc[row.id][r]
        }
      })
    }
    return acc
  }, {}))
}

export function fetchCandidate (id) {
  return knex('user as u')
    .leftJoin('user_role as ur', 'u.id', 'ur.user_id')
    .leftJoin('role as r', 'ur.role_id', 'r.id')
    .select(['u.id', 'r.name as roleName'])
    .where(knex.raw('u.id = ?', [id]))
    .then(result => {
      if (result.length === 0) {
        throw new Error()
      } else if (result.filter(r => r.roleName === 'candidate').length === 0) {
        throw new Error()
      }
      return true
    })
    .catch(() => { throw new Error() })
}

export default {
  get: getQuestions
}
