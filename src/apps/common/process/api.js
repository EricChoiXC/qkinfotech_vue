import request from '@/utils/request2.js'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  return requestInstance.create('/pm/web/', {
    approveProcess: 'approveProcess',
  })
}

export default createApi
