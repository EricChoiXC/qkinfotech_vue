import { RouterLink, useRouter, useRoute } from 'vue-router'
import { useLocalStorage } from '@vueuse/core'
import { findRouteByKey } from '@/utils/findRouteByKey'
import { renderIcon } from '@/utils'
import getIcon from '@/utils/getIcon'
import { getCurrentInstance } from 'vue'

// 通过 key 查找路径，返回完整的路由路径
const findRoutePath = (routes, key) => {
  let path = ''

  const searchRoutes = (routes, key, currentPath) => {
    for (const route of routes) {
      if (!route.meta.key) {
        continue
      }

      const newPath = currentPath
        ? `${currentPath}/${route.meta.key}`
        : `/${route.meta.key}`

      if (route.meta.key === key) {
        path = newPath
        return true
      }

      if (route.children && route.children.length > 0) {
        if (searchRoutes(route.children, key, newPath)) {
          return true
        }
      }
    }

    return false
  }

  routes.forEach((r) => {
    if (r.meta?.key === key) {
      path = r.path
    } else {
      if (r.children && r.children.length > 0) {
        searchRoutes(r.children, key, '')
      }
    }
  })

  return path
}

const findParentByKey = (headerMenu, key) => {
  const searchMenu = (menu, key) => {
    for (const item of menu) {
      if (item.menu) {
        for (const subItem of item.menu) {
          if (subItem.key === key) {
            return item
          }
        }
        const parent = searchMenu(item.menu, key)
        if (parent) {
          return parent
        }
      }
      if (item.children) {
        for (const child of item.children) {
          if (child.menu) {
            for (const subItem of child.menu) {
              if (subItem.key === key) {
                return child
              }
            }
            const parent = searchMenu(child.menu, key)
            if (parent) {
              return parent
            }
          }
        }
      }
    }
    return null
  }

  return searchMenu(headerMenu, key)
}

export const useMenuStore = defineStore('menu', () => {
  const router = useRouter()

  const route = useRoute()

  const mainContentList = useLocalStorage('mainContentList', [])

  const prevTab = ref()
  const currentTab = ref()

  const headerMenu = computed(() => {
    return (
      window['$routerList'] ||
      [].map((router) => {
        // 递归删除icon
        const t = (obj) => {
          if (obj.children) {
            obj.children = obj.children.map((c) => {
              delete c.icon
              return t(c)
            })
          }
          return obj
        }

        return t(router)
      })
    )
  })

  const currentHeaderMenuItem = ref(headerMenu.value[0])

  const currentAsideMenu = computed(() =>
    findRouteByKey(headerMenu.value, currentHeaderMenuItem.value?.key),
  )

  const currentAsideMenuItem = ref()

  const windowIds = new Map()

  // 监听 windowIds 中的 window 是否关闭
  const checkWindow = () => {
    windowIds.forEach((v, k) => {
      v.closed && windowIds.delete(k)
    })
  }

  setInterval(checkWindow, 1000)

  const asideMenu = computed(() => {
    return currentAsideMenu.value?.menu
      ?.map((m, i) => {
        const label = () =>
          h(
            'div',
            {
              name: "aside-" + m.key,
              onClick: () => {
                // 改变 url
                if (
                  m.display === undefined ||
                  !m.display ||
                  m.display === 'tab'
                ) {
                  // currentAsideMenuItem.value = m
                  // 更新当前 tab
                  // currentTab.value = m.key
                  // prevTab.value = m.key
                  // 另一种方式跳转路由：通过 key 查找路径，返回完整的路由路径
                  // const path = findRoutePath(window['$routes'], m.key)
                  router.push({
                    name: m.key,
                  })
                  const index = mainContentList.value.findIndex(
                    (item) => item.key === m.key,
                  )
                  if (index !== -1) {
                    mainContentList.value.splice(index, 1) //关闭tab
                  }
                  setTimeout(() => {
                    mainContentList.value.push(m)
                    currentTab.value = m.tabKey
                    prevTab.value = m.tabKey
                  }, 10)
                } else if (m.display === 'dialog') {
                  const component = defineAsyncComponent(
                    () => import('/src' + m.component),
                  )
                  const showDialog = () => {
                    window
                      .$modal(
                        component,
                        {},
                        {
                          title: '编辑',
                        },
                      )
                      .then((v) => {
                        window.$message.success(JSON.stringify(v))
                      })
                  }

                  showDialog()
                } else if (m.display === 'window') {
                  // 如果存在 window，则聚焦到已打开的 tab
                  if (windowIds.has(m.key)) {
                    windowIds.get(m.key).focus()
                  } else {
                    // const win = window.open(`/${m.path}`, '_blank')
                    // windowIds.set(m.key, win)
                    // http https www
                    if (
                      m.url !== undefined &&
                      (m.url.startsWith('http') || m.url.startsWith('https'))
                    ) {
                      const win = window.open(m.url, '_blank')
                      windowIds.set(m.key, win)
                    } else if (m.url !== undefined) {
                      const win = window.open(`/${m.url}`, '_blank')
                      windowIds.set(m.key, win)
                    } else {
                      const win = window.open(`/${m.path}`, '_blank')
                      windowIds.set(m.key, win)
                    }
                  }
                }

                // 添加 tab
                // const isExist = mainContentList.value.find(v => v.key === m.key)
                // if (!isExist && (m.display === undefined || !m?.display || m.display === 'tab')) {
                //   mainContentList.value.push(m)
                // }
              },
            },
            {
              default: () => m.label,
            },
          )

        return {
          ...m,
          // icon: renderIcon(getIcon(m.icon)),
          icon: undefined,
          label,
        }
      })
      .filter((item) => item.showAside)
  })

  const currentRoute = findRouteByKey(window['$routerList'], route.name)

  const currentRouteObj = computed(() => {
    const nameKey = getCurrentInstance().parent.parent.props.data.key
    const item = mainContentList.value.find((item) => item.key === nameKey)
    return item ? item : null
  })

  onMounted(() => {
    // 通过 url 查找当前路由
    if (!currentRoute) return

    currentTab.value = currentRoute.tabKey

    // 根据当前路由查找当前菜单
    const cHeaderMenuItem = findParentByKey(headerMenu.value, currentRoute.key)

    if (cHeaderMenuItem) currentHeaderMenuItem.value = cHeaderMenuItem

    // 获取 currentAsideMenu
    currentAsideMenu.value = findRouteByKey(
      headerMenu.value,
      currentHeaderMenuItem.value?.key,
    )

    // 获取 currentAsideMenuItem
    currentAsideMenuItem.value = findRouteByKey(
      currentAsideMenu.value.menu,
      currentRoute.key,
    )

    // 添加 tab
    const isExist = mainContentList.value.find(
      (v) => v.key === currentRoute.tabKey,
    )
    if (!isExist) {
      mainContentList.value.push(currentRoute)
    }
  })

  const addTab = (obj) => {
    /**
     * obj: {
     *  key: 'key',
     *  label: 'label',
     *  component: 'component',
     *  id
     */
    obj.tabKey = obj.key + (obj.id ? ':' + obj.id : '')
    if (obj.urlParams) {
      if (!router.hasRoute(obj.key)) {
        router.addRoute({
          path: obj.path,
          name: obj.key,
          component: obj.component,
        })
      }

      router.push({
        name: obj.key,
        query: obj.urlParams,
      })
    }
    const isExist = mainContentList.value.find((v) => v.tabKey === obj.tabKey)
    if (isExist) {
      return (currentTab.value = obj.tabKey)
    }
    const menuStore = useMenuStore()
    menuStore.mainContentList.push(obj)
    // menuStore.prevTab = obj.key
    menuStore.currentTab = obj.tabKey
  }

  const closeTab = (key) => {
    const menuStore = useMenuStore()
    /*router.push({
      name: key,
    })*/
    const index = menuStore.mainContentList.findIndex((m) => m.key === key)
    menuStore.mainContentList.splice(index, 1)
    // if (menuStore.prevTab !== undefined) {
    //   menuStore.currentTab = menuStore.prevTab
    //关闭后打开最后一个tab
    if (menuStore.mainContentList.length > 0) {
      menuStore.currentTab =
        menuStore.mainContentList[menuStore.mainContentList.length - 1].tabKey
    }
    // }
  }
  /**
   * replaceTab, 两个参数，第一个参数是要替换的 tab 的 key，第二个参数是要替换成的 tab 的 key
   */
  const replaceTab = (oldTab, newTab) => {
    const menuStore = useMenuStore()
    const index = menuStore.mainContentList.findIndex(
      (m) => m.key === oldTab.tabKey,
    )
    // const newTab = menuStore.mainContentList.find((m) => m.key === newKey)
    menuStore.mainContentList.splice(index, 1, newTab)
    menuStore.currentTab = newTab.tabKey
  }

  return {
    currentRouteObj,
    currentRoute,
    headerMenu,
    currentHeaderMenuItem,
    currentAsideMenu,
    asideMenu,
    currentAsideMenuItem,
    mainContentList,
    currentTab,
    addTab,
    closeTab,
    prevTab,
    replaceTab,
  }
})
