import request from "@/utils/request2";
import context from '@/context.js'
  ;

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = requestInstance.create('/pm/sys/comment/main/', {
    delete: 'delete',
    list: 'list',
    load: 'load',
    save: 'save',
    init: 'init',
  })

  return api
}
export default createApi
