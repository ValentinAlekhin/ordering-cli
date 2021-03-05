const createWork = photos => {
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
    value.forEach(el => arr.push({ ...el, first: key }))
  )

  return { toRemove: [], photos: arr }
}

module.exports = createWork
