import { PQ_STRUCTURE } from '../domain'
import { FileResult } from '../utils'
import { appendFile, COMMENT_SEPARATOR, openFile } from './base'

export const openComments = async (): Promise<FileResult<string>> => {
  const file = await openFile(PQ_STRUCTURE.comments)
  const rawComments = file.split(COMMENT_SEPARATOR).slice(0, -1)
  const formattedComments = rawComments
    .map(c => c.trim())
    .join('\n\n')

  return { ok: true, data: formattedComments }
}

export const saveComment = async (file: string, lineNumber: number, commit: string, content: string): Promise<FileResult> => {
  const dataHeader = `${file}:${lineNumber}@${commit}`
  const data = [dataHeader, content, `${COMMENT_SEPARATOR}\n\n`].join('\n\n')

  await appendFile(PQ_STRUCTURE.comments, data)

  return { ok: true }
}
