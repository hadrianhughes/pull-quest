import { program } from 'commander'
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

commandFns.forEach(f => program.addCommand(f()))

export default program
