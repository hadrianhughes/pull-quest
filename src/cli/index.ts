import { program } from 'commander'
import { makeAbortCommand } from './abort'
import { makeNewCommand } from './new'
import { makeStatusCommand } from './status'
import { makeSummaryCommand } from './summary'

program.addCommand(makeAbortCommand())
program.addCommand(makeNewCommand())
program.addCommand(makeStatusCommand())
program.addCommand(makeSummaryCommand())

export default program
