const fs = require('fs-extra')
const path = require('path')

const ShortID = require('./ShortId')

const def = {
  files: {
    image: { dirName: 'image', exts: ['jpg', 'png', 'jpeg', 'webp', 'raw'] },
    video: { dirName: 'video', exts: ['mp4', 'avi'] },
    other: { dirName: 'other' },
  },
  database: {
    dir: '',
    name: 'database.json',
  },
}

class FilesOrganizer extends ShortID {
  constructor(directory, options = def) {
    super()
    this.directory = directory
    this.options = {
      files: {
        image: { ...def.files.image, ...options.files.image },
        video: { ...def.files.video, ...options.files.video },
        other: { ...def.files.other, ...options.files.other },
      },
      database: { ...def.database, ...options.database },
    }

    this.createFilesPath()
    this.createDirectories()
  }

  start() {
    return this.recursiveSearch(this.directory)
  }

  createFilesPath() {
    Object.entries(this.options.files).forEach(file => {
      const [key, { dirName }] = file
      this.options.files[key].path = path.join(this.directory, dirName)
    })
  }

  createDirectories() {
    const newDirectories = Object.values(this.options.files).map(
      fileType => fileType.path
    )

    for (const newDirPath of newDirectories) {
      const isDirExists = fs.existsSync(newDirPath)

      if (isDirExists) continue

      fs.mkdirSync(newDirPath)
    }
  }

  getInfoByExt(ext) {
    ext = ext.replace('.', '').toLowerCase()
    const entries = Object.entries(this.options.files)
    for (const [fileType, { exts }] of entries) {
      if (!exts) continue

      for (const currExt of exts) {
        if (ext === currExt) {
          return this.options.files[fileType]
        }
      }
    }

    return this.options.files.other
  }

  isFileOnRightDirectory(file) {
    const { dir, ext } = path.parse(file)
    const { path: rightDir } = this.getInfoByExt(ext)

    const res = dir === rightDir

    return dir === rightDir
  }

  async fileHandler(file) {
    const res = this.isFileOnRightDirectory(file)
    if (this.isFileOnRightDirectory(file)) return
    try {
      const { ext: fileExt } = path.parse(file)
      const fileName = `${this.createId()}.${fileExt}`

      const { path: newPath } = this.getInfoByExt(fileExt)

      await fs.copyFile(file, path.join(newPath, fileName))
      await fs.remove(file)
    } catch (e) {
      throw new Error(e)
    }
  }

  async recursiveSearch(directory) {
    try {
      const filesAndDirs = await fs.readdir(directory)
      for (const current of filesAndDirs) {
        const pathToCurrent = path.join(directory, current)
        const stat = await fs.lstat(pathToCurrent)

        if (stat.isDirectory()) {
          await this.recursiveSearch(pathToCurrent)
        } else await this.fileHandler(pathToCurrent)
      }
    } catch (e) {
      throw new Error(e)
    }
  }
}

module.exports = FilesOrganizer
