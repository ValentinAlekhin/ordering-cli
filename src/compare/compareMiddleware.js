const compareMiddleware = ({ first, second, isSame }, { toRemove, photos }) => {
  const result = { toRemove }

  result.photos = photos.filter(el => el.firs === first)

  if (isSame) {
    result.toRemove = [...toRemove, second]
    result.photos = photos.filter(el => el.second === second)
  }

  return result
}

module.exports = compareMiddleware
