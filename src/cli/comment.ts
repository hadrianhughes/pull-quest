import { Command } from 'commander'
import { saveComment, takeEditorInput, openPR } from '../files'

export const makeCommentCommand = () => {
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
      await saveComment(file, lineNumber, msg)

      console.info(`Comment saved for ${file}:${lineNumber}:\n\n${msg}`)
    })

  return comment
}
