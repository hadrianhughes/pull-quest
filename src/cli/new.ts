import { Command } from 'commander'
import { openPR, openStatus, savePRCommits, startReview } from '../files'
import { getPRCommits, getPullRequest } from '../github'
import { printInfo } from '../utils'

export const makeNewCommand = () => {
  const newCommand = new Command('new')

  newCommand
    .argument('<pr_number>', 'number/id of the pull request for which to start a review')
    .action(async (id: number) => {
      const { ok: okPR } = await openPR()
      if (okPR) {
        console.info('Review already in progress. Finish the current review or use `pq abort`')
        return
      }

      const pr = await getPullRequest(id)
      startReview(id)

      const { ok: okStatus, error, data: status } = await openStatus()
      if (!okStatus) {
        console.error(error)
        return
      }

      const commits = await getPRCommits(id)
      await savePRCommits(commits)

      printInfo({
        repository: pr.head.repo.full_name,
        pullRequest: String(id),
        status,
      }, 'STARTED A REVIEW')
    })

  return newCommand
}
