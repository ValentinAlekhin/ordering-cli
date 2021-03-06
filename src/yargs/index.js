const yargs = require('yargs')

const appRootPath = require('app-root-path').path

const pathValidator = require('../validators/path/path')

module.exports = yargs
  .scriptName('ordering-cli')
  .usage('Usage: $0 [args]')

  // Root option
  .option('root', {
    alias: 'r',
    describe: 'Указать рабочую директорию',
    type: 'string',
    default: process.cwd().includes(appRootPath()) ? null : process.cwd(),
  })
  .check(({ root }) =>
    root ? pathValidator(root, { validateAppPath: true }) : true
  )

  //Remove same option
  .option('remove-same', {
    describe: 'Удалить одинаковые фото',
    type: 'boolean',
    default: false,
  })

  //Other options
  .alias('v', 'version')
  .help('h')
  .alias('h', 'help').argv
