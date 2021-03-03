const fs = require('fs-extra')
const path = require('path')

const FileType = require('file-type')

const def = {
  files: {
    image: {
      dirName: 'image',
    },
    video: {
      dirName: 'video',
    },
    audio: {
      dirName: 'audio',
    },
    other: { dirName: 'other' },
  },
  database: {
    dir: '',
    name: 'database.json',
  },
}

class FilesOrganizer {
  constructor(directory, options = def) {
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

  async start() {
    await this.recursiveSearch(this.directory)

    return this.options.files
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

  async fileHandler(file) {
    try {
      const { ext: oldExt, base, name, dir } = path.parse(file)

      const { mime, ext } = await FileType.fromFile(file)
      const fileType = mime.split('/')[0]

      const baseName = `${name}.${ext}`
      let targetDir

      if (this.options.files.hasOwnProperty(fileType)) {
        targetDir = this.options.files[fileType].path
      } else {
        targetDir = this.options.files.other.path
      }

      if (dir === targetDir) {
        if (oldExt.toLocaleLowerCase() === ext.toLocaleLowerCase()) return
        await fs.rename(file, path.join(targetDir, baseName))
        return
      }

      let newPath = path.join(targetDir, base)

      if (fs.existsSync(newPath)) {
        newPath = path.join(targetDir, `${name}.copy${ext}`)
      } else {
        newPath = path.join(targetDir, baseName)
      }

      await fs.copyFile(file, newPath)
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
