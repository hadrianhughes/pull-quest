import { spawn } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { getRepoRoot } from '../git'
import { FileResult, Maybe } from '../utils'
import { PQ_STRUCTURE } from '../domain'

export const DIR_NAME = '.pull-quest'

export const COMMENT_SEPARATOR = '--PQ END OF COMMENT--'

export const touchRoot = async (): Promise<string> => {
  const repoRoot = await getRepoRoot()
  const fullPath = path.join(repoRoot, DIR_NAME)

  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath)
  }

  return fullPath
}

export const openFile = async (filePath: string): Promise<Maybe<string>> => {
  const root = await touchRoot()
  const fullPath = path.join(root, filePath)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  return fs.readFileSync(fullPath, { encoding: 'utf8' })
}

export const writeFile = async (filePath: string, data: string) => {
  const root = await touchRoot()
  const fullPath = path.join(root, filePath)
  fs.writeFileSync(fullPath, data)
}

export const appendFile = async (filePath: string, data: string) => {
  const root = await touchRoot()
  const fullPath = path.join(root, filePath)
  fs.appendFileSync(fullPath, data)
}

export const deleteFile = async (filePath: string) => {
  const root = await touchRoot()
  const fullPath = path.join(root, filePath)
  fs.unlinkSync(fullPath)
}

export const getPathToEntry = async (entry: keyof typeof PQ_STRUCTURE): Promise<string> => {
  const repoRoot = await getRepoRoot()
  return path.join(repoRoot, DIR_NAME, PQ_STRUCTURE[entry])
}

export const display = async (data: string) => {
  await writeFile(PQ_STRUCTURE.viewBuffer, data)

  const viewPath = await getPathToEntry('viewBuffer')

  const displaySpawn = spawn('less', [viewPath], {
    stdio: 'inherit',
    detached: true,
  })

  displaySpawn.on('exit', process.exit)
}

export const takeEditorInput = async (): Promise<FileResult<string>> => {
  const bufferPath = await getPathToEntry('editBuffer')

  if (fs.existsSync(bufferPath)) {
    await deleteFile(PQ_STRUCTURE.editBuffer)
  }

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
