import { PQDB } from '.'

const statements = [
  `CREATE TABLE IF NOT EXISTS comments(
    id INT PRIMARY KEY NOT NULL,
    commit_id TEXT NOT NULL,
    line INT,
    body TEXT NOT NULL,
    review INT NOT NULL,
    FOREIGN KEY (review) REFERENCES reviews (id)
  );`,
  `CREATE TABLE IF NOT EXISTS reviews(
    id INT PRIMARY KEY NOT NULL,
    repository TEXT NOT NULL,
    pull_request INT NOT NULL,
    state TEXT CHECK(state IN ('comment', 'approved', 'changes')) NOT NULL,
    active INT NOT NULL
  );`,
]

const migrate = async (db: PQDB) => {
  for (const s of statements) {
    await db.exec(s)
  }
}

export default migrate