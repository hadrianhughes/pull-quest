import { Command } from 'commander'
import { display, openCommit } from '../files'
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

      const diffResult = options.file
        ? await produceDiffForFile(commit, options.file, true)
        : await produceDiff(commit, true)

      display(diffResult)
    })

  return diff
}
