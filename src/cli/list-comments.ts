import { Command } from 'commander'
import { PQDB } from '../database'
import { PQContext } from '../domain'
import { display, openComments, openPR } from '../files'
import { formatComments } from '../utils'

export const makeListCommentsCommand = (db: PQDB, ctx: PQContext) => {
  const listComments = new Command('comments')

  listComments
    .action(async () => {
      const { ok: okPR, error: errorPR } = await openPR()
      if (!okPR) {
        console.info(errorPR)
      }

      const { ok: okComments, error: errorComments, data: comments } = await openComments()
      if (!okComments) {
        console.info(errorComments)
      }

      const formattedComments = await formatComments(comments)

      display(formattedComments)
    })

  return listComments
}
