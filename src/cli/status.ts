import { Command } from 'commander'
import { openPR, openStatus, saveStatus } from '../files'
import { ReviewStatus, statusIcons } from '../domain'

export const makeStatusCommand = () => {
  const statusSetter = (s: ReviewStatus) => async () => {
    const { ok, error } = await openPR()
    if (!ok) {
      console.info(error)
      return
    }

    saveStatus(s)

    console.info(`Review status: ${s} ${statusIcons[s]}`)
  }

  const status = new Command('status')

  status
    .action(async () => {
      const { ok: okPR, error: prError } = await openPR()
      if (!okPR) {
        console.info(prError)
        return
      }

      const { ok: okStatus, error: statusError, data: s } = await openStatus()
      if (!okStatus) {
        console.info(statusError)
        return
      }

      console.info(`Review status: ${s} ${statusIcons[s]}`)
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
