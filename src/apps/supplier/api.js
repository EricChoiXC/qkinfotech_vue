import request from "@/utils/request2";

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = requestInstance.create('/pm/apps/supplier/main/', {
    list: 'list',
    load: 'load',
  })


  api.supplierMainNewSave = (param) => {
    return requestInstance.post('/pm/supplier/main/newSave', param)
  }

  api.noticeMainList = (param) => {
    return requestInstance.post('/pm/apps/notice/main/list', param)
  }

  api.supplierMainPackageList = (param) => {
    return requestInstance.post('/pm/supplier/main/packagelist', param)
  }

  api.supplierMainCheckAtt = (param) => {
    return requestInstance.post('/pm/supplier/main/checkAtt', param)
  }

  api.supplierMainUpdateEkpFileSize = (param) => {
    return requestInstance.post('/pm/supplier/main/updateEkpFileSize', param)
  }

  api.supplierMainSave = (param) => {
    return requestInstance.post('/pm/supplier/main/save', param)
  }

  api.noticeMainList = (param) => {
    return requestInstance.post('/pm/apps/notice/main/list', param)
  }

  api.supplierInfoList = (param) => {
    return requestInstance.post('/pm/apps/supplier/info/list', param)
  }

  api.supplierMainDesignerInit = (param) => {
    return requestInstance.post('/pm/supplier/main/designerInit', param)
  }

  api.supplierMainItemInit = (param) => {
    return requestInstance.post('/pm/supplier/main/itemInit', param)
  }

  api.supplierMainSupplierSave = (param) => {
    return requestInstance.post('/pm/supplier/main/supplierSave', param)
  }

  api.supplierMainDeleteDesigner = (param) => {
    return requestInstance.post('/pm/supplier/main/deleteDesigner', param)
  }

  api.designerAchievementDelete = (param) => {
    return requestInstance.post('/pm/apps/designer/achievement/delete', param)
  }

  api.designerMainInit = (param) => {
    return requestInstance.post('/pm/apps/designer/main/init', param)
  }

  api.designerAchievementInit = (param) => {
    return requestInstance.post('/pm/apps/designer/achievement/init', param)
  }

  api.appsSupplierMainSave = (param) => {
    return requestInstance.post('/pm/apps/supplier/main/save', param)
  }

  api.mainGetNoticeDateRange = (param) => {
    return requestInstance.post('/pm/supplier/main/getNoticeDateRange', param)
  }

  api.supplierInfoList = (param) => {
    return requestInstance.post('/pm/apps/supplier/info/list', param)
  }

  api.supplierMainGetPackageNames = (param) => {
    return requestInstance.post('/pm/supplier/main/getPackageNames', param)
  }

  api.supplierInviteCompanyInit = (param) => {
    return requestInstance.post('/pm/apps/supplier/invite/company/init', param)
  }

  api.supplierInviteCompanyDelete = (param) => {
    return requestInstance.post('/pm/apps/supplier/invite/company/delete', param)
  }

  api.supplierMainInviteCompanySave = (param) => {
    return requestInstance.post('/pm/supplier/main/inviteCompanySave', param)
  }

  api.supplierInviteCompanyList = (param) => {
    return requestInstance.post('/pm/apps/supplier/invite/company/list', param)
  }

  api.supplierMainDeleteSupplierInfo = (param) => {
    return requestInstance.post('/pm/supplier/main/deleteSupplierInfo', param)
  }
  api.getInviteCompany = (param) => {
    return requestInstance.post('/pm/supplier/main/getInviteCompany', param)
  }
  api.elementList = (param) => {
    return requestInstance.post('/pm/org/element/list', param)
  }
  api.getPackagesByNotice = (param) => {
    return requestInstance.post('/pm/supplier/main/getPackagesByNotice', param)
  }

  return api
}

export default createApi
