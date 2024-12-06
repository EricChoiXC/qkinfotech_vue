import request from '@/utils/request2.js'
import storage from '@/utils/storage'
import { useMessage } from 'naive-ui'
import context from '@/context.js'


const message = useMessage()

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  const api = {}
  
  /* 当前是否是处理人，推送ekp流程id */
  api.isHandler = async (ekpId) => {
    var orgIds = []
    var isHandler = false
    await requestInstance
      .post('/pm/process/getProcessHandlers', {
        processId: ekpId,
      })
      .then(function (res) {
        orgIds = res.message
      })
      .catch(function (error) {
        console.log(error)
      })
    await requestInstance
      .post('/pm/userController/checkInOrg', {
        userId: context.user(),
        orgIds: orgIds,
      })
      .then(function (res2) {
        isHandler = res2
      })
      .catch(function (err2) {
        console.log(err2)
      })
    return isHandler
  }
  return api
}

export default createApi
