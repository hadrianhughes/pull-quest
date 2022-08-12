import { PQContext } from '../domain'
import { PQDB } from '.'

export type Comment = {
  id: number
  commit: string
  line: number
  body: string
}

export const getComments = async (db: PQDB, ctx: PQContext): Promise<Comment[]> => {
  const rows = await db.all('SELECT * FROM comments WHERE repo = ? AND pr = ?', [ctx.repo, ctx.pr])

  return rows.map(r => ({
    id: r.id,
    commit: r.commit,
    line: r.line,
    body: r.body,
  }))
}
