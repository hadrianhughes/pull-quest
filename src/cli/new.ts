import { Command } from 'commander'
import { PQDB, addReview, setActiveReview } from '../database'
import { ReviewState } from '../domain'
import { getFullRepo } from '../git'
import { getPullRequest } from '../github'
import { printInfo } from '../utils'

export const makeNewCommand = (db: PQDB) => {
  const newCommand = new Command('new')

  newCommand
    .argument('<pr_number>', 'number/id of the pull request for which to start a review')
    .action(async (prNumber: number) => {
      await getPullRequest(prNumber)

      const repo = await getFullRepo()

      const result = await addReview(db, repo, prNumber, ReviewState.Comment)
      await setActiveReview(db, repo, prNumber)

      printInfo({
        repository: result.repo,
        pullRequest: String(result.pr),
        state: ReviewState.Comment,
      }, 'Started a review')
    })

  return newCommand
}
