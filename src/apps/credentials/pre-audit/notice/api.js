import request from '@/utils/request2.js'
import baseUrl from '@/utils/baseUrl'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = requestInstance.create('/pm/pre/meeting/', {
    save: 'save',
    load: 'load',
  })
  api.auditAnnouncementSave = (param) => {
    return requestInstance.post('/pm/pre/audit/announcement/save', param)
  }
  api.ekpSysNewsMainAdd = (noticeId) => {
    return requestInstance.post(
      `${baseUrl.ekpUrl}/sys/news/sys_news_main/sysNewsMain.do?method=add&fdTemplateId=13f89f0aecc9570a269328c4ea8b510d&.fdTemplate=13f89f0aecc9570a269328c4ea8b510d&i.docTemplate=13f89f0aecc9570a269328c4ea8b510d&fNoticeId=${noticeId}`,
    )
  }
  api.projectPackageList = (param) => {
    return requestInstance.post('/pm/apps/project/package/list', param)
  }
  api.projectMainLoad = (param) => {
    return requestInstance.post('/pm/apps/project/main/load', param)
  }
  api.orgPersonLoad = (param) => {
    return requestInstance.post('/pm/org/person/load', param)
  }
  api.sitcSupplierList = (param) => {
    return requestInstance.post('/pm/sitc/supplier/list', param)
  }
  api.noticeCompanyBidList = (param) => {
    return requestInstance.post('/pm/apps/notice/company/bid/list', param)
  }
  api.noticeMainGetApplyFiles = (param) => {
    return requestInstance.post('/pm/notice/main/getApplyFiles', param)
  }

  api.attachmentMainList = (param) => {
    return requestInstance.post('/pm/attachment/main/list', param)
  }
  return api
}

export default createApi
