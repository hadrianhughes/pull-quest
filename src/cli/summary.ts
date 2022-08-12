import { Command } from 'commander'
import { PQDB } from '../database'
import { PQContext } from '../domain'
import { openPR, openStatus } from '../files'
import { getPullRequest } from '../github'
import { printInfo } from '../utils'

export const makeSummaryCommand = (db: PQDB, ctx: PQContext) => {
  const summary = new Command('summary')

  summary
    .action(async () => {
      const { ok, error, data: prNumber } = await openPR()
      if (!ok) {
        console.info(error)
        return
      }

      const { data: status } = await openStatus()

      const pr = await getPullRequest(prNumber)
      printInfo({
        repository: pr.head.repo.full_name,
        pullRequest: String(prNumber),
        status,
      }, 'REVIEW IN PROGRESS')
    })

  return summary
}
