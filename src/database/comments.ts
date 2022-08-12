import { Comment, PQContext } from '../domain'
import { PQDB } from '.'

export const getComments = async (db: PQDB, ctx: PQContext): Promise<Comment[]> => {
  const rows = await db.all('SELECT * FROM comments WHERE repository = ? AND pull_request = ?', [ctx.repo, ctx.pr])

  return rows.map(r => ({
    id: r.id,
    commit: r.commit,
    line: r.line,
    body: r.body,
    repo: r.repository,
    pr: r.pull_request,
  }))
}
