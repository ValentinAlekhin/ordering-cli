const fs = require('fs-extra')
const path = require('path')
const appRootPath = require('app-root-path').toString()

const CompareManager = require('./utils/CompareManager')
const clusterMaster = require('./cluster/master')
const workFunction = path.join(appRootPath, 'src', 'utils', 'comparePhotos.js')

const dataDir = path.join(appRootPath, 'data')
const photos = fs.readdirSync(dataDir).map(el => path.join(dataDir, el))
const compareManager = new CompareManager(photos)

async function start() {
  await clusterMaster(
    compareManager.createWork.bind(compareManager),
    compareManager.closeWork.bind(compareManager),
    workFunction
  )

  console.log(compareManager.toRemove)
}

start()
