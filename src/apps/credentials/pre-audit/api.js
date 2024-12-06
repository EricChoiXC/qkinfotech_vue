import request from '@/utils/request2.js'

// 批量创建简单方法
function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = {};
  api.supplierMainGetSupplierFileList = (param) => {
    return requestInstance.post('/pm/supplier/main/getSupplierFileList', param)
  }
  api.meetingMeetingList = (param) => {
    return requestInstance.post('/pm/pre/meeting/meetinglist', param)
  }
  api.noticeMainNoticeList = (param) => {
    return requestInstance.post('/pm/notice/main/noticeList', param)
  }
  api.noticeCompanyBidList = (param) => {
    return requestInstance.post('/pm/apps/notice/company/bid/list', param)
  }
  api.supplierMainList = (param) => {
    return requestInstance.post('/pm/apps/supplier/main/list', param)
  }
  api.attachmentMainList = (param) => {
    return requestInstance.post('/pm/attachment/main/list', param)
  }
  api.noticeMainList = (param) => {
    return requestInstance.post('/pm/apps/notice/main/list', param)
  }
  api.isoApprovalList = (param) => {
    return requestInstance.post('/pm/iso/approval/list', param)
  }
  return api
}

export default createApi
