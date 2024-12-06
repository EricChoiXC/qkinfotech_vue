import request from "@/utils/request2";
import context from '@/context.js'


// 批量创建简单方法
function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = {};

  api.orgPersonLoad = (param) => {
    return requestInstance.post('/pm/org/person/load', param)
  }

  api.shortcutsUserList = (param) => {
    return requestInstance.post('/pm/apps/shortcuts/user/list', param)
  }

  api.queryUserAssembly = () => {
    return requestInstance.post('/pm/apps/assembly/user/auth/user/list', {userId: context.user()})
  }

  api.updateUserAssemblySort = (param) => {
    return requestInstance.post('/pm/apps/assembly/user/auth/adjustSort', param)
  }


  return api
}

export default createApi
