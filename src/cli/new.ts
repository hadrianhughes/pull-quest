import { Command } from 'commander'
import { openPR, openStatus, savePRCommits, startReview } from '../files'
import { getPRCommits, getPullRequest } from '../github'
import { printInfo } from '../utils'

export const makeNewCommand = () => {
  const newCommand = new Command('new')

  newCommand
    .argument('<pr_number>', 'number/id of the pull request for which to start a review')
    .action(async (id: number) => {
      const current = await openPR()
      if (current) {
        console.info('REVIEW ALREADY IN PROGRESS\nFinish the current review or use `pq abort`')
        return
      }

      const pr = await getPullRequest(id)
      startReview(id)

      const status = await openStatus()

      const commits = await getPRCommits(id)
      savePRCommits(commits)

      printInfo({
        repository: pr.head.repo.full_name,
        pullRequest: String(id),
        status,
      }, 'STARTED A REVIEW')
    })

  return newCommand
}
