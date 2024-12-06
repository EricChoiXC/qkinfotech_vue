import request from "@/utils/request2";
import oaRequest from '@/utils/oaRequest'
import baseUrl from "@/utils/baseUrl";

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  const oaRequestInstance = new oaRequest(currentInstance)
  // 批量创建简单方法
  const api = {};

  api.meetingTypeList = (param) => {
    return requestInstance.post('/pm/masterdata/meetingType/list', param)
  }

  api.finaliaztionResultPackageList = (param) => {
    return requestInstance.post('/pm/apps/finaliaztion/result/package/list', param)
  }

  api.meetingPackageList = (param) => {
    return requestInstance.post('/pm/meeting/package/list', param)
  }

  api.reportSave = (param) => {
    return requestInstance.post('/pm/report/save', param)
  }

  api.updatePrjEvaluation = (param) => {
    return oaRequestInstance.post(
      baseUrl.oaUrl + '/j/api/sitc/jy/prj/update_prj_evaluation.jsp',
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

  api.oaQuestMap = (param) => {
    return requestInstance.post('/pm/pms/oaQuestMap', param)
  }

  api.reportLoad = (param) => {
    return requestInstance.post('/pm/apps/report/load', param)
  }

  api.meetingMainLoad = (param) => {
    return requestInstance.post('/pm/meeting/main/load', param)
  }

  api.reportMeetingList = (param) => {
    return requestInstance.post('/pm/report/meetinglist', param)
  }

  api.projectPackageInit = (param) => {
    return requestInstance.post('/pm/apps/project/package/init', param)
  }

  api.editProjectNoReportReview = (param) => {
    return requestInstance.post('/pm/projectNo/applicationa/edit/project/ReportReview', param)
  }

  api.evaluationSelExpert = (param) => {
    return oaRequestInstance.post(
      baseUrl.oaUrl + '/j/api/sitc/jy/prj/evaluation_sel_expert.jsp',
      param,
    )
  }

  return api
}

export default createApi
