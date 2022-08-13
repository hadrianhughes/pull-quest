import { Command } from 'commander'
import { PQDB } from '../database'
import * as promptly from 'promptly'
import { abortPR, openPR } from '../files'

export const makeAbortCommand = (db: PQDB) => {
  const abort = new Command('abort')

  abort
    .option('-y, --yes', 'bypass prompt to confirm abort')
    .action(async (options) => {
      const { ok, error } = await openPR()
      if (!ok) {
        console.info(error)
        return
      }

      if (options.yes) {
        abortPR()
        console.info('REVIEW DISCARDED')
        return
      }

      const c = await promptly.prompt('Confirm ABORT current review? This cannot be reversed (y/N): ', { default: 'n' })
      if (c.toLowerCase() === 'y') {
        abortPR()
        console.info('REVIEW DISCARDED')
      } else {
        console.info('Did not abort')
      }
    })

  return abort
}
