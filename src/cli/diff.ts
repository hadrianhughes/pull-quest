import { Command } from 'commander'
import { openCommit } from '../files'
import { runDiff } from '../git'

export const makeDiffCommand = () => {
  const diff = new Command('diff')

  diff
    .action(async () => {
      const { ok: fileOK, error: fileError, data: commit } = await openCommit()
      if (!fileOK) {
        console.info(fileError)
        return
      }

      await runDiff(commit)
    })

  return diff
}
