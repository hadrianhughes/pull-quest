import { Command } from 'commander'
import * as promptly from 'promptly'
import { abortPR, openPR } from '../files'

export const makeAbortCommand = () => {
  const abort = new Command('abort')

  abort
    .option('-y, --yes', 'bypass prompt to confirm abort')
    .action(async (options) => {
      const prNumber = await openPR()
      if (!prNumber) {
        console.info('NO REVIEW IN PROGRESS')
        return
      }

      if (options.yes) {
        abortPR()
        console.info('REVIEW DISCARDED')
        return
      }

      const c = await promptly.prompt('Confirm ABORT current review? This cannot be reversed (y/N): ')
      if (c.toLowerCase() === 'y') {
        abortPR()
        console.info('REVIEW DISCARDED')
      }
    })

  return abort
}
