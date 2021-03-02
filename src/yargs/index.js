const yargs = require('yargs')

const pathValidator = require('../validators/pathValidator')

module.exports = yargs
  .scriptName('ordering-cli')
  .usage('Usage: $0 [args]')
  .option('root', {
    alias: 'root',
    describe: 'Указать рабочую директорию',
    type: 'string',
  })
  .alias('r', 'root')
  .describe('r', 'Указать рабочую директорию')
  .alias('h', 'help')
  .alias('v', 'version')
  .check(({ root }) => (root ? pathValidator(root) : true))
  .help('h').argv
