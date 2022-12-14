import { exec as _exec } from 'child_process'

const exec = (cmd: string): Promise<string> => new Promise((resolve, reject) => {
  _exec(cmd, (error, stdout, stderr) => {
    if (error) return reject(error)
    if (stderr) return reject(stderr)
    resolve(stdout)
  })
})

export const detailsFromRemote = (remote: string) => {
  const match = remote.match(/^.+(?::|\/)(.+)\/(.+)\.git$/)
  if (match.length < 3) {
    throw new Error(`error parsing remote: ${remote}`)
  }

  return {
    owner: match[1],
    repo: match[2],
  }
}

export const run = async (command: string, errorText: string): Promise<string> => {
  try {
    const stdout = await exec(command)
    return stdout.trim()
  } catch (err) {
    throw new Error(`${errorText}: ${err}`)
  }
}

export const getRepoRoot = () => run('git rev-parse --show-toplevel', 'error getting repo root')

export const getRemote = () => run('git remote get-url origin', 'error getting remote')

export const getFullRepo = async (): Promise<string> => {
  const remote = await getRemote()
  const { owner, repo } = detailsFromRemote(remote)
  const fullRepo = `${owner}/${repo}`

  return fullRepo
}
