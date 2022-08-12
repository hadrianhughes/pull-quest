import * as os from 'os'
import * as path from 'path'
import * as sqlite3 from 'sqlite3'

export type PQDB = sqlite3.Database

export const PQ_DIRECTORY = '.pullquest'
export const DB_FILENAME = 'pq.db'

export const init = (): PQDB => new sqlite3.Database(path.resolve(os.homedir(), PQ_DIRECTORY, DB_FILENAME))
