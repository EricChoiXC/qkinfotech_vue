import request from '@/utils/request2.js'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = requestInstance.create('/pm/org/', {
    groupList: 'group/list',
    groupInit: 'group/init',
    'groupLoad?': 'group/load',
  })
  api.orgGroupSave = async (param) => {
    return requestInstance.post('/pm/orgGroup/save', param)
  }
  return api
}

export default createApi
