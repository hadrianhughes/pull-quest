import { program } from 'commander'
import { startReview } from './files'
import { getPullRequest } from './github'

program.command('new')
  .argument('<pr_number>', 'number/id of the pull request for which to start a review')
  .action(async (id: number) => {
    const pr = await getPullRequest(id)
    startReview(id)
    console.info(`Started a review\nRepository:\t${pr.head.repo.full_name}\nPull Request:\t${id}`)
  })

export default program
