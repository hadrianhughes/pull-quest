import { Command } from 'commander'
import { openPR, openStatus, saveStatus } from '../files'
import { ReviewStatus } from '../domain'

export const makeStatusCommand = () => {
  const statusSetter = (s: ReviewStatus) => async () => {
    const prNumber = await openPR()
    if (!prNumber) {
      console.info('NO REVIEW IN PROGRESS')
      return
    }

    saveStatus(s)

    console.info(`Review status: ${s}`)
  }

  const status = new Command('status')

  status
    .action(async () => {
      const prNumber = await openPR()
      if (!prNumber) {
        console.info('NO REVIEW IN PROGRESS')
        return
      }

      const status = await openStatus()
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
