import { Command } from 'commander'
import { getPR, getStatus } from '../files'
import { getPullRequest } from '../github'

export const makeSummaryCommand = () => {
  const summary = new Command('summary')

  summary
    .action(async () => {
      const prNumber = await getPR()
      if (!prNumber) {
        console.info('NO REVIEW IN PROGRESS')
        return
      }

      const status = await getStatus()

      const pr = await getPullRequest(prNumber)
      console.info(`REVIEW IN PROGRESS\nRepository:\t${pr.head.repo.full_name}\nPull Request:\t${prNumber}\nStatus:\t${status}`)
    })

  return summary
}
