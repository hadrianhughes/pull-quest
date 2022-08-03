import { Dict } from './types'

export const PQ_STRUCTURE: Dict<string> = {
  pr: 'pr',
  status: 'status',
}

export enum ReviewStatus {
  Comment = 'comment',
  RequestChanges = 'changes',
  Approved = 'approved',
}

export const statusFromString = (s: string): ReviewStatus => {
  switch (s) {
    case ReviewStatus.Comment:
      return ReviewStatus.Comment
    case ReviewStatus.RequestChanges:
      return ReviewStatus.RequestChanges
    case ReviewStatus.Approved:
      return ReviewStatus.Approved
    default:
      throw new Error(`error: ${s} is not a valid review status`)
  }
}