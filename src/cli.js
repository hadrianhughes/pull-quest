const { program } = require('commander');

program.command('new')
  .argument('<pr_number>', 'number/id of the pull request for which to start a review')
  .action((id, options) => {
    console.log('id of the pr: ', id)
  })

module.exports = program
