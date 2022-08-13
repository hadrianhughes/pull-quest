import { Command } from 'commander'
import { PQDB } from '../database'
import { openPR, openState, saveState } from '../files'
import { ReviewState } from '../domain'
import { stateIcons } from '../utils'

export const makeStateCommand = (db: PQDB) => {
  const stateSetter = (s: ReviewState) => async () => {
    const { ok, error } = await openPR()
    if (!ok) {
      console.info(error)
      return
    }

    saveState(s)

    console.info(`Review state: ${s} ${stateIcons[s]}`)
  }

  const state = new Command('state')

  state
    .action(async () => {
      const { ok: okPR, error: prError } = await openPR()
      if (!okPR) {
        console.info(prError)
        return
      }

      const { ok: okState, error: stateError, data: s } = await openState()
      if (!okState) {
        console.info(stateError)
        return
      }

      console.info(`Review state: ${s} ${stateIcons[s]}`)
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
