const { program } = require('commander')
const { getPullRequest } = require('./github')

program.command('new')
  .argument('<pr_number>', 'number/id of the pull request for which to start a review')
  .action(async (id) => {
    console.log(await getPullRequest(id))
  })

module.exports = program
