const cluster = require('cluster')
const numCPUs = require('os').cpus().length

let activeWorkers = 0

const addWorker = () => {
  activeWorkers++
  console.log(activeWorkers)
}
const removeWorker = () => {
  activeWorkers--
  console.log(activeWorkers)
}

module.exports = (workCreator, closeWork, workFunction) =>
  new Promise(res => {
    if (cluster.isMaster) {
      const createWork = worker => {
        const work = workCreator()
        console.log('🚀 ~ file: master.js ~ line 9 ~ work', work)

        switch (work.message) {
          case 'OK':
            worker.send({
              action: 'work',
              work,
              id: work.id,
              func: workFunction,
            })
            break
          case 'end':
            worker.send({ action: 'close' })
            removeWorker()
            res()
            break
          case 'busy':
            worker.send({ action: 'close' })
            removeWorker()
            break
          default:
            break
        }
      }

      for (let i = 0; i < numCPUs - 1; i++) {
        const worker = cluster.fork()
        createWork(worker)
        addWorker()
      }

      cluster.on('exit', (_, code) => {
        if (code === 1) {
          const worker = cluster.fork()
          createWork(worker)
          addWorker()
        }
      })

      cluster.on('message', (worker, msg) => {
        const { status } = msg
        switch (status) {
          case 'success':
            const { result, id } = msg
            closeWork(id, result)
            createWork(worker)
            break
          case 'error':
            const { error } = msg
            console.log(error)
            break
          default:
            break
        }
      })
    } else {
      require('./worker')
    }
  })
