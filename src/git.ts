import { exec, spawn } from 'child_process'
import { getPathToEntry, saveDiff } from './files'

const _exec = (cmd: string): Promise<string> => new Promise((resolve, reject) => {
  exec(cmd, (error, stdout, stderr) => {
    if (error) return reject(error)
    if (stderr) return reject(stderr)
    resolve(stdout)
  })
})

const run = async (command: string, errorText: string): Promise<string> => {
  try {
    const stdout = await _exec(command)
    return stdout.trim()
  } catch (err) {
    throw new Error(`${errorText}: ${err}`)
  }
}

export const getRepoRoot = () => run('git rev-parse --show-toplevel', 'error getting repo root')

export const getRemote = () => run('git remote get-url origin', 'error getting remote')

export const runDiff = async (commit: string) => {
  const diffFilesResult = await run(`git diff --name-only ${commit}`, 'error getting files to diff')
  const diffFiles = diffFilesResult.split('\n')

  const diffs = []

  for (const f of diffFiles) {
    const rawDiff = await run(`git diff --color=always ${commit} -- ${f}`, `error diffing file ${f} at commit ${commit}`)
    const diffLines = rawDiff.split('\n')
    const diffHead = diffLines.slice(0, 6)

    const diffBody = diffLines.slice(6)
    const diffBodyWithNumbers = diffBody.map((l, i) => `${i + 1}\t${l}`)

    const fullDiff = [...diffHead, ...diffBodyWithNumbers].join('\n')
    diffs.push(fullDiff)
  }

  const diffsString = diffs.reduce((acc, d) => acc + `\n\n${d}`, '')
  await saveDiff(diffsString)

  const filePath = await getPathToEntry('diff')

  const displaySpawn = spawn('less', [filePath], {
    stdio: 'inherit',
    detached: true,
  })

  displaySpawn.on('exit', process.exit)
}
