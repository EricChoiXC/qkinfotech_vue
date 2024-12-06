import axios from 'axios'
import baseUrl from "@/utils/baseUrl";

const service = axios.create({
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  timeout: 30000,
  timeoutErrorMessage: '请求超时，请稍后再试',
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    config.headers['x-request-timstamp'] = new Date().toUTCString()
    if (!config.headers['x-request-user']) {
      config.headers['x-request-user'] = '' // TODO 从 session 中获取的 user
    }
    if (!config.headers['x-request-token']) {
      config.headers['x-request-token'] = '' // TODO 从 session 中获取的 token
    }
    return config
  },
  (error) => {
    let msg = '请求异常，请联系管理员！'
    window.$message.error(error.msg)
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const status = response.status
    if (status == 403) {
      //TODO 跳转到 没有权限页面！！
      return Promise.reject(new Error(msg))
    } else if (status < 200 || status >= 300) {
      // 处理其他错误，弹窗显示
      console.error(response)
      let msg = '请求异常，请联系管理员！'
      window.$message.error(error.msg)
      return Promise.reject(new Error(msg))
    } else {
      return response.data
    }
  },
  (error) => {
    console.error(error)
    window.$message.error(error.msg)
    return Promise.reject(error)
  },
)

const request = {}
request.post = (url, param) => {
  return service.post(url.startsWith("http") ? url : (baseUrl.pmUrl + url), param)
}
request.post = (url, param, config) => {
  return service.post(url.startsWith("http") ? url : (baseUrl.pmUrl + url), param, config)
}
request.get = (url, param) => {
  return service.get(url.startsWith("http") ? url : (baseUrl.pmUrl + url), { params: param })
}

request.create = (urlPrefix, actions) => {
  console.log(urlPrefix)
  const api = {}
  Object.entries(actions).forEach(([key, action]) => {
    const url = urlPrefix + action
    const method = key.endsWith('?') ? key.substring(0, key.length - 1) : key
    api[method] = async (data) => {
      if (key.endsWith('?')) {
        return service.get(url.startsWith("http") ? url : (baseUrl.pmUrl + url), { params: data })
      } else {
        return service.post(url.startsWith("http") ? url : (baseUrl.pmUrl + url), data)
      }
    }
  })
  return api
}

export default request
