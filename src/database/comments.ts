import { Comment } from '../domain'
import { Maybe } from '../utils'
import { PQDB } from '.'

export const getComments = async (db: PQDB): Promise<Comment[]> => {
  const rows = await db.all(
    `SELECT
       c.rowid,
       c.commit_id,
       c.line,
       c.file,
       c.body,
       r.repository,
       r.pull_request,
       r.active_commit
     FROM
       comments c
     INNER JOIN reviews r ON
       r.rowid = c.review
     WHERE
       r.active = 1;
     `
  )

  return rows.map(r => ({
    id: r.rowid,
    commit: r.active_commit,
    line: r.line,
    file: r.file,
    body: r.body,
    repo: r.repository,
    pr: r.pull_request,
  }))
}

export const getCommentByID = async (db: PQDB, id: number): Promise<Maybe<Comment>> => {
  const row = await db.get(
    `SELECT
       c.rowid,
       c.commit_id,
       c.line,
       c.file,
       c.body,
       r.repository,
       r.pull_request
     FROM
       comments c
     INNER JOIN reviews r ON
       r.rowid = c.review
     WHERE
       c.rowid = ?
     `,
     [id],
  )

  if (!row) {
    return null
  }

  return {
    id: row.rowid,
    commit: row.commit_id,
    line: row.line,
    file: row.file,
    body: row.body,
    repo: row.repository,
    pr: row.pull_request,
  }
}

export const addComment = async (
  db: PQDB,
  review: number,
  commit: string,
  body: string,
  file?: string,
  line?: number,
): Promise<Comment> => {
  let result
  if (file && line) {
    result = await db.run(
      'INSERT INTO comments (commit_id, review, body, file, line) VALUES (?, ?, ?, ?, ?);',
      [commit, review, body, line, file],
    )
  } else if (file) {
    result = await db.run(
      'INSERT INTO comments (commit_id, review, body, file) VALUES (?, ?, ?, ?);',
      [commit, review, body, file],
    )
  } else {
    result = await db.run(
      'INSERT INTO comments (commit_id, review, body) VALUES (?, ?, ?);',
      [commit, review, body],
    )
  }

  if (result.changes === 0) {
    throw new Error(`error inserting into comments table: ${JSON.stringify({ review, commit, body, line, file })}`)
  }

  const c = await getCommentByID(db, result.lastID)
  if (!c) {
    throw new Error(`error fetching newly inserted comment with ID: ${result.lastID}`)
  }

  return c
}
