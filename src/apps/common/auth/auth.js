import storage from '@/utils/storage'

export default {
  checkAuth(authName) {
    if (!authName) {
      return false
    }
    if (storage.get("auths").indexOf("AUTH_ADMIN") >= 0) {
      return true
    }
    return storage.get("auths").indexOf(authName) >= 0
  },

  checkAuths(auths) {
    var result = false
    for (var auth in auths) {
      result = result || checkAuth(auth)
    }
    return result
  }
}
