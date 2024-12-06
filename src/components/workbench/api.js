import request from "@/utils/request2";
import context from '@/context.js'
;

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = {};

  api.queryAssemblyData = (type) => {
    return requestInstance.post('/pm/web/assemblyProcess', {key: type, userId: context.user()})
  }

  return api
}

export default createApi
