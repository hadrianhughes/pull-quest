import * as os from 'os'
import * as path from 'path'
import { Database } from 'sqlite3'
import * as sqlite from 'sqlite'

export type PQDB = sqlite.Database

export const PQ_DIRECTORY = '.pullquest'
export const DB_FILENAME = 'pq.db'

export const init = (): PQDB => new sqlite.Database({
  filename: path.resolve(os.homedir(), PQ_DIRECTORY, DB_FILENAME),
  driver: Database,
})
