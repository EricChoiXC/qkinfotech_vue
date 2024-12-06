// import request from '@/utils/request'
import request from '@/utils/baseUrlAxios'
import storage from '@/utils/storage'
import context from '@/context.js'


/** 获取用户组件列表数据 */
export function queryUserAssembly() {
  return request({
    url: '/pm/apps/assembly/user/auth/user/list',
    method: 'post',
    data: { userId: context.user() },
  })
}
/** 更新用户组件序号 */
export function updateUserAssemblySort(params) {
  return request({
    url: '/pm/apps/assembly/user/auth/adjustSort',
    method: 'post',
    data: params,
  })
}
/** 获取组件数据 */
export function queryAssemblyData(type) {
  return request({
    url: '/pm/web/assemblyProcess',
    method: 'get',
    params: { key: type ,userId :context.user()},
  })
}
