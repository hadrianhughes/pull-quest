import { program } from 'commander'
import { getCurrentPR, startReview } from './files'
import { getPullRequest } from './github'

program.command('new')
  .argument('<pr_number>', 'number/id of the pull request for which to start a review')
  .action(async (id: number) => {
    const pr = await getPullRequest(id)
    startReview(id)
    console.info(`STARTED A REVIEW\nRepository:\t${pr.head.repo.full_name}\nPull Request:\t${id}`)
  })

program.command('status')
  .action(async () => {
    const prNumber = await getCurrentPR()
    if (!prNumber) {
      console.info('NO REVIEW IN PROGRESS')
      return
    }

    const pr = await getPullRequest(prNumber)
    console.info(`REVIEW IN PROGRESS\nRepository:\t${pr.head.repo.full_name}\nPull Request:\t${prNumber}`)
  })

export default program
