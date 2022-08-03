import { Command } from 'commander'
import { getPR, startReview } from '../files'
import { getPullRequest } from '../github'

export const makeNewCommand = () => {
  const newCommand = new Command('new')

  newCommand
    .argument('<pr_number>', 'number/id of the pull request for which to start a review')
    .action(async (id: number) => {
      const current = await getPR()
      if (current) {
        console.info('REVIEW ALREADY IN PROGRESS\nFinish the current review or use `pq abort`')
        return
      }

      const pr = await getPullRequest(id)
      startReview(id)
      console.info(`STARTED A REVIEW\nRepository:\t${pr.head.repo.full_name}\nPull Request:\t${id}`)
    })

  return newCommand
}
