import { Command } from 'commander'
import { PQ_STRUCTURE } from '../domain'
import { displayEntry, openCommit } from '../files'
import { produceDiff, produceDiffForFile } from '../git'

export const makeDiffCommand = () => {
  const diff = new Command('diff')

  diff
    .option('-f, --file <string>', 'file to view the diff of')
    .action(async (options) => {
      const { ok: fileOK, error: fileError, data: commit } = await openCommit()
      if (!fileOK) {
        console.info(fileError)
        return
      }

      if (options.file) {
        await produceDiffForFile(commit, options.file)
      } else {
        await produceDiff(commit)
      }

      displayEntry(PQ_STRUCTURE.diff)
    })

  return diff
}
