import * as fs from 'fs'
import * as path from 'path'
import { getRepoRoot } from './git'
import { FileResult, Maybe } from './utils'
import { PQ_STRUCTURE, ReviewStatus, statusFromString } from './domain'

const DIR_NAME = '.pull-quest'

const touchRoot = async (): Promise<string> => {
  const repoRoot = await getRepoRoot()
  const fullPath = path.join(repoRoot, DIR_NAME)

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath)
  }

  return fullPath
}

const openFile = async (filePath: string): Promise<Maybe<string>> => {
  const root = await touchRoot()
  const fullPath = path.join(root, filePath)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  return fs.readFileSync(fullPath, { encoding: 'utf8' })
}

const writeFile = async (filePath: string, data: string) => {
  const root = await touchRoot()
  const fullPath = path.join(root, filePath)
  fs.writeFileSync(fullPath, data)
}

const deleteFile = async (filePath: string) => {
  const root = await touchRoot()
  const fullPath = path.join(root, filePath)
  fs.unlinkSync(fullPath)
}

export const startReview = async (prNumber: number): Promise<FileResult> => {
  await touchRoot()

  writeFile(PQ_STRUCTURE.pr, String(prNumber))
  writeFile(PQ_STRUCTURE.status, ReviewStatus.Comment)
  writeFile(PQ_STRUCTURE.commit, '0')

  return { ok: true }
}

export const openPR = async (): Promise<FileResult<number>> => {
  const file = await openFile(PQ_STRUCTURE.pr)
  if (!file) {
    return { ok: false, error: 'No pull request file present' }
  }

  return { ok: true, data: parseInt(file) }
}

export const openStatus = async (): Promise<FileResult<ReviewStatus>> => {
  const file = await openFile(PQ_STRUCTURE.status)
  if (!file) {
    writeFile(PQ_STRUCTURE.status, ReviewStatus.Comment)
    return { ok: true, data: ReviewStatus.Comment }
  }

  return { ok: true, data: statusFromString(file) }
}

export const abortPR = async (): Promise<FileResult> => {
  const root = await touchRoot()

  Object.keys(PQ_STRUCTURE).map(k => {
    if (fs.existsSync(path.join(root, PQ_STRUCTURE[k]))) {
      deleteFile(PQ_STRUCTURE[k])
    }
  })

  return { ok: true }
}

export const saveStatus = (s: ReviewStatus): FileResult => {
  writeFile(PQ_STRUCTURE.status, s)

  return { ok: true }
}

export const savePRCommits = (ids: string[]): FileResult => {
  const data = ids.join('\n')
  writeFile(PQ_STRUCTURE.prCommits, data)

  return { ok: true }
}

export const openPRCommits = async (): Promise<FileResult<string[]>> => {
  const file = await openFile(PQ_STRUCTURE.prCommits)
  if (!file) {
    return { ok: false, error: 'No commits file present' }
  }

  return { ok: true, data: file.split('\n') }
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
    return { ok: false, error: 'Already at the last commit' }
  }

  writeFile(PQ_STRUCTURE.commit, String(newCommit))

  return { ok: true, data: commits[newCommit] }
}

export const nextCommit = () => changeCommitBy(1)

export const prevCommit = () => changeCommitBy(-1)
