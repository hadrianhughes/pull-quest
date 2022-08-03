import * as fs from 'fs'
import * as path from 'path'
import { getRepoRoot } from './git'
import { Maybe } from './types'

const DIR_NAME = '.pull-quest'

const PQ_STRUCTURE = {
  currentPr: 'current_pr',
}

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
  writeFile(PQ_STRUCTURE.currentPr, String(pr_number))
}

export const getCurrentPR = async (): Promise<Maybe<number>> => {
  const file = await openFile(PQ_STRUCTURE.currentPr)
  if (!file) {
    return null
  }

  return parseInt(file)
}

export const abortPR = () => {
  deleteFile(PQ_STRUCTURE.currentPr)
}
