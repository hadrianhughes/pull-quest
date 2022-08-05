import { exec, spawn } from 'child_process'

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
  const lessSpawn = spawn('git', ['diff', commit], {
    stdio: 'inherit',
    detached: true,
  })

  lessSpawn.on('exit', process.exit)
}
