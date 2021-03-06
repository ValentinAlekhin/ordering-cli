const shortId = require('shortid')

class ShortID {
  constructor() {
    this.ids = []
  }

  addIds(arr) {
    arr.forEach(id => {
      if (this.isIdExists(id)) {
        throw new Error(`${id} already exists`)
      }
    })
    this.ids = [...this.ids, ...arr]
  }

  isIdExists(id) {
    return this.ids.find(el => el === id)
  }

  createId() {
    const id = shortId.generate()
    if (this.isIdExists()) {
      this.createId()
    } else {
      this.ids = [...this.ids, id]
      return id
    }
  }
}

module.exports = ShortID
