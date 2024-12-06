import request from '@/utils/request2.js'

function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  const api = {}
  api.get = async (key) => {
    var param = [{ eq: { fPropertyName: key } }]
    var query = { and: param }
    var result = ''
    await requestInstance
      .post('/pm/sys/config/list', { query: query })
      .then(function (res) {
        if (res.status == 200) {
          if (res.data.list.length == 1) {
            result = res.data.list[0]
          }
        }
      })
      .catch(function (error) {
        throw error
      })
    return result
  }
  return api
}

export default createApi
