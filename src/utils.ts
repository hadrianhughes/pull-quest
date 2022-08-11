import * as clc from 'cli-color'
import { ReviewStatus } from './domain'
import { DIFF_HEAD_SIZE } from './git'

export type Maybe<T> = T | null

export type Dict<T> = { [key: string]: T }

export type PrintableInfo = {
  repository: string;
  pullRequest: string;
  status: string;
}

export const infoPrecendence: (keyof PrintableInfo)[] = ['repository', 'pullRequest', 'status']

export const infoLabels: PrintableInfo = {
  repository: 'Repository',
  pullRequest: 'Pull Request',
  status: 'Status',
}

export const statusIcons = {
  [ReviewStatus.Comment]: '💬',
  [ReviewStatus.RequestChanges]: '🚧',
  [ReviewStatus.Approved]: '✅',
}

export const printInfo = (info: PrintableInfo, message?: string) => {
  if (message) console.info(message)

  infoPrecendence.forEach(key => {
    if (info[key]) console.info(`${infoLabels[key]}: ${info[key]}`)
  })
}

export type FileResult<T = unknown> = {
  ok: boolean;
  data?: T;
  error?: string;
}

export const getDiffSnippet = (diff: string, line: number): string => {
  const lineIndex = Math.max(0, line - 1)

  const diffLines = diff.split('\n').slice(DIFF_HEAD_SIZE)

  const color = (() => {
    if (/^\d+\t\+/.test(diffLines[lineIndex])) {
      return clc.white.bgGreen.bold
    }
    if (/^\d+\t-/.test(diffLines[lineIndex])) {
      return clc.white.bgRed.bold
    }
    return clc.white.bgBlackBright.bold
  })()

  const colorLine = color(diffLines[lineIndex])

  const start = Math.max(0, lineIndex - 5)
  const init = diffLines.slice(start, lineIndex)
  const tail = diffLines.slice(lineIndex + 1, lineIndex + 6)
  const snippet = [...init, colorLine, ...tail]

  return snippet.join('\n')
}
