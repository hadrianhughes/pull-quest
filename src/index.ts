import initProgram from './cli'
import { init } from './database'

const run = async () => {
  if (!process.env.PQ_GITHUB_ACCESS_TOKEN) {
    throw new Error('PQ_GITHUB_ACCESS_TOKEN environment variable not set')
  }

  const db = await init()

  const program = initProgram(db)

  program.parse()
}

run()
