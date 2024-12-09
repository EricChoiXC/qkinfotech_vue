import request from '@/utils/request2.js'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = requestInstance.create('/pm/', {
    /*companyList: 'orgAddress/companyList',
    deptList: 'orgAddress/deptList',
    personList: 'orgAddress/personList',
    postList: 'orgAddress/postList',
    groupList: 'orgAddress/groupList',*/
  })
  /*api.sysRoleList = (param) => {
    return requestInstance.post('/pm/sys/role/list', param)
  }*/

  api.simpleCateList = (cateName, param) => {
    return requestInstance.post('/pm/' + cateName + '/list', param)
  }

  return api
}

export default createApi
