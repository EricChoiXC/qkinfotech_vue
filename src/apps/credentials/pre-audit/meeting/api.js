import request from '@/utils/request2.js'
import oaRequest from '@/utils/oaRequest'
import baseUrl from '@/utils/baseUrl'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  const oaRequestInstance = new oaRequest(currentInstance)
  // 批量创建简单方法
  const api = requestInstance.create('/pm/pre/meeting/', {
    save: 'save',
  })
  api.load = (param) => {
    return requestInstance.post('/pm/apps/pre/audit/meeting/load?fId=' + param.fId, param)
  }
  api.masterdataMeetingTypeList = (param) => {
    return requestInstance.post('/pm/masterdata/meetingType/list', param)
  }
  api.noticePackageList = (param) => {
    return requestInstance.post('/pm/apps/notice/package/list', param)
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
  api.evaluationSelExpert = (param) => {
    return oaRequestInstance.post(
      baseUrl.oaUrl + '/j/api/sitc/jy/prj/evaluation_sel_expert.jsp',
      param,
    )
  }
  api.evaluationSelExpertFromEkp = (param) => {
    var url = baseUrl.ekpUrl + "/resource/kmExpertDesignList.do?method=getPage"
    url += "&pageNo=" + (param.pg ? param.pg : 0)
    url += "&rowSize=8"
    if (param.q_name) {
      url += "&name=" + param.q_name
    }
    return oaRequestInstance.post(url)
  }
  api.projectPackageList = (param) => {
    return requestInstance.post('/pm/apps/project/package/list', param)
  }
  api.projectPackageInit = (param) => {
    return requestInstance.post('/pm/apps/project/package/init', param)
  }
  api.projectMainLoad = (param) => {
    return requestInstance.post('/pm/apps/project/main/load', param)
  }
  api.meetingPackageList = (param) => {
    return requestInstance.post('/pm/meeting/package/list', param)
  }
  api.meetingMaimLoad = (param) => {
    return requestInstance.post('/pm/meeting/main/load', param)
  }
  return api
}

export default createApi
