import { program } from 'commander'
import * as promptly from 'promptly'
import { abortPR, getCurrentPR, startReview } from './files'
import { getPullRequest } from './github'

program.command('new')
  .argument('<pr_number>', 'number/id of the pull request for which to start a review')
  .action(async (id: number) => {
    const current = await getCurrentPR()
    if (current) {
      console.info('REVIEW ALREADY IN PROGRESS\nFinish the current review or use `pq abort`')
      return
    }

    const pr = await getPullRequest(id)
    startReview(id)
    console.info(`STARTED A REVIEW\nRepository:\t${pr.head.repo.full_name}\nPull Request:\t${id}`)
  })

program.command('summary')
  .action(async () => {
    const prNumber = await getCurrentPR()
    if (!prNumber) {
      console.info('NO REVIEW IN PROGRESS')
      return
    }

    const pr = await getPullRequest(prNumber)
    console.info(`REVIEW IN PROGRESS\nRepository:\t${pr.head.repo.full_name}\nPull Request:\t${prNumber}`)
  })

program.command('abort')
  .action(async () => {
    const prNumber = await getCurrentPR()
    if (!prNumber) {
      console.info('NO REVIEW IN PROGRESS')
      return
    }

    const c = await promptly.prompt('Confirm ABORT current review (y/N): ')
    if (c.toLowerCase() === 'y') {
      abortPR()
    }
  })

export default program
