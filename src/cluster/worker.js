const comparePhotos = require('../compare/comparePhotos')

process.on('message', msg => {
  const { action } = msg

  switch (action) {
    case 'work':
      const { work } = msg

      comparePhotos(work)
        .then(result => process.send({ status: 'success', result }))
        .catch(error => process.send({ status: 'error', error }))
      break
    case 'close':
      process.exit(0)
    default:
      console.log(`[${process.pid}] Worker crashed`)
      process.exit(1)
  }
})
