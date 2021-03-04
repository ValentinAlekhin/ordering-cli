#!/usr/bin/env node

const fs = require('fs-extra')
const path = require('path')

const chalk = require('chalk')
const appRootPath = require('app-root-path').toString()

// CLI Arguments
const yargsOptions = require('./yargs/index')

// Finding and organizing files
const FilesOrganizer = require('./utils/FilesOrganizer')

// Multi-threaded function
const clusterMaster = require('./cluster/master')

// Compare utils
const CompareManager = require('./utils/CompareManager')
const workFunction = path.join(appRootPath, 'src', 'utils', 'comparePhotos.js')

async function start() {
  const { root, 'remove-copy': removeCopy } = yargsOptions

  if (!root) {
    console.log(
      chalk.red.bold(
        'Комманда не может быть выполненна в директории приложения'
      )
    )

    return
  }

  const filesOrganizer = new FilesOrganizer(path.join(appRootPath, 'data'))
  const {
    image: { path: imagesPath },
  } = await filesOrganizer.start()

  if (removeCopy) {
    const images = await fs.readdir(imagesPath)
    const compareManager = new CompareManager(images)
    await clusterMaster(
      compareManager.createWork.bind(compareManager),
      compareManager.closeWork.bind(compareManager),
      workFunction
    )
  }
}

start()
