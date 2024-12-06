import request from '@/utils/request2'
import baseUrls from '@/utils/baseUrl'

// 批量创建简单方法
function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = {}

  api.orgPersonLoad = (param) => {
    return requestInstance.post('/pm/org/person/load', param)
  }

  api.loginOut = (param) => {
    return requestInstance.post('/pm/pms/loginOut', param)
  }

  api.shortcutsUserList = (param) => {
    return requestInstance.post('/pm/apps/shortcuts/user/list', param)
  }
  api.oaQuest = (param) => {
    return requestInstance.post('/pm/pms/oaQuest', param)
  }
  api.interfaceLogSave = (param) => {
    return requestInstance.post('/pm/interface/log/save', param)
  }
  api.leftUserBox2407 = (param) => {
    return requestInstance.get(
      `${baseUrls.oaUrl}/j/api/sitc/jy/left_user_box_2407.jsp?${param}`,
    )
  }

  return api
}

export default createApi
