import request from "@/utils/request2";

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  return requestInstance.create('/pm/org/company/', {
    load: 'load',
    init: 'init',
    save: 'save',
    list: 'list',
  })
}

export default createApi
