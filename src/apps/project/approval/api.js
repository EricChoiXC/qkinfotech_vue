import request from "@/utils/request2";
import oaRequest from '@/utils/oaRequest'
import baseUrl from "@/utils/baseUrl";

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  const oaRequestInstance = new oaRequest(currentInstance)
  // 批量创建简单方法
  const api = {};

  api.oaQuestMap = (param) => {
    return requestInstance.post('/pm/pms/oaQuestMap', param)
  }

  api.interfaceLogSave = (param) => {
    return requestInstance.post('/pm/interface/log/save', param)
  }

  api.natureList = (param) => {
    return requestInstance.post('/pm/masterdata/nature/list', param)
  }

  api.importanceList = (param) => {
    return requestInstance.post('/pm/masterdata/importance/list', param)
  }

  api.fundList = (param) => {
    return requestInstance.post('/pm/masterdata/fund/list', param)
  }

  api.tagList = (param) => {
    return requestInstance.post('/pm/masterdata/tag/list', param)
  }

  api.countryList = (param) => {
    return requestInstance.post('/pm/masterdata/country/list', param)
  }

  api.cityList = (param) => {
    return requestInstance.post('/pm/masterdata/city/list', param)
  }

  api.typeList = (param) => {
    return requestInstance.post('/pm/masterdata/type/list', param)
  }

  api.modeList = (param) => {
    return requestInstance.post('/pm/masterdata/mode/list', param)
  }

  api.categoryList = (param) => {
    return requestInstance.post('/pm/masterdata/category/list', param)
  }

  api.scaleList = (param) => {
    return requestInstance.post('/pm/masterdata/scale/list', param)
  }

  api.typeScaleList = (param) => {
    return requestInstance.post('/pm/masterdata/typeScale/list', param)
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

  api.applicationProjectView = (fId) => {
    return requestInstance.post('/pm/projectNo/applicationa/projectView?fId=' + fId)
  }

  api.elementList = (param) => {
    return requestInstance.post('/pm/org/element/list', param)
  }

  api.dataTypeTageList = (param) => {
    return requestInstance.post('/pm/master/data/type/tag/list', param)
  }

  api.projectPackageDelete = (param) => {
    return requestInstance.post('/pm/apps/project/package/delete', param)
  }

  api.projectSelAgr = (param) => {
    return oaRequestInstance.post(
      baseUrl.oaUrl + '/j/api/sitc/jy/prj/project_sel_agr.jsp?',
      param,
    )
  }

  api.applicationSave = (fId, param) => {
    return requestInstance.post('/pm/projectNo/applicationa/save?fId=' + fId, param)
  }

  api.projectPackageList = (param) => {
    return requestInstance.post('/pm/apps/project/package/list', param)
  }

  api.projectPackageSave = (param) => {
    return requestInstance.post('/pm/apps/project/package/save', param)
  }


  return api
}

export default createApi
