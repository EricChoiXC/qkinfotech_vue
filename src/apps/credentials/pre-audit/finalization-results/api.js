import request from '@/utils/request2.js'

// 批量创建简单方法
function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = {};
api.projectMainLoad = (param) => {
    return requestInstance.post('/pm/apps/project/main/load', param)
}
api.projectPackageList = (param) => {
    return requestInstance.post('/pm/apps/project/package/list', param)
}
api.projectPackageLoad = (param) => {
    return requestInstance.post('/pm/apps/project/package/load', param)
}
api.projectShortlistCompanySave = (param) => {
    return requestInstance.post('/pm/project/Shortlist/company/save', param)
}

api.noticeCompanyBidList = (param) => {
    return requestInstance.post('/pm/apps/notice/company/bid/list', param)
}
api.noticePackageList = (param) => {
    return requestInstance.post('/pm/apps/notice/package/list', param)
}

api.preAuditMeetingList = (param) => {
    return requestInstance.post('/pm/apps/pre/audit/meeting/list', param)
}

api.meetingPackageList = (param) => {
    return requestInstance.post('/pm/meeting/package/list', param)
}
api.projectShortlistCompanyList = (param) => {
  return requestInstance.post('/pm/project/Shortlist/company/list', param, {
    headers: {
      'Content-Type': 'text/plain'
    },
  })
}
api.projectShortlistUpdatePackageFinalization = (param) => {
    return requestInstance.post('/pm/project/Shortlist/updatePackageFinalization', param)
}
api.finaliaztionResultPackageList = (param) => {
    return requestInstance.post('/pm/apps/finaliaztion/result/package/list', param)
}
  return api
}

export default createApi
