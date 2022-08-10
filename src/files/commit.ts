import { PQ_STRUCTURE } from '../domain'
import { FileResult } from '../utils'
import { openFile, writeFile } from './base'

export const savePRCommits = async (ids: string[]): Promise<FileResult> => {
  const data = ids.join('\n')
  await writeFile(PQ_STRUCTURE.prCommits, data)

  return { ok: true }
}

export const openPRCommits = async (): Promise<FileResult<string[]>> => {
  const file = await openFile(PQ_STRUCTURE.prCommits)
  if (!file) {
    return { ok: false, error: 'No commits file present' }
  }

  return { ok: true, data: file.split('\n') }
}

export const openCommit = async (): Promise<FileResult<string>> => {
  const file = await openFile(PQ_STRUCTURE.commit)
  if (!file) {
    return { ok: false, error: 'No active commit file present' }
  }

  const commit = parseInt(file)

  const { ok, error, data: commits } = await openPRCommits()
  if (!ok) {
    return { ok: false, error }
  }

  return { ok: true, data: commits[commit] }
}

export const changeCommitBy = async (n: number): Promise<FileResult> => {
  const file = await openFile(PQ_STRUCTURE.commit)
  const commit = file ? parseInt(file) : 0

  const newCommit = commit + n
  if (newCommit < 0) {
    return { ok: false, error: `Already at the first commit` }
  }

  const commitsFile = await openFile(PQ_STRUCTURE.prCommits)
  const commits = commitsFile.split('\n')

  const numCommits = commits.length
  if (newCommit >= numCommits) {
    return { ok: false, error: 'Already at the last commit.\nUse `pq submit` if you\'ve finished your review.' }
  }

  writeFile(PQ_STRUCTURE.commit, String(newCommit))

  return { ok: true, data: commits[newCommit] }
}

export const nextCommit = () => changeCommitBy(1)

export const prevCommit = () => changeCommitBy(-1)

export const saveDiff = (diff: string) => writeFile(PQ_STRUCTURE.diff, diff)

