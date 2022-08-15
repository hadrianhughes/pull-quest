import { Command } from 'commander'
import { PQDB, getActiveReview, addComment } from '../database'
import { takeEditorInput } from '../files'
import { getFullRepo } from '../git'

export const makeCommentCommand = (db: PQDB) => {
  const comment = new Command('comment')

  comment
    .argument('<file>', 'the file which the comment relates to')
    .argument('<line_number>', 'the line number in the file which the comment relates to')
    .action(async (file: string, lineNumber: number) => {
      const repo = await getFullRepo()
      const review = await getActiveReview(db, repo)

      const { data: msg } = await takeEditorInput()

      await addComment(db, review.id, review.activeCommit, msg, file, lineNumber)

      console.info(`Comment added for ${file}:${lineNumber}:\n\n${msg}`)
    })

  return comment
}
