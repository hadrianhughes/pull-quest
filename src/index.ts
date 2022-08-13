import initProgram from './cli'
import { init } from './database'
import { PQContext } from './domain'
import { getRemote } from './git'
import { detailsFromRemote } from './github'

const run = async () => {
  if (!process.env.PQ_GITHUB_ACCESS_TOKEN) {
    throw new Error('PQ_GITHUB_ACCESS_TOKEN environment variable not set')
  }

  const remote = await getRemote()
  const { owner, repo } = detailsFromRemote(remote)

  const ctx: PQContext = { repo: `${owner}/${repo}` }
  const db = await init()

  const program = initProgram(db, ctx)

  program.parse()
}

run()
