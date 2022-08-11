import * as clc from 'cli-color'
import { PQ_STRUCTURE } from '../domain'
import { getDiffSnippet, FileResult } from '../utils'
import { appendFile, COMMENT_SEPARATOR, openFile } from './base'
import { diffFileCommit } from '../git'

export const openComments = async (): Promise<FileResult<string>> => {
  const file = await openFile(PQ_STRUCTURE.comments)
  const rawComments = file.split(COMMENT_SEPARATOR).slice(0, -1)
  const commentsData = rawComments
    .map(c => {
      const trimmed = c.trim()
      const lines = trimmed.split('\n')

      const [_, _file, _line, _commit] = lines[0].match(/^(.+?):(.+?)@(.+)/)
      const body = lines.slice(1).join('\n')

      return { file: _file, line: parseInt(_line), commit: _commit, body }
    })

  const formattedComments = []

  for (const c of commentsData) {
    const printInfo = (label: string, value: string) => `${clc.bold(label)}:\t${value}`
    const fileLine = printInfo('File', c.file)
    const lineLine = printInfo('Line', String(c.line))
    const commitLine = printInfo('Commit', c.commit)

    const diff = await diffFileCommit(c.commit, c.file, false)
    const diffSnippet = getDiffSnippet(diff, c.line)

    formattedComments.push([`${diffSnippet}\n`, fileLine, lineLine, commitLine, c.body].join('\n'))
  }

  return { ok: true, data: formattedComments.join('\n\n\n') }
}

export const saveComment = async (file: string, lineNumber: number, commit: string, content: string): Promise<FileResult> => {
  const dataHeader = `${file}:${lineNumber}@${commit}`
  const data = [dataHeader, content, `${COMMENT_SEPARATOR}\n\n`].join('\n\n')

  await appendFile(PQ_STRUCTURE.comments, data)

  return { ok: true }
}
