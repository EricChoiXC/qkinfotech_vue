import request from '@/utils/request2.js'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  return requestInstance.create('/pm/masterdata/importance/', {
    delete: 'delete',
    list: 'list',
    load: 'load',
    save: 'save',
    init: 'init',
  })
}
export default createApi
