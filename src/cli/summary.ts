import { Command } from 'commander'
import { PQDB, getActiveReview } from '../database'
import { getRemote } from '../git'
import { detailsFromRemote } from '../github'
import { printInfo } from '../utils'

export const makeSummaryCommand = (db: PQDB) => {
  const summary = new Command('summary')

  summary
    .action(async () => {
      const remote = await getRemote()
      const { owner, repo } = detailsFromRemote(remote)
      const fullRepo = `${owner}/${repo}`

      const review = await getActiveReview(db, fullRepo)
      if (!review) {
        console.info('No review in progress')
      }

      printInfo({
        repository: review.repo,
        pullRequest: String(review.pr),
        state: review.state,
      }, 'REVIEW IN PROGRESS')
    })

  return summary
}
