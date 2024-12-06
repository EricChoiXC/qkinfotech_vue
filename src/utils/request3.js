import axios from 'axios'
import { useMenuStore } from '@/store/menu.js'
import baseUrl from '@/utils/baseUrl'

/**
 *  和别的request.js 的区别 是timeout时间 比别的js长
 */
let menuStore = null
export default class request {
  #axiosInstance
  #createRequest = (options) => {
    const defaultOptions = {
      baseURL: baseUrl.pmUrl,
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      timeout: 300000,
      timeoutErrorMessage: '请求超时，请稍后再试',
    }
    const inst = axios.create(Object.assign(defaultOptions, options))
    const noPermission = (crrentTab) => {
      if (crrentTab) {
        menuStore = menuStore ? menuStore : useMenuStore()
        menuStore.replaceTab(crrentTab, {
          label: '无权限',
          key: 'NoPermission',
          tabKey: 'NoPermission',
          component: '/views/common/403.vue',
        })
      } else {
        window.location = `${baseUrl.pmUrl}/view/no-permission`
      }
    }
    // 请求拦截器
    inst.interceptors.request.use(
      (config) => {
        return config
      },
      (error) => {
        let msg = '请求异常，请联系管理员！'
        window.$message.error(error.msg)
        return Promise.reject(error)
      },
    )

    // 响应拦截器
    inst.interceptors.response.use(
      (response) => {
        const status = response.status
        if (status == 403) {
          //TODO 跳转到 没有权限页面！！
          noPermission(response.config.crrentTab)
          let msg = '没有权限访问，请联系管理员！'
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
        const status = error?.response?.status
        if (status == 403) {
          //TODO 跳转到 没有权限页面！！
          noPermission(error.response.config.crrentTab)
          let msg = '没有权限访问，请联系管理员！'
          return Promise.reject(new Error(msg))
        } else {
          console.error(error)
          window.$message.error(error.msg)
          return Promise.reject(error)
        }
      },
    )
    return inst
  }
  #findTab = (crrentInstance) => {
    // 检查当前对象是否包含ctx
    if (crrentInstance && crrentInstance.ctx && crrentInstance.ctx.data) {
      // 检查data是否包含tabKey
      if (crrentInstance.ctx.data.tabKey) {
        // 如果包含，返回data
        return crrentInstance.ctx.data
      }
    }
    // 如果不包含tabKey，但存在parent，则递归查找
    if (crrentInstance && crrentInstance.parent) {
      return this.#findTab(crrentInstance.parent)
    }
    // 如果当前对象或其ctx不满足条件，且没有parent，则返回null或undefined表示未找到
    return null
  }
  constructor(crrentInstance) {
    this.crrentTab = this.#findTab(crrentInstance)
    this.#axiosInstance = this.#createRequest()
    this.post = (url) => {
      return this.#axiosInstance.post(url, {}, { crrentTab: this.crrentTab })
    }
    this.post = (url, param) => {
      return this.#axiosInstance.post(url, param, { crrentTab: this.crrentTab })
    }
    this.post = (url, param, config) => {
      config = config || {}
      return this.#axiosInstance.post(
        url,
        param,
        Object.assign(config, { crrentTab: this.crrentTab }),
      )
    }
    this.get = (url) => {
      return this.#axiosInstance.get(url, { crrentTab: this.crrentTab })
    }
    this.get = (url, param) => {
      return this.#axiosInstance.get(url, {
        params: param,
        crrentTab: this.crrentTab,
      })
    }
    this.create = (urlPrefix, actions) => {
      const api = {}
      Object.entries(actions).forEach(([key, action]) => {
        const url = urlPrefix + action
        const method = key.endsWith('?')
          ? key.substring(0, key.length - 1)
          : key
        api[method] = async (data) => {
          if (key.endsWith('?')) {
            return this.#axiosInstance.get(url, {
              params: data,
              currentTab: this.currentTab,
            })
          } else {
            return this.#axiosInstance.post(url, data, {
              currentTab: this.currentTab,
            })
          }
        }
      })
      return api
    }
  }
}
