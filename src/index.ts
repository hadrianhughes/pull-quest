import initProgram from './cli'
import { init } from './database'
import { PQContext } from './domain'
import { getRepoRoot } from './git'

const run = async () => {
  if (!process.env.PQ_GITHUB_ACCESS_TOKEN) {
    throw new Error('PQ_GITHUB_ACCESS_TOKEN environment variable not set')
  }

  const repoRoot = await getRepoRoot()

  const ctx: PQContext = { repo: repoRoot }
  const db = init()

  const program = initProgram(db, ctx)

  program.parse()
}

run()
