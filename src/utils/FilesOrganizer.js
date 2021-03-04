//TODO: Добавить удаление старых директорий
//TODO: Добавить создание только необходимых директорий

const fs = require('fs-extra')
const path = require('path')

const FileType = require('file-type')
const { realpathSync } = require('fs')

class FilesOrganizer {
  constructor(directory) {
    this.directory = path.normalize(directory)
    this.files = {}
    this.currentFile = {}
  }

  async start() {
    await this.recursiveSearch(this.directory)

    return this.files
  }

  isFileTypeDirExists() {
    return this.files.hasOwnProperty(this.currentFile.type)
  }

  createFilePath() {
    const newFilePath = path.join(this.directory, this.currentFile.type)

    this.files[type].path = newFilePath

    return newFilePath
  }

  createFileDirectory() {
    const { type } = this.currentFile

    if (this.isFileTypeDirExists()) return this.files[type].path

    const newFilePath = this.createFilePath()

    fs.mkdirSync(newFilePath)

    return newFilePath
  }

  createFileName() {
    if (this.isFileHasRightExt()) return

    const { rightExt, base } = this.currentFile

    this.name = `${base}.${rightExt}`
  }

  isFileHasRightExt() {
    const { rightExt, currentExt } = this.currentFile

    return rightExt === currentExt
  }

  isFileOnRightDir() {
    return this.files[this.currentFile.type].path === this.currentFile.dir
  }

  async setCurrentFile(file) {
    try {
      const { ext: currentExt, base, name, dir } = path.parse(file)
      const { mime, ext: rightExt } = await FileType.fromFile(file)
      const type = mime.split('/')[0]

      this.currentFile = { currentExt, base, name, dir, rightExt, type, file }
    } catch (e) {
      throw new Error(e)
    }
  }

  renameFile() {
    const { file, name, dir } = this.currentFile

    const newPath = path.join(dir, name)

    fs.renameSync(file, newPath)
  }

  async fileHandler(file) {
    try {
      await this.setCurrentFile()
      this.createFileName()

      if (this.isFileOnRightDir()) {
        if (!this.isFileHasRightExt()) {
          this.renameFile()
          return
        }
      }

      const { name } = this.currentFile

      const newFilePath = path.join(this.createFileDirectory(), name)

      await fs.copyFile(file, newFilePath)
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
