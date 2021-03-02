const yargs = require('yargs')

const pathValidator = require('../validators/pathValidator')

module.exports = yargs
  .scriptName('ordering-cli')
  .usage('Usage: $0 [args]')
  .option('root', {
    alias: 'r',
    describe: 'Указать рабочую директорию',
    type: 'string',
    default: process.cwd(),
  })
  .check(({ root }) => (root ? pathValidator(root) : true))
  .alias('v', 'version')
  .help('h')
  .alias('h', 'help').argv
