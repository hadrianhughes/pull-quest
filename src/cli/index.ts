import { program, Command } from 'commander'
import { PQDB } from '../database'
import { PQContext } from '../domain'
import { makeAbortCommand } from './abort'
import { makeCommentCommand } from './comment'
import { makeDiffCommand } from './diff'
import { makeListCommentsCommand } from './list-comments'
import { makeBackCommand, makeNextCommand } from './navigate'
import { makeNewCommand } from './new'
import { makeStatusCommand } from './status'
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
  makeStatusCommand,
  makeSubmitCommand,
  makeSummaryCommand,
]

const initProgram = (db: PQDB, ctx: PQContext): Command => {
  commandFns.forEach(f => program.addCommand(f(db, ctx)))
  return program
}

export default initProgram
