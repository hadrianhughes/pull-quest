import * as clc from 'cli-color'
import { Command } from 'commander'
import * as promptly from 'promptly'
import { openPR, getCommentCount } from '../files'

const makeReport = (pr: number, commentCount: number) => `
${clc.underline('Sumbit review')}
${clc.bold('Pull Request:')}\t${pr}
${clc.bold('# Comments:')}\t${commentCount}

Confirm? (y/N): 
`

export const makeSubmitCommand = () => {
  const submit = new Command('submit')

  submit
    .option('-y, --yes', 'bypass prompt to confirm submit')
    .action(async (options) => {
      const { ok, error, data: pr } = await openPR()
      if (!ok) {
        console.info(error)
        return
      }

      if (options.yes) {
        console.log('SUBMIT')
        return
      }

      const { ok: okCom, error: errCom, data: commentCount } = await getCommentCount()
      if (!okCom) {
        console.info(errCom)
      }

      const c = await promptly.prompt(makeReport(pr, commentCount), { default: 'n' })
      if (c.toLowerCase() === 'y') {
        console.log('SUBMIT')
      } else {
        console.info('Did not submit')
      }
    })

  return submit
}
