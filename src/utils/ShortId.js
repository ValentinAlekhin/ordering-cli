const shortId = require('shortid')

class ShortID {
  constructor() {
    this.ids = []
  }

  addIds(arr) {
    this.ids = [...this.ids, arr]
  }

  createId() {
    const id = shortId.generate()
    const isIdExist = this.ids.find(el => el === id)
    if (isIdExist) {
      this.createId()
    } else {
      this.ids = [...this.ids, id]
      return id
    }
  }
}

module.exports = ShortID
