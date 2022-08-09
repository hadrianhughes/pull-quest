import { spawn } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { getRepoRoot } from './git'
import { FileResult, Maybe } from './utils'
import { PQ_STRUCTURE, ReviewStatus, statusFromString } from './domain'

export const DIR_NAME = '.pull-quest'

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

const appendFile = async (filePath: string, data: string) => {
  const root = await touchRoot()
  const fullPath = path.join(root, filePath)
  fs.appendFileSync(fullPath, data)
}

const deleteFile = async (filePath: string) => {
  const root = await touchRoot()
  const fullPath = path.join(root, filePath)
  fs.unlinkSync(fullPath)
}

export const getPathToEntry = async (entry: keyof typeof PQ_STRUCTURE): Promise<string> => {
  const repoRoot = await getRepoRoot()
  return path.join(repoRoot, DIR_NAME, PQ_STRUCTURE[entry])
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

export const saveStatus = async (s: ReviewStatus): Promise<FileResult> => {
  await writeFile(PQ_STRUCTURE.status, s)

  return { ok: true }
}

export const savePRCommits = async (ids: string[]): Promise<FileResult> => {
  const data = ids.join('\n')
  await writeFile(PQ_STRUCTURE.prCommits, data)

  return { ok: true }
}

export const saveComment = async (file: string, lineNumber: number, commit: string, content: string): Promise<FileResult> => {
  const dataHeader = `${file}:${lineNumber}@${commit}`
  const data = [dataHeader, content, '--PQ END OF COMMENT--\n\n'].join('\n\n')

  await appendFile(PQ_STRUCTURE.comments, data)

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

export const displayEntry = async (entry: keyof typeof PQ_STRUCTURE) => {
  const filePath = await getPathToEntry(entry)

  const displaySpawn = spawn('less', [filePath], {
    stdio: 'inherit',
    detached: true,
  })

  displaySpawn.on('exit', process.exit)
}

export const takeEditorInput = async (): Promise<FileResult<string>> => {
  await deleteFile(PQ_STRUCTURE.editBuffer)
  await writeFile(PQ_STRUCTURE.editBuffer, '\n# Enter input in this buffer\n# Lines starting with # are ignored')

  const filePath = await getPathToEntry('editBuffer')

  const editSpawn = spawn('vim', [filePath], {
    stdio: 'inherit',
    detached: true,
  })

  await new Promise(resolve => {
    editSpawn.on('exit', resolve)
  })

  const input = await openFile(PQ_STRUCTURE.editBuffer)
  const prunedInput = input
    .split('\n')
    .filter(l => !/^#/.test(l))
    .join('\n')

  return { ok: true, data: prunedInput }
}
