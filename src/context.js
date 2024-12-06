import cookie from '@/utils/cookie.js'
import storage from '@/utils/storage'
import createApi from '@/views/login/api.js'

const contextPath = '/gzt'
const api = createApi(getCurrentInstance())

export default {
  path: contextPath,

  logout: () => {
    storage.remove("auths")
    storage.remove("LRToken")
    cookie.remove("LRToken")
    cookie.remove("LRToken", "/", window.location.hostname.replace(window.location.hostname.split(".")[0], ""))
    cookie.remove("LRToken", "/", window.location.hostname)
    cookie.remove("id")
    cookie.remove("id", "/", window.location.hostname.replace(window.location.hostname.split(".")[0], ""))
    cookie.remove("username")
    cookie.remove("username", "/", window.location.hostname.replace(window.location.hostname.split(".")[0], ""))
    console.log(document.cookie)
  },

  login: (user, token) => {
    cookie.set("LRToken", token, "path=/")
    cookie.set("id", user.id, "path=/") // 这个最好不需要
    cookie.set("username", user.username, "path=/") // 这个最好不需要
    storage.set("LRToken", token)
  },

  init: async () => {
    if (!window.localStorage.getItem("LRToken")) {
      window.localStorage.removeItem("LRToken")
    }
    let token = cookie.get("LRToken");
    if (token == null) {
      return true;
    }
    if (window.location.pathname.endsWith("thirdLogin")) {
      return true;
    }

    await api.checkAuthentication(null).then((res) => {
      if (res.username) {
        document.cookie = 'username=' + res.username + '; path=/; domain=' + window.location.hostname.replace(window.location.hostname.split(".")[0], "")
      }
      if (res.id) {
        document.cookie = 'id=' + res.id + '; path=/; domain=' + window.location.hostname.replace(window.location.hostname.split(".")[0], "")
      }
    })
    return true
  },

  user: () => {
    if (cookie.get("LRToken") == null) {
      return null;
    }
    return cookie.get("id");
  }
}
