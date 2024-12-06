import request from '@/utils/request3.js'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = requestInstance.create('/pm/apps/project/documentation/', {
    save: 'save',
    list: 'list',
  })
  api.projectNoApplicationaCheckTime = (param) => {
    return requestInstance.post('/pm/projectNo/applicationa/checkTime', param)
  }
  api.noticeCompanyBidList = (param) => {
    return requestInstance.post('/pm/apps/notice/company/bid/list', param)
  }
  api.projectMainLoad = (param) => {
    return requestInstance.post('/pm/apps/project/main/load', param)
  }
  api.attachmentMainList = (param) => {
    return requestInstance.post('/pm/attachment/main/list', param)
  }
  api.attachmentControllerAttmentDocument = (param) => {
    return requestInstance.post('/pm/attachmentController/attmentDocument', param)
  }
  api.supplierPdfHtmlConvertPdf = (param) => {
    return requestInstance.post('/pm/supplier/pdf/htmlConvertPdf', param)
  }
  api.mainSave = (param) => {
    return requestInstance.post('/pm/apps/project/main/save', param)
  }
  api.projectNoApplicationaCheckFiles = (param) => {
    return requestInstance.post('/pm/projectNo/applicationa/checkFiles', param)
  }
  return api
}

export default createApi
