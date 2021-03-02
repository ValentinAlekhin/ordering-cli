#!/usr/bin/env node

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
// const CompareManager = require('./utils/CompareManager')
// const workFunction = path.join(appRootPath, 'src', 'utils', 'comparePhotos.js')

const dataDir = path.join(appRootPath, 'data')
// const photos = fs.readdirSync(dataDir).map(el => path.join(dataDir, el))
// const compareManager = new CompareManager(photos)

async function start() {
  console.log(chalk.green.bold('Start'))
  const filesOrganizer = new FilesOrganizer(dataDir)
  await filesOrganizer.start()
  console.log('Finish')
}

start()
