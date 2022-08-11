import { Command } from 'commander'
import * as promptly from 'promptly'
import { openPR } from '../files'

export const makeSubmitCommand = () => {
  const submit = new Command('submit')

  submit
    .option('-y, --yes', 'bypass prompt to confirm submit')
    .action(async (options) => {
      const { ok, error } = await openPR()
      if (!ok) {
        console.info(error)
        return
      }

      if (options.yes) {
        console.log('SUBMIT')
        return
      }

      const c = await promptly.prompt('Confirm submit review (y/N)?: ')
      if (c.toLowerCase() === 'y') {
        console.log('SUBMIT')
      }
    })

  return submit
}
