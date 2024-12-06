import request from "@/utils/request2";
import context from '@/context.js';

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = requestInstance.create('/pm/sys/likes/main/', {
    delete: 'delete',
    list: 'list',
    load: 'load',
    save: 'save',
    init: 'init',
  })

  api.countLoad = (param) => {
    return requestInstance.post('/pm/sys/likes/count/load', param)
  }

  api.countSave = (param) => {
    return requestInstance.post('/pm/sys/likes/count/save', param)
  }

  api.countInit = (param) => {
    return requestInstance.post('/pm/sys/likes/count/init', param)
  }

  api.countList = (param) => {
    return requestInstance.post('/pm/sys/likes/count/list', param)
  }

  return api
}
export default createApi
