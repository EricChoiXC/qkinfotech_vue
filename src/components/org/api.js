import request from '@/utils/request2.js'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  return requestInstance.create('/pm/org/', {
    elementList: 'element/list',
    companyList: 'company/list',
    deptList: 'dept/list',
    personList: 'person/list',
    elementExport: 'element/export',
  })
}

export default createApi
