import { Command } from 'commander'
import * as promptly from 'promptly'
import { abortPR, getPR } from '../files'

export const makeAbortCommand = () => {
  const abort = new Command('abort')

  abort
    .action(async () => {
      const prNumber = await getPR()
      if (!prNumber) {
        console.info('NO REVIEW IN PROGRESS')
        return
      }

      const c = await promptly.prompt('Confirm ABORT current review (y/N): ')
      if (c.toLowerCase() === 'y') {
        abortPR()
      }
    })

  return abort
}
