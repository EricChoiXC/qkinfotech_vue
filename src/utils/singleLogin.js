import request from '@/utils/request2.js'
import storage from '@/utils/storage'
import baseUrl from '@/utils/baseUrl'
import context from '@/context.js'


function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  const api = {}
  api.oaJump = (url, callback) => {
    requestInstance
      .post('/pm/pms/oaQuest', {
        url: url,
        id: context.user()
      })
      .then(function(res) {
        var pwd = res.oaQuest
        window.open(baseUrl.oaJumpUrl + '/j/sitc/jy_sign.jsp?' + pwd, '_blank')
      }).then(function() {
        if (callback) {
          callback()
        }
      })
  }
  api.ekpJump = (url, callback) => {
    requestInstance
      .post('/pm/pms/oaQuest', {
        url: url,
        id: context.user()
      })
      .then(function(res) {
        var pwd = res.oaQuest
        window.open(
          baseUrl.ekpUrl +
          '/resource/sys/login/sysAutoLogin.do?method=login&s=' +
          pwd,
          '_blank',
        )
      })
      .then(function() {
        if (callback) {
          callback()
        }
      })
  }
  api.oaRequest = async (url) => {
    const response = await requestInstance.post('/pm/pms/oaQuest', {
      url: url,
      id: context.user(),
    })
    const pwd = response.oaQuest
    const response2 = await requestInstance.get(
      baseUrl.oaUrl + '/j/sitc/jy_sign.jsp?' + pwd, {
        withCredentials: true
      },
    )
    return response2
  }
  api.ekpLogin = (url) => {
    requestInstance
      .post('/pm/pms/oaQuest', {
        url: url,
        id: context.user()
      })
      .then(function(res) {
        var pwd = res.oaQuest
        //window.open("http://www.sitcbeta.loc/j/sitc/jy_sign.jsp?" + pwd, "_blank")
      })
  }
  api.ekpQuestLink = async (url) => {
    var link = await requestInstance
      .post('/pm/pms/oaQuest', {
        url: url,
        id: context.user()
      })
      .then(function(res) {
        var pwd = res.oaQuest
        return (
          baseUrl.ekpUrl +
          '/resource/sys/login/sysAutoLogin.do?method=login&s=' +
          pwd
        )
      })
    return link
  }
  api.ekpLocalQuestLink = async (url) => {
    var link = await requestInstance
      .post('/pm/pms/oaQuest', {
        url: url,
        id: context.user()
      })
      .then(function(res) {
        var pwd = res.oaQuest
        return (
          baseUrl.ekpLocalUrl +
          '/resource/sys/login/sysAutoLogin.do?method=login&s=' +
          pwd
        )
      })
    return link
  }
  return api
}

export default createApi
