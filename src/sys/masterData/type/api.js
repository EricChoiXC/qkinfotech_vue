import request from '@/utils/request2.js'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = requestInstance.create('/pm/masterdata/type/', {
    delete: 'delete',
    list: 'list',
    load: 'load',
    save: 'save',
    init: 'init',
  })
  api.typeScaleSave = (param) => {
    return requestInstance.post('/pm/masterdata/typeScale/save', param)
  }
  api.typeScaleList = (param) => {
    return requestInstance.post('/pm/masterdata/typeScale/list', param)
  }
  api.typeScaleDelete = (param) => {
    return requestInstance.post('/pm/masterdata/typeScale/delete', param)
  }
  api.tagSave = (param) => {
    return requestInstance.post('/pm/master/data/type/tag/save', param)
  }
  api.tagList = (param) => {
    return requestInstance.post('/pm/master/data/type/tag/list', param)
  }
  api.tagDelete = (param) => {
    return requestInstance.post('/pm/master/data/type/tag/delete', param)
  }
  return api
}

export default createApi
