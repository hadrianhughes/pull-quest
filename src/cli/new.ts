import { Command } from 'commander'
import { PQDB } from '../database'
import { PQContext } from '../domain'
import { openPR, openStatus, savePRCommits, startReview } from '../files'
import { getPRCommits, getPullRequest } from '../github'
import { printInfo } from '../utils'

export const makeNewCommand = (db: PQDB, ctx: PQContext) => {
  const newCommand = new Command('new')

  newCommand
    .argument('<pr_number>', 'number/id of the pull request for which to start a review')
    .action(async (id: number) => {
      const { ok: okPR } = await openPR()
      if (okPR) {
        console.info('Review already in progress. Finish the current review or use `pq abort`')
        return
      }

      await getPullRequest(id)
      startReview(id)

      const { ok: okStatus, error, data: status } = await openStatus()
      if (!okStatus) {
        console.error(error)
        return
      }

      const commits = await getPRCommits(id)
      await savePRCommits(commits)

      printInfo({
        repository: ctx.repo,
        pullRequest: String(id),
        status,
      }, 'STARTED A REVIEW')
    })

  return newCommand
}
