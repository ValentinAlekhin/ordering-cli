const ShortID = require('./ShortId')

//FIXME: Почему то не работает класс и не завершается процесс

class CompareManager extends ShortID {
  constructor(photos) {
    super()
    this.comparedPhotos = this.createComparedArr(photos)
    this.toRemove = []
  }

  createComparedArr(photos) {
    const obj = photos.reduce((acc, val, index) => {
      acc[val] = photos
        .map((el, i) => {
          if (index < i) {
            return { second: el, status: 'free' }
          } else return
        })
        .filter(el => el)

      return acc
    }, {})

    delete obj[photos[photos.length - 1]]

    const arr = []

    Object.entries(obj).forEach(([key, value]) =>
      value.forEach(el => arr.push({ ...el, first: key, id: this.createId() }))
    )

    return arr
  }

  createWork() {
    if (!this.comparedPhotos.length) return { message: 'end' }

    const freeWork = this.comparedPhotos.find(({ status }) => status === 'free')
    if (!freeWork) return { message: 'busy' }

    this.comparedPhotos = this.comparedPhotos.map(el => {
      if (el.id === freeWork.id) {
        return { ...freeWork, status: 'busy' }
      } else return el
    })

    return { ...freeWork, message: 'OK' }
  }

  closeWork(id, result) {
    if (!result) {
      this.comparedPhotos = this.comparedPhotos.filter(el => el.id !== id)
    } else {
      const { second } = this.comparedPhotos.find(el => el.id === id)
      this.comparedPhotos = this.comparedPhotos.filter(
        el => el.second !== second && el.first !== second
      )
      this.toRemove = [...this.toRemove, second]
    }
  }
}

module.exports = CompareManager
