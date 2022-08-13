import { Command } from 'commander'
import { PQDB } from '../database'
import { saveComment, takeEditorInput, openPR, openCommit } from '../files'

export const makeCommentCommand = (db: PQDB) => {
  const comment = new Command('comment')

  comment
    .argument('<file>', 'the file which the comment relates to')
    .argument('<line_number>', 'the line number in the file which the comment relates to')
    .action(async (file: string, lineNumber: number) => {
      const { ok: okPR, error: errorPR } = await openPR()
      if (!okPR) {
        console.info(errorPR)
      }

      const { data: msg } = await takeEditorInput()

      const { ok: okCommit, error: commitErr, data: commit } = await openCommit()
      if (!okCommit) {
        console.info(commitErr)
      }

      await saveComment(file, lineNumber, commit, msg)

      console.info(`Comment saved for ${file}:${lineNumber}:\n\n${msg}`)
    })

  return comment
}
