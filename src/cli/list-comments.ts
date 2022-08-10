import { Command } from 'commander'
import { openComments, openPR } from '../files'

export const makeListCommentsCommand = () => {
  const listComments = new Command('comments')

  listComments
    .action(async () => {
      const { ok: okPR, error: errorPR } = await openPR()
      if (!okPR) {
        console.info(errorPR)
      }

      const { data: comments } = await openComments()
      console.info(comments)
    })

  return listComments
}
