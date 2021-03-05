const { compare } = require('resemblejs')

module.exports = ({ first, second }) =>
  new Promise((response, reject) => {
    const options = {
      returnEarlyThreshold: 5,
    }
    compare(first, second, options, (err, data) => {
      if (err) {
        reject(err)
      } else {
        response({ first, second, isSame: data.isSameDimensions })
      }
    })
  })
