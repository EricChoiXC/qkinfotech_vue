import request from "@/utils/request2";

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = requestInstance.create('/pm/org/person/', {
    'load?': 'load',
    init: 'init',
    save: 'save',
    list: 'list',
  })

  api.orgDeptLoad = (param) => {
    return requestInstance.post('/pm/org/dept/load', param)
  }

  api.sysUserSave = (param) => {
    return requestInstance.post('/pm/sys/user/save', param)
  }

  api.orgElementSave = (param) => {
    return requestInstance.post('/pm/org/element/save', param)
  }

  api.orgPersonSave = (param) => {
    return requestInstance.post('/pm/org/person/save', param)
  }
  return api
}

export default createApi
