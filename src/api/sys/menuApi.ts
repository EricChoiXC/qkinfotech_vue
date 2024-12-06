// import request from '@/utils/request'
import request from '@/utils/baseUrlAxios'
import storage from '@/utils/storage'
import context from '@/context.js'

/** 获取列表数据 */
export function list(params) {
  return request({
    url: '/pm/sys/menu/list',
    method: 'post',
    data: {query: {and: [{eq: params}]}},
  })
}

/** 保存数据 */
export function save(params) {
  return request({
    url: '/pm/sys/menu/save',
    method: 'post',
    data: params,
  })
}


/** 获取用户快捷方式列表数据 */
export function shortcutsUserList(param) {
  return request({
    url: '/pm/apps/shortcuts/user/list',
    method: 'post',
    data: param,
  })
}


/** 获取快捷方式列表数据 */
export function shortcutsList(param) {
  return request({
    url: '/pm/apps/shortcuts/list',
    method: 'post',
    data: param,
  })
}

/**
 * 快捷方式保存数据
 */
export function shortcutsSave(params) {
  return request({
    url: '/pm/apps/shortcuts/save',
    method: 'post',
    data: params,
  })
}

/**
 * 快捷方式删除数据
 */
export function shortcutsDel(params) {
  return request({
    url: '/pm/apps/shortcuts/delete',
    method: 'post',
    data: params,
  })
}


/**
 * 快捷方式根据id查询数据
 */
export function shortcutsGet(params) {
  return request({
    url: '/pm/apps/shortcuts/load',
    method: 'post',
    data: params,
  })
}

/** 获取用户组件列表数据 */
export function assemblyUserList(param) {
  return request({
    url: '/pm/apps/assembly/auth/user/list',
    method: 'post',
    data: param,
  })
}


/** 获取组件列表数据 */
export function assemblyList(param) {
  return request({
    url: '/pm/apps/assembly/auth/list',
    method: 'post',
    data: param,
  })
}

/**
 * 组件保存数据
 */
export function assemblySave(params) {
  return request({
    url: '/pm/apps/assembly/auth/save',
    method: 'post',
    data: params,
  })
}

/**
 * 组件删除数据
 */
export function assemblyDel(params) {
  return request({
    url: '/pm/apps/assembly/auth/delete',
    method: 'post',
    data: params,
  })
}


/**
 * 组件根据id查询数据
 */
export function assemblyGet(params) {
  return request({
    url: '/pm/apps/assembly/auth/load',
    method: 'post',
    data: params,
  })
}

/**
 * 获取日程数据信息
 */
export function getCalendar() {
  return request({
    url: '/pm/web/getCalendar?fId=' + context.user(),
    method: 'get',
  })
}


/**
 * 获取日程数据信息
 */
export function checkIsAdminRole() {
  return request({
    url: '/pm/projectNo/applicationa/check/user?fId=' + context.user(),
    method: 'post',
  })
}

/**
 * 判断项目是否拥有入围结果
 */
export function checkProjectNominationResults(params) {
  return request({
    url: '/pm/projectNo/applicationa/check/project/nomination',
    method: 'post',
    data: {fId: params},
  })
}

/**
 * 更新项目是否需要开项目启动会字段
 * @param params
 */
export function editProjectNoStart(params) {
  return request({
    url: '/pm/projectNo/applicationa/edit/project/start',
    method: 'post',
    data: params,
  })
}

/**
 * 检查项目是否有项目启动会
 * @param params
 */
export function checkProjectStart(params) {
  return request({
    url: '/pm/projectNo/applicationa/check/project/start',
    method: 'post',
    data: {fId: params},
  })
}

/**
 * 更新项目是否需要开项目汇报评审字段
 * @param params
 */
export function editProjectNoReportReview(params) {
  return request({
    url: '/pm/projectNo/applicationa/edit/project/ReportReview',
    method: 'post',
    data: params,
  })
}

/**
 * 检查项目是否有汇报评审
 * @param params
 */
export function checkProjectReportReview(params) {
  return request({
    url: '/pm/projectNo/applicationa/check/project/ReportReview',
    method: 'post',
    data: {fId: params},
  })
}


