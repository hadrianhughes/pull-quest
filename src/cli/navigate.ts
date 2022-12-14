import { Command } from 'commander'
import { PQDB } from '../database'
import { nextCommit, prevCommit } from '../files'
import { FileResult } from '../utils'

const navigateHandler = (fn: () => Promise<FileResult>) => async () => {
  const result = await fn()
  if (!result.ok) {
    console.info(result.error)
    return
  }

  console.info(`Changed to commit: ${result.data}`)
}

export const makeNextCommand = (db: PQDB) => {
  const next = new Command('next')
  next.action(navigateHandler(nextCommit))
  return next
}

export const makeBackCommand = (db: PQDB) => {
  const back = new Command('back')
  back.action(navigateHandler(prevCommit))
  return back
}
