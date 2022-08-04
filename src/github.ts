import { GetResponseDataTypeFromEndpointMethod } from '@octokit/types'
import { Octokit } from 'octokit'
import { getRemote } from './git'

const ok = new Octokit({ auth: process.env.PQ_GITHUB_ACCESS_TOKEN })

const detailsFromRemote = (remote: string) => {
  const match = remote.match(/^.+(?::|\/)(.+)\/(.+)\.git$/)
  if (match.length < 3) {
    throw new Error(`error parsing remote: ${remote}`)
  }

  return {
    owner: match[1],
    repo: match[2],
  }
}

export const getPullRequest = async (pullNumber: number): Promise<GetResponseDataTypeFromEndpointMethod<typeof ok.rest.pulls.get>> => {
  const remote = await getRemote()
  const { owner, repo } = detailsFromRemote(remote)

  try {
    const { data } = await ok.rest.pulls.get({
      owner,
      repo,
      pull_number: pullNumber,
    })

    return data
  } catch (err) {
    if (err.status === 404) {
      throw new Error(`pull request number ${pullNumber} does not exist`)
    }

    throw err
  }
}

export const getPRCommits = async (pullNumber: number): Promise<string[]> => {
  const remote = await getRemote()
  const { owner, repo } = detailsFromRemote(remote)

  try {
    const { data } = await ok.rest.pulls.listCommits({
      owner,
      repo,
      pull_number: pullNumber,
    })

    const commitIDs = (data ?? []).map(c => c.sha)

    return commitIDs
  } catch (err) {
    if (err.status === 404) {
      throw new Error(`pull request number ${pullNumber} does not exist`)
    }

    throw err
  }
}
