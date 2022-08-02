const fs = require('fs')
const path = require('path')
const { getRepoRoot } = require('./git')

const DIR_NAME = '.pull-quest'

const init = async () => {
  const repoRoot = await getRepoRoot()
  const dirPath = path.join(repoRoot, DIR_NAME)

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
  }
}

module.exports = {
  init,
}
