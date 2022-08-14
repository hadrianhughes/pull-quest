import { Dict } from './utils'

export type PQContext = {
  repo: string
  pr?: number
}

export const PQ_STRUCTURE: Dict<string> = {
  pr: 'pr',
  state: 'state',
  prCommits: 'pr_commits',
  commit: 'commit',
  diff: 'diff',
  editBuffer: 'edit_buffer',
  viewBuffer: 'view_buffer',
  comments: 'comments',
}

export enum ReviewState {
  Comment = 'comment',
  RequestChanges = 'changes',
  Approved = 'approved',
}

export const stateFromString = (s: string): ReviewState => {
  switch (s) {
    case ReviewState.Comment:
      return ReviewState.Comment
    case ReviewState.RequestChanges:
      return ReviewState.RequestChanges
    case ReviewState.Approved:
      return ReviewState.Approved
    default:
      throw new Error(`error: ${s} is not a valid review state`)
  }
}

export type Comment = {
  id: number
  commit: string
  line?: number
  body: string
  repo: string
  pr: number
}

export type Review = {
  id: number
  repo: string
  pr: number
  state: ReviewState
  activeCommit: string
}
