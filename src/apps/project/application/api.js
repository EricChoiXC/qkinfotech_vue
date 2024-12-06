import request from "@/utils/request2";
import oaRequest from '@/utils/oaRequest'
import baseUrl from "@/utils/baseUrl";


function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  const oaRequestInstance = new oaRequest(currentInstance)
  // 批量创建简单方法
  const api = requestInstance.create('/pm/masterdata/', {
    natureList: 'nature/list',
    importanceList: 'importance/list',
    fundList: 'fund/list',
    modeList: 'mode/list',
    tagList: 'tag/list',
    countryList: 'country/list',
    cityList: 'city/list',
    typeList: 'type/list',
    scaleList: 'scale/list',
    categoryList: 'category/list',
  })

  api.oaQuestMap = (param) => {
    return requestInstance.post('/pm/pms/oaQuestMap', param)
  }

  api.projectSelAgr = (param) => {
    return oaRequestInstance.post(
      baseUrl.oaUrl + '/j/api/sitc/jy/prj/project_sel_agr.jsp?',
      param,
    )
  }

  api.updatePrjPackage = (param) => {
    return oaRequestInstance.post(
      baseUrl.oaUrl + '/j/api/sitc/jy/prj/update_prj_package.jsp',
      param,
    )
  }

  api.projectTimesht = (param) => {
    return oaRequestInstance.post(
      baseUrl.oaUrl + '/j/api/sitc/jy/prj/project_timesht.jsp',
      param,
    )
  }

  api.interfaceLogSave = (param) => {
    return requestInstance.post('/pm/interface/log/save', param)
  }

  api.addReview = (param) => {
    return requestInstance.post('/pm/web/addReview', param)
  }

  api.projectMainList = (param) => {
    return requestInstance.post('/pm/apps/project/main/list', param)
  }

  api.personLoad = (param) => {
    return requestInstance.post('/pm/org/person/load', param)
  }
  api.deptManagerList = (param) => {
    return requestInstance.post('/pm/org/dept/manager/list', param)
  }

  api.elementList = (param) => {
    return requestInstance.post('/pm/org/element/list', param)
  }

  api.typeTageList = (param) => {
    return requestInstance.post('/pm/master/data/type/tag/list', param)
  }

  api.projectMainInit = (param) => {
    return requestInstance.post('/pm/apps/project/main/init', param)
  }

  api.projectMemberList = (param) => {
    return requestInstance.post('/pm/apps/project/members/list', param)
  }

  api.projectPackageDelete = (param) => {
    return requestInstance.post('/pm/apps/project/package/delete', param)
  }

  api.projectPackageList = (param) => {
    return requestInstance.post('/pm/apps/project/package/list', param)
  }

  api.dataTypeTageList = (param) => {
    return requestInstance.post('/pm/master/data/type/tag/list', param)
  }

  api.applicationAdminEdit = (fId, param) => {
    return requestInstance.post('/pm/projectNo/applicationa/admin/edit?fId=' + fId, param)
  }

  api.applicationSave = (fId, param) => {
    var url = '/pm/projectNo/applicationa/save'
    if (fId) {
      url += '?fId=' + fId
    }

    return requestInstance.post(url, param)
  }

  api.projectPackageSave = (fMainId,param) => {
    return requestInstance.post('/pm/apps/project/package/save?fMainId=' + fMainId, param)
  }
  api.documentationList = (param) => {
    return requestInstance.post('/pm/apps/project/documentation/list', param)
  }



  return api
}

export default createApi
