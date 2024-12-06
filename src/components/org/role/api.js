import request from '@/utils/request2.js'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = requestInstance.create('/pm/sys/', {
    roleList: 'role/list',
    'roleLoad?': 'role/load',
    roleInit: 'role/init',
    roleSave: 'role/save',
    roleDelete: 'role/delete',
    authorityList: 'authority/list',
    'authorityLoad?': 'authority/load',
  })
  api.roleSearchPerson = (param) => {
    return requestInstance.post('/pm/userController/roleSearchPerson', param)
  }

  return api
}

export default createApi
