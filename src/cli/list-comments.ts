import { Command } from 'commander'
import { display, getFormattedComments, openPR } from '../files'

export const makeListCommentsCommand = () => {
  const listComments = new Command('comments')

  listComments
    .action(async () => {
      const { ok: okPR, error: errorPR } = await openPR()
      if (!okPR) {
        console.info(errorPR)
      }

      const { ok: okComments, error: errorComments, data: comments } = await getFormattedComments()
      if (!okComments) {
        console.info(errorComments)
      }

      display(comments)
    })

  return listComments
}
