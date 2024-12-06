import request from '@/utils/request2.js'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = requestInstance.create('/pm/interface/', {
    logList: 'log/list',
    logLoad: 'log/load',
    urlConfigSave: 'url/config/save',
    urlConfigList: 'url/config/list',
    urlConfigLoad: 'url/config/load',
    urlConfigDelete: 'url/config/delete',
  })
  api.taskActionHandle = (param) => {
    return requestInstance.post('/pm/taskAction/handle', param)
  }
  return api
}

export default createApi
