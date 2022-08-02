const { program } = require('commander')
const { getRepoRoot } = require('./git')

program.command('new')
  .argument('<pr_number>', 'number/id of the pull request for which to start a review')
  .action(async (id) => {
    console.log(await getRepoRoot())
    console.log('id of the pr: ', id)
  })

module.exports = program
