import { program, Command } from 'commander'
import { PQDB } from '../database'
import { makeAbortCommand } from './abort'
import { makeCommentCommand } from './comment'
import { makeDiffCommand } from './diff'
import { makeListCommentsCommand } from './list-comments'
import { makeBackCommand, makeNextCommand } from './navigate'
import { makeNewCommand } from './new'
import { makeStateCommand } from './state'
import { makeSubmitCommand } from './submit'
import { makeSummaryCommand } from './summary'

const commandFns = [
  makeAbortCommand,
  makeBackCommand,
  makeCommentCommand,
  makeDiffCommand,
  makeListCommentsCommand,
  makeNewCommand,
  makeNextCommand,
  makeStateCommand,
  makeSubmitCommand,
  makeSummaryCommand,
]

const initProgram = (db: PQDB): Command => {
  commandFns.forEach(f => program.addCommand(f(db)))
  return program
}

export default initProgram
