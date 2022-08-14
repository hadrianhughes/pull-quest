import { Command } from 'commander'
import { PQDB, getActiveReview } from '../database'
import { getFullRepo } from '../git'
import { printInfo } from '../utils'

export const makeSummaryCommand = (db: PQDB) => {
  const summary = new Command('summary')

  summary
    .action(async () => {
      const repo = await getFullRepo()

      const review = await getActiveReview(db, repo)
      if (!review) {
        console.info('No review in progress')
        return
      }

      printInfo({
        repository: review.repo,
        pullRequest: String(review.pr),
        state: review.state,
      }, 'REVIEW IN PROGRESS')
    })

  return summary
}
