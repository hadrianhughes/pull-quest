import { spawn } from 'child_process'
import { getPathToEntry, saveDiff } from '../files'
import { run } from './base'

const formatDiff = (raw: string): string => {
  const lines = raw.split('\n')
  const diffHead = lines.slice(0, 6)

  const diffBody = lines.slice(6)
  const diffBodyWithNumbers = diffBody.map((l, i) => `${i + 1}\t${l}`)

  const fullDiff = [...diffHead, ...diffBodyWithNumbers].join('\n')

  return fullDiff
}

const displayDiff = async () => {
  const filePath = await getPathToEntry('diff')

  const displaySpawn = spawn('less', [filePath], {
    stdio: 'inherit',
    detached: true,
  })

  displaySpawn.on('exit', process.exit)
}

export const runDiff = async (commit: string) => {
  const diffFilesResult = await run(`git diff --name-only ${commit}^ ${commit}`, 'error getting files to diff')
  const diffFiles = diffFilesResult.split('\n')

  const diffs = []

  for (const f of diffFiles) {
    const rawDiff = await run(`git diff --color=always ${commit}^ ${commit} -- ${f}`, `error diffing file ${f} at commit ${commit}`)
    const formattedDiff = formatDiff(rawDiff)
    diffs.push(formattedDiff)
  }

  const diffsString = diffs.reduce((acc, d) => acc + `\n\n${d}`, '')
  await saveDiff(diffsString)

  displayDiff()
}

export const runDiffForFile = async (commit: string, file: string) => {
  const diffResult = await run(`git diff --color=always ${commit}^ ${commit} -- ${file}`, `error diffing file ${file} at commit ${commit}`)
  const formattedDiff = formatDiff(diffResult)

  await saveDiff(formattedDiff)

  displayDiff()
}
