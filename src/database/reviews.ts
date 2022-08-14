import { Review, ReviewState, stateFromString } from '../domain'
import { Maybe } from '../utils'
import { PQDB } from '.'

export const addReview = async (db: PQDB, repo: string, pr: number, state: ReviewState): Promise<Review> => {
  const { lastID, changes } = await db.run(
    'INSERT INTO reviews (repository, pull_request, state, active) VALUES (?, ?, ?, 0);',
    [repo, pr, state],
  )

  if (changes === 0) {
    throw new Error(`error inserting into reviews table: { repo: ${repo}, pr: ${pr}, state: ${state} }`)
  }

  return { id: lastID, repo, pr, state: state }
}

export const setActiveReview = async (db: PQDB, repo: string, pr: number): Promise<Review> => {
  await db.run('UPDATE reviews SET active = 0 WHERE active = 1;')

  const { changes, lastID } = await db.run(
    'UPDATE reviews SET active = 1 WHERE repository = ? AND pull_request = ?;',
    [repo, pr],
  )

  if (changes === 0) {
    throw new Error(`error setting row active in reviews table: { repo: ${repo}, pr: ${pr} }`)
  }

  const row = await db.get(
    'SELECT rowid, repository, pull_request, state FROM reviews WHERE rowid = ?',
    [lastID],
  )

  return {
    id: row.rowid,
    repo: row.repository,
    pr: row.pull_request,
    state: stateFromString(row.state),
  }
}

export const getActiveReview = async (db: PQDB, repo: string): Promise<Maybe<Review>> => {
  const row = await db.get(
    'SELECT rowid, repository, pull_request, state FROM reviews WHERE repository = ? AND active = 1;',
    [repo],
  )

  if (!row) {
    return null
  }

  return {
    id: row.rowid,
    repo: row.repository,
    pr: row.pull_request,
    state: stateFromString(row.state),
  }
}
