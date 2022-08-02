const { exec } = require('child_process');

const run = cmd => new Promise((resolve, reject) => {
  exec(cmd, (error, stdout, stderr) => {
    if (error) return reject(error)
    if (stderr) return reject(stderr)
    resolve(stdout)
  })
})

const getRepoRoot = async () => {
  try {
    const stdout = await run('git rev-parse --show-toplevel')
    return stdout.trim()
  } catch (err) {
    throw new Error(`error getting repo root: ${err}`)
  }
}

module.exports = {
  getRepoRoot,
}
