const Cluster = require('cluster')

if (Cluster.isMaster) {
  const numCPUs = require('os').cpus()

  const createWork = require('../compare/createWork')
  const compareMiddleware = require('../compare/compareMiddleware')

  let activeWorkers = 0

  const addWorker = () => {
    activeWorkers++
    console.log(activeWorkers)
  }
  const removeWorker = () => {
    activeWorkers--
    console.log(activeWorkers)
  }

  module.exports = photos =>
    new Promise(response => {
      let data = createWork(photos)

      const sendMsgToWorker = worker => {
        if (!data.photos.length) {
          worker.send({ action: 'close' })
          response(data.toRemove)
        }

        worker.send({ action: 'work', work: data.photos[0] })
      }

      const createWorker = () => {
        worker = Cluster.fork()
        sendMsgToWorker(worker)
        addWorker()
      }

      numCPUs.forEach(_ => createWorker())

      cluster.on('exit', (_, code) => {
        if (code === 1) {
          createWorker()
        }
      })

      cluster.on('message', (worker, msg) => {
        const { status } = msg
        if (status === 'error') {
          console.log(msg.error)
          worker.send({ action: 'close' })
          return
        }

        data = compareMiddleware(msg.result)

        sendMsgToWorker(worker)
      })
    })
} else {
  require('./worker')
}
