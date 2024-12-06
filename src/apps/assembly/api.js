import request from '@/utils/request2.js'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  return requestInstance.create('/pm/apps/assembly/auth/', {
    list: 'list',
    save: 'save',
    delete: 'delete',
    load: 'load',
  })
}

export default createApi
