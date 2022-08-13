import { Command } from 'commander'
import { PQDB, addReview, setActiveReview } from '../database'
import { ReviewState } from '../domain'
import { getRemote } from '../git'
import { getPullRequest, detailsFromRemote } from '../github'
import { printInfo } from '../utils'

export const makeNewCommand = (db: PQDB) => {
  const newCommand = new Command('new')

  newCommand
    .argument('<pr_number>', 'number/id of the pull request for which to start a review')
    .action(async (prNumber: number) => {
      await getPullRequest(prNumber)

      const remote = await getRemote()
      const { owner, repo } = detailsFromRemote(remote)
      const fullRepo = `${owner}/${repo}`

      const result = await addReview(db, fullRepo, prNumber, ReviewState.Comment)
      await setActiveReview(db, fullRepo, prNumber)

      printInfo({
        repository: result.repo,
        pullRequest: String(result.pr),
        state: ReviewState.Comment,
      }, 'Started a review')
    })

  return newCommand
}
