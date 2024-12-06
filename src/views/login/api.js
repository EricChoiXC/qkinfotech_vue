import request from '@/utils/request2.js'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = {}
  api.userControllerLoadUserAuths = (param) => {
    return requestInstance.get('/pm/userController/loadUserAuths', param)
  }
  api.oaResponse = (param) => {
    return requestInstance.post('/pm/pms/oaResponse', param)
  }
  api.singleLogin = (param) => {
    return requestInstance.post('/pm/pms/singleLogin', param)
  }
  api.ajaxLogin = (param) => {
    return requestInstance.post('/pm/pms/ajaxLogin', param)
  }
  api.checkAuthentication = (param) => {
    return requestInstance.post('/pm/pms/checkAuthentication', param)
  }
  api.doLogin = (param) => {
    return requestInstance.post('/pm/pms/doLogin', param)
  }
  return api
}
export default createApi
