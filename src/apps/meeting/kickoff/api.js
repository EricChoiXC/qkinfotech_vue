import request from "@/utils/request2";
import oaRequest from '@/utils/oaRequest'
import baseUrl from "@/utils/baseUrl";


function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  const oaRequestInstance = new oaRequest(currentInstance)
  // 批量创建简单方法
  const api = requestInstance.create('/pm/meeting/kickoff/', {
  save: 'save'
  // getMeetingPackages: 'getMeetingPackages',
})

api.load = (param) => {
    return requestInstance.post('/pm/apps/meeting/kickoff/load?fId'+param.fId, param)
}
api.oaQuestMap = (param) => {
    return requestInstance.post('/pm/pms/oaQuestMap', param)
}

api.updatePrjEvaluation = (param) => {
    return oaRequestInstance.post(
    baseUrl.oaUrl + '/j/api/sitc/jy/prj/update_prj_evaluation.jsp',
    param,
  )
}


api.getMeetingPackages = (param) => {
  return requestInstance.post('/pm/meeting/kickoff/getMeetingPackages', param)
}

api.packageList = (param) => {
    return requestInstance.post('/pm/meeting/package/list', param)
}

api.meetingMainLoad = (param) => {
    return requestInstance.post('/pm/meeting/main/load', param)
}

api.packageInit = (param) => {
    return requestInstance.post('/pm/apps/project/package/init', param)
}

api.projectMainLoad = (param) => {
    return requestInstance.post('/pm/apps/project/main/load', param)
}

  api.meetingList = (param) => {
    return requestInstance.post('/pm/meeting/kickoff/meetinglist', param)
  }
  api.editProjectNoStart = (param) => {
    return requestInstance.post('/pm/projectNo/applicationa/edit/project/start', param)
  }


  return api
}

export default createApi
