const cookie = {
  remove: (key, path, domain) => {
    let s = encodeURIComponent (key) + "="
    s +="; path=" + (path ? path : "/")
    if (domain) {
      s += "; domain=" + domain
    }
    document.cookie = s + "; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
  },
  set: (key, data, path, expires, domain) => {
    let s = encodeURIComponent (key) + "=" + encodeURIComponent (data)
    if(path) {
      s +="; path=" + path
    }
    if(expires) {
      s += "; expires=" + expires.toUTCString()
    }
    if (domain) {
      s += "; domain=" + domain
    }
    document.cookie = s;
  },
  get: (key) => {
    let cookies = document.cookie.split('; ')
    for(const cookie of cookies) {
      const [name, value] = cookie.split('=')
      if(name == key) {
        return value
      }
    }
    return null;
  }
}

export default cookie

