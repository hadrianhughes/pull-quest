import { program } from 'commander'
import { makeAbortCommand } from './abort'
import { makeCommentCommand } from './comment'
import { makeDiffCommand } from './diff'
import { makeBackCommand, makeNextCommand } from './navigate'
import { makeNewCommand } from './new'
import { makeStatusCommand } from './status'
import { makeSummaryCommand } from './summary'

program.addCommand(makeAbortCommand())
program.addCommand(makeNewCommand())
program.addCommand(makeStatusCommand())
program.addCommand(makeSummaryCommand())
program.addCommand(makeNextCommand())
program.addCommand(makeBackCommand())
program.addCommand(makeDiffCommand())
program.addCommand(makeCommentCommand())

export default program
