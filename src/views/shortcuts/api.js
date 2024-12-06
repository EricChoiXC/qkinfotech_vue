import request from '@/utils/request2.js'
import baseUrl from '@/utils/baseUrl'
import context from '@/context.js'

import oaRequest from '@/utils/oaRequest'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  const oaRequestInstance = new oaRequest(currentInstance)
  // 批量创建简单方法
  const api = {}

  api.orgPersonLoad = (param) => {
    return requestInstance.post('/pm/org/person/load', param)
  }

  api.oaQuest = (param) => {
    return requestInstance.post('/pm/pms/oaQuest', param)
  }

  api.oaQuestMap = (param) => {
    return requestInstance.post('/pm/pms/oaQuestMap', param)
  }
  api.getProjectTaskByDate = (param) => {
    return oaRequestInstance.post(
      baseUrl.oaUrl + '/j/api/sitc/jy/prj/get_project_task_by_date.jsp',
      param,
    )
  }
  api.interfaceLogSave = (param) => {
    return requestInstance.post('/pm/interface/log/save', param)
  }
  api.projectMainList = (param) => {
    return requestInstance.post('/pm/apps/project/main/list', param)
  }

  api.queryAssemblyData = (type) => {
    return requestInstance.post('/pm/web/assemblyProcess', {
      key: type,
      userId: context.user(),
    })
  }
  api.shortcutsUserList = (param) => {
    return requestInstance.post('/pm/apps/shortcuts/user/list', param)
  }
  return api
}

export default createApi
