const fs = require('fs')
const path = require('path')
const { getRepoRoot } = require('./git')

const DIR_NAME = '.pull-quest'

const touchDir = async dirPath => {
  const repoRoot = await getRepoRoot()
  const fullPath = path.join(repoRoot, DIR_NAME, dirPath)

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath)
  }

  return fullPath
}

const writeFile = async (name, data) => {
  const dir = await touchDir('')
  const fullPath = path.join(dir, name)
  return fs.writeFileSync(fullPath, data)
}

const initRootDir = () => touchDir('')

const startReview = async pr_number => {
  await initRootDir()
  writeFile('current_pr', String(pr_number))
}

module.exports = {
  startReview,
}
