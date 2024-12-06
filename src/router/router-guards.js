import storage from '@/utils/storage'

export function createRouterGuards(router) {
  router.beforeEach((to, from) => {
    const Loading = window['$loading'] || null
    Loading && Loading.start()

    // 没有token时跳转登录
    const LRToken = getCookie('LRToken')
    // const ssoToken = getCookie("ssoToken")
    if (to.name !== 'login' && !LRToken) {
      if (to.path !== '/thirdLogin') {
        return {
          name: 'login',
        }
      }
    } else {
      if (storage.get('LRToken') == undefined) {
        storage.set('LRToken', LRToken)
      }
      // if (storage.get("ssoToken") == undefined) {
      // storage.set("ssoToken", ssoToken)
      // }
    }
  })

  router.afterEach(() => {
    const Loading = window['$loading'] || null
    setTimeout(() => {
      Loading && Loading.finish()
    }, 500)
  })

  function getCookie(name) {
    var cookies = document.cookie.split(';')

    // 遍历所有 cookie
    for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i].trim()

      // 判断是否是指定的 cookie
      if (cookie.indexOf(name + '=') === 0) {
        // 找到了指定的 cookie
        return cookie.replace(name + '=', '')
      }
    }
    return null
  }
}
