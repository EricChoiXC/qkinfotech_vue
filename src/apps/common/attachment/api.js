import request from '@/utils/request2.js'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  // 批量创建简单方法
  const api = requestInstance.create('/pm/attachment/', {
    'mainDelete': 'main/delete',
    mainInit: 'main/init',
    mainSave: 'main/save',
    mainList: 'main/list',
    packageList: 'package/list',
    packageSave: 'package/save',
    'packageDelete': 'package/delete',
  })
  api.sysRoleList = (param) => {
    return requestInstance.post('/pm/sys/role/list', param)
  }
  api.sysFileLoad = (param) => {
    return requestInstance.post('/pm/sys/file/load', param)
  }
  api.projectPackageList = (param) => {
    return requestInstance.post('/pm/apps/project/package/list', param)
  }
  api.meetingPackageList = (param) => {
    return requestInstance.post('/pm/meeting/package/list', param)
  }

  api.isoApprovalList = (param) => {
    return requestInstance.post('/pm/iso/approval/list', param)
  }


  api.attachmentControllerDelete = (param) => {
    return requestInstance.post('/pm/attachmentController/delete', param)
  }
  return api
}

export default createApi
