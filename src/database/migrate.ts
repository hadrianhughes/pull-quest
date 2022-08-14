import { PQDB } from '.'

const statements = [
  `CREATE TABLE IF NOT EXISTS reviews(
    repository TEXT NOT NULL,
    pull_request INT NOT NULL,
    state TEXT CHECK(state IN ('comment', 'approved', 'changes')) NOT NULL,
    active INT NOT NULL,
    active_commit TEXT NOT NULL
  );`,
  `CREATE TABLE IF NOT EXISTS comments(
    commit_id TEXT NOT NULL,
    line INT,
    body TEXT NOT NULL,
    review INT NOT NULL,
    FOREIGN KEY (review) REFERENCES reviews (id)
  );`,
]

const migrate = async (db: PQDB) => {
  for (const s of statements) {
    await db.exec(s)
  }
}

export default migrate
