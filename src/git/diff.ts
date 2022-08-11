import { run } from './base'

export const DIFF_HEAD_SIZE = 6

const formatDiff = (raw: string): string => {
  const lines = raw.split('\n')
  const diffHead = lines.slice(0, DIFF_HEAD_SIZE)

  const diffBody = lines.slice(DIFF_HEAD_SIZE)
  const diffBodyWithNumbers = diffBody.map((l, i) => `${i + 1}\t${l}`)

  const fullDiff = [...diffHead, ...diffBodyWithNumbers].join('\n')

  return fullDiff
}

export const diffFileCommit = async (commit: string, file: string, color?: boolean): Promise<string> => {
  const colorArg = color ? '--color=always' : ''
  const rawDiff = await run(`git diff ${colorArg} ${commit}^ ${commit} -- ${file}`, `error diffing file ${file} at commit ${commit}`)
  return formatDiff(rawDiff)
}

export const getChangedFiles = async (commit: string): Promise<string[]> => {
  const result = await run(`git diff --name-only ${commit}^ ${commit}`, 'error getting files to diff')
  const files = result.split('\n')
  return files
}

export const produceDiff = async (commit: string, color?: boolean): Promise<string> => {
  const diffFiles = await getChangedFiles(commit)
  const diffs: string[] = []

  for (const f of diffFiles) {
    const d = await diffFileCommit(commit, f, color)
    diffs.push(d)
  }

  const diffsString = diffs.reduce((acc, d) => acc + `\n\n${d}`, '')
  return diffsString
}
