import { NIcon } from 'naive-ui'

/**
 * @description: 渲染图标
 * @param {*} icon
 */
export const renderIcon = icon => {
  return () => h(NIcon, null, { default: () => h(icon) })
}

