import * as fs from 'fs'
import * as path from 'path'
import { PQ_STRUCTURE, ReviewStatus, statusFromString } from '../domain'
import { FileResult } from '../utils'
import { deleteFile, openFile, touchRoot, writeFile } from './base'

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
