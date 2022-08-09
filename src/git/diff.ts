import { saveDiff } from '../files'
import { run } from './base'

const formatDiff = (raw: string): string => {
  const lines = raw.split('\n')
  const diffHead = lines.slice(0, 6)

  const diffBody = lines.slice(6)
  const diffBodyWithNumbers = diffBody.map((l, i) => `${i + 1}\t${l}`)

  const fullDiff = [...diffHead, ...diffBodyWithNumbers].join('\n')

  return fullDiff
}

const diffFileCommit = async (commit: string, file: string): Promise<string> => {
  const rawDiff = await run(`git diff --color=always ${commit}^ ${commit} -- ${file}`, `error diffing file ${file} at commit ${commit}`)
  return formatDiff(rawDiff)
}

export const getChangedFiles = async (commit: string): Promise<string[]> => {
  const result = await run(`git diff --name-only ${commit}^ ${commit}`, 'error getting files to diff')
  const files = result.split('\n')
  return files
}

export const produceDiff = async (commit: string) => {
  const diffFiles = await getChangedFiles(commit)
  const diffs: string[] = []

  for (const f of diffFiles) {
    const d = await diffFileCommit(commit, f)
    diffs.push(d)
  }

  const diffsString = diffs.reduce((acc, d) => acc + `\n\n${d}`, '')
  await saveDiff(diffsString)
}

export const produceDiffForFile = async (commit: string, file: string) => {
  const diff = await diffFileCommit(commit, file)
  await saveDiff(diff)
}
