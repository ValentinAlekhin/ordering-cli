const fs = require('fs-extra')

//TODO: Добавить тесты

const appRootPath = require('app-root-path').path
const isValid = require('is-valid-path')
const chalk = require('chalk')

const createError = message => new Error(chalk.red.bold(message))

const def = {
  validateString: true,
  validateExists: true,
  validateAppPath: false,
}

module.exports = (directory, options = def) => {
  options = { ...def, ...options }
  const { validateString, validateExists, validateAppPath } = options

  if (!isValid(directory) && !validateString) {
    throw createError('Должен быть указан путь')
  }
  if (!fs.existsSync(directory) && !validateExists) {
    throw createError('Указанной директории не существует')
  }
  if (directory === appRootPath && validateAppPath) {
    throw createError(
      'Комманда не может быть выполненна в директории приложения'
    )
  }

  return true
}
