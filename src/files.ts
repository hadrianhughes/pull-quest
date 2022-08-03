import * as fs from 'fs'
import * as path from 'path'
import { getRepoRoot } from './git'

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

const writeFile = async (name: string, data: string) => {
  const dir = await touchDir('')
  const fullPath = path.join(dir, name)
  return fs.writeFileSync(fullPath, data)
}

const initRootDir = () => touchDir('')

export const startReview = async (pr_number: number) => {
  await initRootDir()
  writeFile(PQ_STRUCTURE.currentPr, String(pr_number))
}
