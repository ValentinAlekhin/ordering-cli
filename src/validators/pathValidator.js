const fs = require('fs-extra')

const isValid = require('is-valid-path')
const chalk = require('chalk')

const createError = message => new Error(chalk.red.bold(message))

module.exports = path => {
  if (!isValid(path)) {
    throw createError('Должен быть указан путь')
  }
  if (!fs.existsSync(path)) {
    throw createError('Указанной директории не существует')
  }

  return true
}
