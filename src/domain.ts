import { Dict } from './utils'

export type PQContext = {
  repo: string
  pr: number
}

export const PQ_STRUCTURE: Dict<string> = {
  pr: 'pr',
  status: 'status',
  prCommits: 'pr_commits',
  commit: 'commit',
  diff: 'diff',
  editBuffer: 'edit_buffer',
  viewBuffer: 'view_buffer',
  comments: 'comments',
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
