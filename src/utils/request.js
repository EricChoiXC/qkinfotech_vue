import axios from '@/utils/baseUrlAxios.js'

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_BASE_API,
  headers: {
    // 'Content-Type': 'application/json;charset=utf-8',
    // 'Content-Type':'application/x-www-form-urlencoded'
    'Content-Type':'text/plain'
  },
  timeout: 30000,
  timeoutErrorMessage: '请求超时，请稍后再试',
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    const token = 'token'
    config.token = token
    return config
  },
  (error) => {
    error.data = {}
    error.data.msg = '请求异常，请联系管理员！'
    if (error.message) {
      window.$message.error(error.message)
    } else {
      window.$message.error(JSON.stringify(error))
    }
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const status = response.status
    let msg = ''
    if (status < 200 || status >= 300) {
      // 处理http错误，弹窗显示
      msg = '请求异常，请联系管理员！'
      window.$message.error(msg)
      return Promise.reject(new Error(msg))
    } else {
      return response.data
    }
  },
  (error) => {
    if (error.message) {
      window.$message.error(error.message)
    } else {
      window.$message.error(JSON.stringify(error))
    }
    return Promise.reject(error)
  },
)

export default service
