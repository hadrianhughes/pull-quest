const program = require('./cli')
const { init } = require('./files')

const run = async () => {
  await init()
  program.parse()
}

run()
