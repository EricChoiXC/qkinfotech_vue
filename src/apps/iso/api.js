import request from '@/utils/request2.js'

// 批量创建简单方法
function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = {}
  api.getIsoEkpId = (param) => {
    return requestInstance.post('/pm/isoController/getIsoEkpId', param)
  }
  api.orgPersonLoad = (param) => {
    return requestInstance.post('/pm/org/person/load', param)
  }
  api.isoApprovalLoad = (param) => {
    return requestInstance.post('/pm/iso/approval/load', param)
  }
  api.isoApprovalList = (param) => {
    return requestInstance.post('/pm/iso/approval/list', param)
  }
  api.isoApprovalInit = (param) => {
    return requestInstance.post('/pm/iso/approval/init', param)
  }
  api.isoApprovalHandlerList = (param) => {
    return requestInstance.post('/pm/iso/approval/handler/list', param)
  }
  api.projectMainLoad = (param) => {
    return requestInstance.post('/pm/apps/project/main/load', param)
  }
  api.orgDeptManagerList = (param) => {
    return requestInstance.post('/pm/org/dept/manager/list', param)
  }
  api.orgDeptList = (param) => {
    return requestInstance.post('/pm/org/dept/list', param)
  }
  api.orgPersonLoad = (param) => {
    return requestInstance.post('/pm/org/person/load', param)
  }
  api.orgPersonList = (param) => {
    return requestInstance.post('/pm/org/person/list', param)
  }
  api.projectMembersList = (param) => {
    return requestInstance.post('/pm/apps/project/members/list', param)
  }
  api.attachmentMainList = (param) => {
    return requestInstance.post('/pm/attachment/main/list', param)
  }
  api.webAddReview = (param) => {
    return requestInstance.post('/pm/web/addReview', param)
  }
  api.webGetReviewNo = (param) => {
    return requestInstance.post('/pm/web/getReviewNo', param)
  }
  api.isoApprovalSave = (param) => {
    return requestInstance.post('/pm/iso/approval/save', param)
  }
  api.isoApprovalHandlerSave = (param) => {
    return requestInstance.post('/pm/iso/approval/handler/save', param)
  }
  api.attachmentControllerFinishIsoApproval = (param) => {
    return requestInstance.post(
      '/pm/attachmentController/finishIsoApproval',
      param,
    )
  }
  api.projectNoApplicationaProjectView = (projectId) => {
    return requestInstance.post(
      '/pm/projectNo/applicationa/projectView?fId=' + projectId,
    )
  }

  api.masterTextTemplateList = (param) => {
    return requestInstance.post('/pm/master/text/template/list', param)
  }

  api.isoCopyAttachment = (param) => {
    return requestInstance.post('/pm/isoController/copyAttachment', param)
  }
  return api
}

export default createApi
