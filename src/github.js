const { Octokit } = require('octokit')
const { getRemote } = require('./git')

const ok = new Octokit({ auth: process.env.PQ_GITHUB_ACCESS_TOKEN })

const detailsFromRemote = remote => {
  const match = remote.match(/^.+(?::|\/)(.+)\/(.+)\.git$/)
  if (match.length < 3) {
    throw new Error(`error parsing remote: ${remote}`)
  }

  return {
    owner: match[1],
    repo: match[2],
  }
}

const getPullRequest = async pull_number => {
  const remote = await getRemote()
  const { owner, repo } = detailsFromRemote(remote)

  try {
    const { data } = await ok.rest.pulls.get({ owner, repo, pull_number })
    return data
  } catch (err) {
    if (err.status === 404) {
      throw new Error(`pull request number ${pull_number} does not exist`)
    }

    throw err
  }
}

module.exports = {
  getPullRequest,
}
