import { Command } from 'commander'
import { PQDB } from '../database'
import { PQContext } from '../domain'
import { display, openCommit } from '../files'
import { produceDiff, diffFileCommit } from '../git'

export const makeDiffCommand = (db: PQDB, ctx: PQContext) => {
  const diff = new Command('diff')

  diff
    .option('-f, --file <string>', 'file to view the diff of')
    .action(async (options) => {
      const { ok: fileOK, error: fileError, data: commit } = await openCommit()
      if (!fileOK) {
        console.info(fileError)
        return
      }

      const diffResult = options.file
        ? await diffFileCommit(commit, options.file, true)
        : await produceDiff(commit, true)

      display(diffResult)
    })

  return diff
}
