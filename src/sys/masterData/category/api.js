import request from '@/utils/request2.js'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = requestInstance.create('/pm/masterdata/category/', {
    delete: 'delete',
    list: 'list',
    load: 'load',
    save: 'save',
    init: 'init',
  })
  api.categoryModeList = (param) => {
    return requestInstance.post('/pm/masterdata/categoryMode/list', param)
  }
  api.categoryModeSave = (param) => {
    return requestInstance.post('/pm/masterdata/categoryMode/save', param)
  }
  return api
}

export default createApi
