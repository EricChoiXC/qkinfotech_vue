import request from "@/utils/request2";

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = {};

  api.mainGetNoticeDateRange = (param) => {
    return requestInstance.post('/pm/supplier/main/getNoticeDateRange', param)
  }

  api.supplierMainSave = (param) => {
    return requestInstance.post('/pm/apps/supplier/main/save', param)
  }

  return api
}

export default createApi
