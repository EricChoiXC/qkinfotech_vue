import request from '@/utils/request2.js'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = requestInstance.create('/pm/apps/shortcuts/', {
    list: 'list',
    save: 'save',
    delete: 'delete',
    load: 'load',
  })
  return api
}

export default createApi
