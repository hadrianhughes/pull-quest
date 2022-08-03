import program from './cli'

const run = async () => {
  if (!process.env.PQ_GITHUB_ACCESS_TOKEN) {
    throw new Error('PQ_GITHUB_ACCESS_TOKEN environment variable not set')
  }

  program.parse()
}

run()
