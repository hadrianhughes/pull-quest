import { PQ_STRUCTURE } from '../domain'
import { FileResult } from '../utils'
import { appendFile, COMMENT_SEPARATOR, openFile } from './base'

export const openComments = async (): Promise<FileResult<string[]>> => {
  const file = await openFile(PQ_STRUCTURE.comments)
  return { ok: true, data: file.split(COMMENT_SEPARATOR).slice(0, -1) }
}

export const getCommentCount = async (): Promise<FileResult<number>> => {
  const { ok, error, data } = await openComments()
  if (!ok) {
    return { ok: false, error }
  }

  return { ok: true, data: data.length }
}

export const saveComment = async (file: string, lineNumber: number, commit: string, content: string): Promise<FileResult> => {
  const dataHeader = `${file}:${lineNumber}@${commit}`
  const data = [dataHeader, content, `${COMMENT_SEPARATOR}\n\n`].join('\n\n')

  await appendFile(PQ_STRUCTURE.comments, data)

  return { ok: true }
}
