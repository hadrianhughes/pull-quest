import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { Database } from 'sqlite3'
import * as sqlite from 'sqlite'

export type PQDB = sqlite.Database

export const PQ_DIRECTORY = '.pullquest'
export const DB_FILENAME = 'pq.db'

export const init = (): PQDB => {
  const pqPath = path.join(os.homedir(), PQ_DIRECTORY)
  if (!fs.existsSync(pqPath)) {
    fs.mkdirSync(pqPath)
  }

  return new sqlite.Database({
    filename: path.join(pqPath, DB_FILENAME),
    driver: Database,
  })
}
