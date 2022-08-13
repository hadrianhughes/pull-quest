import { Comment } from '../domain'
import { PQDB } from '.'

export const getComments = async (db: PQDB): Promise<Comment[]> => {
  const rows = await db.all(
    `SELECT
       c.id,
       c.commit_id,
       c.line,
       c.body,
       r.repository,
       r.pull_request
     FROM
       comments c
     INNER JOIN reviews r ON
       r.id = c.review
     WHERE
       r.active = 1;
     `
  )

  return rows.map(r => ({
    id: r.id,
    commit: r.commit,
    line: r.line,
    body: r.body,
    repo: r.repository,
    pr: r.pull_request,
  }))
}
