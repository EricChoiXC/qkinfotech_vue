import request from '@/utils/request2.js'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = requestInstance.create('/pm/web/', {
    approveProcess: 'approveProcess',
  })
  api.getBaseFields = (module, param) => {
    return requestInstance.post(`/pm/${module}/getBaseFields`, param)
  }
  api.export = (module, param) => {
    return requestInstance.post(`/pm/${module}/export`, param, {
      responseType: 'blob',
    })
  }
  api.import = (module, param) => {
    return requestInstance.post(`/pm/${module}/import`, param, {
      headers: {
        'Content-Type': 'multipart/form-data', // 设置请求头
      },
    })
  }
  api.transportImportMainList = (param) => {
    return requestInstance.post(`/pm/transport/import/main/list`, param)
  }
  api.transportImportMainLoad = (param) => {
    return requestInstance.post(`/pm/transport/import/main/load`, param)
  }
  api.transportImportMainInit = (param) => {
    return requestInstance.post(`/pm/transport/import/main/init`, param)
  }
  api.transportImportMainDelete = (param) => {
    return requestInstance.post(`/pm/transport/import/main/delete`, param)
  }
  api.transportImportSave = (param) => {
    return requestInstance.post('/pm/transportImport/save', param)
  }
  api.transportImportDownload = (param) => {
    return requestInstance.post(`/pm/transportImport/download`, param, {
      responseType: 'blob',
    })
  }
  return api
}

export default createApi
