import request from '@/utils/request2.js'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  return requestInstance.create('/pm/masterdata/scale/', {
    delete: 'delete',
    list: 'list',
    load: 'load',
    save: 'save',
    init: 'init',
    tagSave: 'tag/save',
  })
}

export default createApi
