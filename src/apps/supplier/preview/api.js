import request from "@/utils/request2";

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = {};

  api.supplierPdfGetPic = (param) => {
    return requestInstance.post('/pm/supplier/pdf/getPic', param)
  }

  api.supplierMainGetSupplierFileList = (param) => {
    return requestInstance.post('/pm/supplier/main/getSupplierFileList', param)
  }

  api.mainGetNoticeDateRange = (param) => {
    return requestInstance.post('/pm/supplier/main/getNoticeDateRange', param)
  }

  api.supplierMainSave = (param) => {
    return requestInstance.post('/pm/apps/supplier/main/save', param)
  }

  api.supplierMainUpdateEkpFileSize = (param) => {
    return requestInstance.post('/pm/supplier/main/updateEkpFileSize', param)
  }

  api.supplierMainUpdateSupplier = (param) => {
    return requestInstance.post('/pm/supplier/main/updateSupplier', param)
  }

  api.supplierPdfPdfDl = (param) => {
    return requestInstance.post('/pm/supplier/pdf/pdfDL', param)
  }


  return api
}

export default createApi
