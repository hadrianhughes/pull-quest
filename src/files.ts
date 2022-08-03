import * as fs from 'fs'
import * as path from 'path'
import { getRepoRoot } from './git'
import { Maybe } from './types'
import { PQ_STRUCTURE, ReviewStatus, statusFromString } from './domain'

const DIR_NAME = '.pull-quest'

const touchDir = async (dirPath: string) => {
  const repoRoot = await getRepoRoot()
  const fullPath = path.join(repoRoot, DIR_NAME, dirPath)

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath)
  }

  return fullPath
}

const touchRoot = () => touchDir(DIR_NAME)

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
  return fs.writeFileSync(fullPath, data)
}

const deleteFile = async (filePath: string) => {
  const root = await touchRoot()
  const fullPath = path.join(root, filePath)
  return fs.unlinkSync(fullPath)
}

export const startReview = async (pr_number: number) => {
  await touchRoot()
  writeFile(PQ_STRUCTURE.pr, String(pr_number))
  writeFile(PQ_STRUCTURE.status, ReviewStatus.Comment)
}

export const getPR = async (): Promise<Maybe<number>> => {
  const file = await openFile(PQ_STRUCTURE.pr)
  if (!file) {
    return null
  }

  return parseInt(file)
}

export const getStatus = async (): Promise<ReviewStatus> => {
  const file = await openFile(PQ_STRUCTURE.status)
  if (!file) {
    writeFile(PQ_STRUCTURE.status, ReviewStatus.Comment)
    return ReviewStatus.Comment
  }

  return statusFromString(file)
}

export const abortPR = () => {
  Object.keys(PQ_STRUCTURE).map(k => deleteFile(PQ_STRUCTURE[k]))
}

export const setStatus = (s: ReviewStatus) => {
  writeFile(PQ_STRUCTURE.status, s)
}
