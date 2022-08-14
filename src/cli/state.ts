import { Command } from 'commander'
import { PQDB, getActiveReview, setReviewState } from '../database'
import { getFullRepo } from '../git'
import { ReviewState } from '../domain'
import { stateIcons } from '../utils'

export const makeStateCommand = (db: PQDB) => {
  const stateSetter = (s: ReviewState) => async () => {
    const repo = await getFullRepo()

    await setReviewState(db, repo, s)

    console.info(`Review state: ${s} ${stateIcons[s]}`)
  }

  const state = new Command('state')

  state
    .action(async () => {
      const repo = await getFullRepo()

      const review = await getActiveReview(db, repo)
      if (!review) {
        console.info('No review in progress')
        return
      }

      console.info(`Review state: ${review.state} ${stateIcons[review.state]}`)
    })

    state
      .command('comment')
      .action(stateSetter(ReviewState.Comment))

    state
      .command('changes')
      .action(stateSetter(ReviewState.RequestChanges))

    state
      .command('approved')
      .action(stateSetter(ReviewState.Approved))

  return state
}
