import * as clc from 'cli-color'
import { PQ_STRUCTURE } from '../domain'
import { FileResult } from '../utils'
import { appendFile, COMMENT_SEPARATOR, openFile } from './base'

export const openComments = async (): Promise<FileResult<string>> => {
  const file = await openFile(PQ_STRUCTURE.comments)
  const rawComments = file.split(COMMENT_SEPARATOR).slice(0, -1)
  const formattedComments = rawComments
    .map(c => {
      const trimmed = c.trim()
      const lines = trimmed.split('\n')

      const [_, _file, _line, _commit,] = lines[0].match(/^(.+?):(.+?)@(.+?)/)
      const body = lines.slice(1).join('\n')

      const printInfo = (label: string, value: string) => `${clc.bold(label)}:\t${value}`
      const fileLine = printInfo('File', _file)
      const lineLine = printInfo('Line', _line)
      const commitLine = printInfo('Commit', _commit)

      return [fileLine, lineLine, commitLine, body].join('\n')
    })
    .join('\n\n\n')

  return { ok: true, data: formattedComments }
}

export const saveComment = async (file: string, lineNumber: number, commit: string, content: string): Promise<FileResult> => {
  const dataHeader = `${file}:${lineNumber}@${commit}`
  const data = [dataHeader, content, `${COMMENT_SEPARATOR}\n\n`].join('\n\n')

  await appendFile(PQ_STRUCTURE.comments, data)

  return { ok: true }
}
