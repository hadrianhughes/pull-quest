import { program } from 'commander'
import { makeAbortCommand } from './abort'
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

export default program
