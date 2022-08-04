import { Command } from 'commander'
import { openPR, openStatus } from '../files'
import { getPullRequest } from '../github'
import { printInfo } from '../utils'

export const makeSummaryCommand = () => {
  const summary = new Command('summary')

  summary
    .action(async () => {
      const prNumber = await openPR()
      if (!prNumber) {
        console.info('NO REVIEW IN PROGRESS')
        return
      }

      const status = await openStatus()

      const pr = await getPullRequest(prNumber)
      printInfo({
        repository: pr.head.repo.full_name,
        pullRequest: String(prNumber),
        status,
      }, 'REVIEW IN PROGRESS')
    })

  return summary
}
