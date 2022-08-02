const program = require('./cli')
const { init } = require('./files')

const run = async () => {
  if (!process.env.PQ_GITHUB_ACCESS_TOKEN) {
    throw new Error('PQ_GITHUB_ACCESS_TOKEN environment variable not set')
  }

  await init()
  program.parse()
}

run()
