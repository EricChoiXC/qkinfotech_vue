import request from "@/utils/request2";
import context from '@/context.js'
;

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = {};

  api.projectNoApplicationaProjectView = (projectId) => {
    return requestInstance.post(
      '/pm/projectNo/applicationa/projectView?fId=' + projectId,
    )
  }

  api.projectPackageList = (param) => {
    return requestInstance.post('/pm/apps/project/package/list', param)
  }
  api.checkIsAdminRole = () => {
    return requestInstance.post('/pm/projectNo/applicationa/check/user?fId=' + context.user())
  }

  api.checkProjectStart = (param) => {
    return requestInstance.post('/pm/projectNo/applicationa/check/project/start',{fId: param})
  }

  api.checkProjectNominationResults = (param) => {
    return requestInstance.post('/pm/projectNo/applicationa/check/project/nomination',{fId: param})
  }
  api.appsProjectMainLoad = (param) => {
    return requestInstance.post('/pm/apps/project/main/load', param)
  }


  return api
}

export default createApi
