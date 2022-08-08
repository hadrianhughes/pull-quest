import { Command } from 'commander'
import { openCommit } from '../files'
import { runDiff, runDiffForFile } from '../git'

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
        await runDiffForFile(commit, options.file)
      } else {
        await runDiff(commit)
      }
    })

  return diff
}
