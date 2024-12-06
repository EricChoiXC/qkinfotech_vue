const storage = {
  set: (key, data) => {
    try {
      return localStorage.setItem(key, JSON.stringify(data))
    } catch (err) {
      return Storage.setItem(key, data)
    }
  },
  get: (key) => {
    try {
      return JSON.parse(localStorage.getItem(key))
    } catch (err) {
      return Storage.getItem(key)
    }
  },
  remove: (key, Storage = localStorage) => {
    Storage.removeItem(key)
  },
}

export default storage

