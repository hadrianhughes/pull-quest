import { PQDB } from '.'

const statements = [
  `CREATE TABLE IF NOT EXISTS comments(
    id INT PRIMARY KEY NOT NULL,
    commit_id TEXT NOT NULL,
    line INT,
    repository TEXT NOT NULL,
    body TEXT NOT NULL,
    pull_request INT NOT NULL
  );`
]

const migrate = async (db: PQDB) => {
  for (const s of statements) {
    await db.exec(s)
  }
}

export default migrate
