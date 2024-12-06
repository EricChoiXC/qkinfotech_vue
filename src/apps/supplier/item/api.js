import request from "@/utils/request2";

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = {};

  api.typeList = (param) => {
    return requestInstance.post('/pm/masterdata/type/list', param)
  }

  api.typeScaleList = (param) => {
    return requestInstance.post('/pm/masterdata/typeScale/list', param)
  }

  return api
}

export default createApi
