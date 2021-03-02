const { compare } = require('resemblejs')

module.exports = ({ first, second }) =>
  new Promise((res, rej) => {
    const options = {
      returnEarlyThreshold: 5,
    }
    compare(first, second, options, (err, data) => {
      if (err) {
        rej(err)
      } else {
        res(parseInt(data.misMatchPercentage) < 5)
      }
    })
  })
