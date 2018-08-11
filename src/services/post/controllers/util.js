import knex from '_models'

function getPosts (where) {
  return knex('post')
    .leftJoin(knex('post_comment').select('*').orderBy('created_at', 'desc').as('comment'), 'comment.post_id', 'post.id')
    .leftJoin('post_like as like', 'like.post_id', 'post.id')
    .leftJoin('user as cm', 'cm.id', 'comment.user_id')
    .leftJoin('user as lu', 'lu.id', 'like.user_id')
    .leftJoin('user as author', 'author.id', 'post.author_id')
    .select([
      'post.*',
      'comment.id as comment_id',
      'comment.comment',
      'comment.created_at as comment_createdAt',
      'comment.user_id as comment_user_id',
      'like.id as like_id',
      'like.user_id as like_user_id',
      'cm.id as comment_user_id',
      'cm.firstName as comment_user_firstName',
      'cm.lastName as comment_user_lastName',
      'cm.avatar as comment_user_avatar',
      'lu.id as like_user_id',
      'lu.firstName as like_user_firstName',
      'lu.lastName as like_user_lastName',
      'lu.avatar as like_user_avatar',
      'author.id as author_user_id',
      'author.firstName as author_user_firstName',
      'author.lastName as author_user_lastName',
      'author.avatar as author_user_avatar'
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
  const keep = ['id', 'likes', 'comments', 'post', 'author', 'created_at', 'content']
  return Object.values(data.reduce((acc, row) => {
    if (acc[row.id]) {
      isExist(row.like_id, acc[row.id].likes) && acc[row.id].likes.push({ id: row.like_id, user: genUser('like', row) })
      isExist(row.comment_id, acc[row.id].comments) && acc[row.id].comments.push({ id: row.comment_id, comment: row.comment, user: genUser('comment', row), createdAt: row.comment_createdAt })
    } else {
      acc[row.id] = row
      acc[row.id].author = genUser('author', row)
      
      acc[row.id].comments = row.comment_id ? [{ id: row.comment_id, comment: row.comment, user: genUser('comment', row), createdAt: row.comment_createdAt }] : []
      acc[row.id].likes = row.like_id ? [{ id: row.like_id, user: genUser('like', row) }] : []
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
  get: getPosts
}
