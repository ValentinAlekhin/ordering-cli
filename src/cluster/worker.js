process.on('message', msg => {
  const { action } = msg

  switch (action) {
    case 'work':
      const { work, id, func } = msg

      require(func)(work)
        .then(result => process.send({ status: 'success', result, id }))
        .catch(error => process.send({ status: 'error', error }))
      break
    case 'close':
      process.exit(0)
    default:
      console.log(`[${process.pid}] Worker crashed`)
      process.exit(1)
  }
})
