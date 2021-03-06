#!/usr/bin/env node

const { isMaster } = require('cluster')

if (isMaster) {
  const chalk = require('chalk')

  // CLI Arguments
  const yargsOptions = require('./yargs/index')

  // Finding and organizing files
  const FilesOrganizer = require('./utils/FileOrganizer/FilesOrganizer')

  async function start() {
    const { root } = yargsOptions

    if (!root) {
      console.log(
        chalk.red.bold(
          'Комманда не может быть выполненна в директории приложения'
        )
      )

      return
    }

    const filesOrganizer = new FilesOrganizer(root)
    await filesOrganizer.start()
  }

  start()
}
