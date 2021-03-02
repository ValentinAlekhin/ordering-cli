const fs = require('fs-extra')
const path = require('path')

const recursiveSearch = async (directory, handler) => {
  try {
    const filesAndDirs = await fs.readdir(directory)
    for (const current of filesAndDirs) {
      const pathToCurrent = path.join(directory, current)
      const stat = await fs.lstat(pathToCurrent)

      if (stat.isDirectory()) {
        recursiveSearch(pathToCurrent, handler)
      } else handler(pathToCurrent)
    }
  } catch (e) {
    throw new Error(e)
  }
}

module.exports = recursiveSearch
