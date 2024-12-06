import request from "@/utils/request2";
import baseUrl from "@/utils/baseUrl";

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = {};

  api.mainGetHistoryData = (param) => {
    return requestInstance.post('/pm/supplier/main/getHistoryData', param)
  }

  api.supplierMainList = (param) => {
    return requestInstance.post('/pm/apps/supplier/main/list', param)
  }

  return api
}

export default createApi
