const fs = require('fs-extra')

const isValid = require('is-valid-path')
const chalk = require('chalk')

const createError = message => new Error(chalk.red.bold(message))

const def = {
  validateString: true,
  validateExists: true,
}

module.exports = (directory, options = def) => {
  options = { ...def, ...options }
  const { validateString, validateExists } = options

  if (validateString && validateExists) return true

  if (!isValid(directory) || !validateString) {
    throw createError('Должен быть указан путь')
  }
  if (!fs.existsSync(directory) || validateExists) {
    throw createError('Указанной директории не существует')
  }

  return true
}
