import request from "@/utils/request2";
import baseUrl from "@/utils/baseUrl";

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = {};

  api.awardsDelete = (param) => {
    return requestInstance.post('/pm/apps/awards/delete', param)
  }

  api.designPerformanceDelete = (param) => {
    return requestInstance.post('/pm/apps/design/performance/delete', param)
  }

  return api
}

export default createApi
