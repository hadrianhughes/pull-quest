import { Command, program } from 'commander'
import * as promptly from 'promptly'
import { ReviewStatus } from './domain'
import { abortPR, getPR, getStatus, setStatus, startReview } from './files'
import { getPullRequest } from './github'

program.command('new')
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

program.command('summary')
  .action(async () => {
    const prNumber = await getPR()
    if (!prNumber) {
      console.info('NO REVIEW IN PROGRESS')
      return
    }

    const status = await getStatus()

    const pr = await getPullRequest(prNumber)
    console.info(`REVIEW IN PROGRESS\nRepository:\t${pr.head.repo.full_name}\nPull Request:\t${prNumber}\nStatus:\t${status}`)
  })

program.command('abort')
  .action(async () => {
    const prNumber = await getPR()
    if (!prNumber) {
      console.info('NO REVIEW IN PROGRESS')
      return
    }

    const c = await promptly.prompt('Confirm ABORT current review (y/N): ')
    if (c.toLowerCase() === 'y') {
      abortPR()
    }
  })

const makeStatusCommand = () => {
  const statusSetter = (s: ReviewStatus) => async () => {
    const prNumber = await getPR()
    if (!prNumber) {
      console.info('NO REVIEW IN PROGRESS')
      return
    }

    setStatus(s)

    console.info(`Review status: ${s}`)
  }

  const status = new Command('status')

  status
    .action(async () => {
      const prNumber = await getPR()
      if (!prNumber) {
        console.info('NO REVIEW IN PROGRESS')
        return
      }

      const status = await getStatus()
      console.info(`Review status: ${status}`)
    })

    status
      .command('comment')
      .action(statusSetter(ReviewStatus.Comment))

    status
      .command('changes')
      .action(statusSetter(ReviewStatus.RequestChanges))

    status
      .command('approved')
      .action(statusSetter(ReviewStatus.Approved))

  return status
}

program.addCommand(makeStatusCommand())

export default program
