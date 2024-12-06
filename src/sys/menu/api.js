import request from '@/utils/request2.js'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  return requestInstance.create('/pm/sys/', {
    menuList: 'menu/list',
    menuDelete: 'menu/delete',
    'menuLoad?': 'menu/load',
    menuSave: 'menu/save',
  })
}

export default createApi
