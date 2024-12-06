import request from '@/utils/request2.js'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = requestInstance.create('/pm/apps/project/main/', {
    load: 'load',
  })
  api.isoApprovalList = (param) => {
    return requestInstance.post('/pm/iso/approval/list', param)
  }
  api.appsProjectMainSave = (param) => {
    return requestInstance.post('/pm/apps/project/main/save', param)
  }
  return api
}
export default createApi
