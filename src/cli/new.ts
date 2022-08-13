import { Command } from 'commander'
import { PQDB, addReview, setActiveReview } from '../database'
import { PQContext, ReviewStatus } from '../domain'
import { getPullRequest } from '../github'
import { printInfo } from '../utils'

export const makeNewCommand = (db: PQDB, ctx: PQContext) => {
  const newCommand = new Command('new')

  newCommand
    .argument('<pr_number>', 'number/id of the pull request for which to start a review')
    .action(async (prNumber: number) => {
      await getPullRequest(prNumber)

      const result = await addReview(db, ctx.repo, prNumber, ReviewStatus.Comment)
      await setActiveReview(db, ctx.repo, prNumber)

      printInfo({
        repository: result.repo,
        pullRequest: String(result.pr),
        status: ReviewStatus.Comment,
      }, 'Started a review')
    })

  return newCommand
}
