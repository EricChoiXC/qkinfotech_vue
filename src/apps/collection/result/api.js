import request from '@/utils/request2.js'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = requestInstance.create('/pm/apps/collection/result/', {
    list: 'list',
    save: 'save',
    load: 'load',
    init: 'init',
    detailList: 'detail/list',
    detailInit: 'detail/init',
    detailLoad: 'detail/load',
    detailSave: 'detail/save',
    packageList: 'package/list',
  })
  api.deleteOldDetail = (param) => {
    return requestInstance.post('/pm/appsCollectionResult/deleteOldDetail', param)
  }
  api.detailImport = (param, config) => {
    return requestInstance.post('/pm/appsCollectionResult/detailImport', param, config)
  }
  api.detailImportFileDownload = (param, config) => {
    return requestInstance.post(
      '/pm/appsCollectionResult/detailImportFileDownload',
      param,
      config,
    )
  }
  api.packageAdd = (param) => {
    return requestInstance.post('/pm/collection/result/packageAdd', param)
  }
  api.finaliaztionResultPackageList = (param) => {
    return requestInstance.post('/pm/apps/finaliaztion/result/package/list', param)
  }
  api.orgPersonLoad = (param) => {
    return requestInstance.post('/pm/org/person/load', param)
  }
  api.projectMainLoad = (param) => {
    return requestInstance.post('/pm/apps/project/main/load', param)
  }
  api.projectPackageLoad = (param) => {
    return requestInstance.post('/pm/apps/project/package/load', param)
  }
  api.projectPackageList = (param) => {
    return requestInstance.post('/pm/apps/project/package/list', param)
  }
  api.projectPackageSave = (param) => {
    return requestInstance.post('/pm/apps/project/package/save?fId=' + param.fId, param)
  }
  api.isoApprovalList = (param) => {
    return requestInstance.post('/pm/iso/approval/list', param)
  }
  return api
}

export default createApi
