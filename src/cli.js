const { program } = require('commander')
const { startReview } = require('./files')
const { getPullRequest } = require('./github')

program.command('new')
  .argument('<pr_number>', 'number/id of the pull request for which to start a review')
  .action(async (id) => {
    const pr = await getPullRequest(id)
    startReview(id)
    console.info(`Started a review\nRepository:\t${pr.head.repo.full_name}\nPull Request:\t${id}`)
  })

module.exports = program
