import request from '@/utils/request2.js'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = requestInstance.create('/pm/task/', {
    list: 'list',
    load: 'load',
    logList: 'log/list',
    delete: 'delete',
    logDetailList: 'log/detail/list',
  })
  api.taskActionHandle = (param) => {
    return requestInstance.post('/pm/taskAction/handle', param)
  }
  return api
}

export default createApi
