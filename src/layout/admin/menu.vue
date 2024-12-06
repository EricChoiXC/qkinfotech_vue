<script setup>
// import { asyncRoutes } from '@/router'

const router = useRouter()
const currentRoute = useRoute()
const matched = currentRoute.matched
const menuRef = ref(null)


const filterRouter = routerMap => {
  return routerMap.filter(item => !item.meta?.hidden)
}

const getMenu = routerMap => {
  return filterRouter(routerMap).map(item => {
    const isRoot = item.children?.length === 1
    const info = isRoot ? item.children[0] : item
    const currentMenu = {
      ...info,
      ...info.meta,
      label: info.meta?.title,
      key: info.name,
      icon: isRoot ? item.meta?.icon : info.meta?.icon
    }
    if (info.children && info.children.length > 0) {
      currentMenu.children = getMenu(info.children)
    }
    return currentMenu
  })
}
// const menus = getMenu(asyncRoutes)
const menus = []

const clickMenuItem = key => {
  router.push({ name: key })
}

// 获取当前打开的菜单
const selectedKeys = ref(currentRoute.name)

watch(() => currentRoute.fullPath, () => {
  const activeMenu = matched.meta?.acitveMenu || ''
  menuRef.value?.showOption(activeMenu || currentRoute.name)
  selectedKeys.value = activeMenu || currentRoute.name
})
</script>

<template>
  <NMenu
    ref="menuRef"
    v-model:value="selectedKeys"
    :options="menus"
    :inverted="true"
    accordion
    @update:value="clickMenuItem"
  />
</template>

<style lang='scss' scoped>
</style>
