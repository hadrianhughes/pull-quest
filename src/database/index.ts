import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import * as sqlite3 from 'sqlite3'
import { open as openDB, Database } from 'sqlite'
import migrate from './migrate'

export type PQDB = Database

export const PQ_DIRECTORY = '.pullquest'
export const DB_FILENAME = 'pq.db'

export const init = async (): Promise<PQDB> => {
  const pqPath = path.join(os.homedir(), PQ_DIRECTORY)
  if (!fs.existsSync(pqPath)) {
    fs.mkdirSync(pqPath)
  }

  const dbPath = path.join(pqPath, DB_FILENAME)

  const db = await openDB({
    filename: dbPath,
    driver: sqlite3.Database,
  })

  await migrate(db)

  return db
}

export { getComments } from './comments'
export { addReview, setActiveReview, getActiveReview } from './reviews'
