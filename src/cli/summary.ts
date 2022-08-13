import { Command } from 'commander'
import { PQDB } from '../database'
import { openPR, openState } from '../files'
import { getPullRequest } from '../github'
import { printInfo } from '../utils'

export const makeSummaryCommand = (db: PQDB) => {
  const summary = new Command('summary')

  summary
    .action(async () => {
      const { ok, error, data: prNumber } = await openPR()
      if (!ok) {
        console.info(error)
        return
      }

      const { data: state } = await openState()

      const pr = await getPullRequest(prNumber)
      printInfo({
        repository: pr.head.repo.full_name,
        pullRequest: String(prNumber),
        state,
      }, 'REVIEW IN PROGRESS')
    })

  return summary
}
