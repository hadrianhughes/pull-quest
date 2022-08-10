import { Command } from 'commander'
import { openPR } from '../files'

export const makeListCommentsCommand = () => {
  const listComments = new Command('comments')

  listComments
    .action(async () => {
      const { ok: okPR, error: errorPR } = await openPR()
      if (!okPR) {
        console.info(errorPR)
      }

      console.log('list comments')
    })

  return listComments
}
