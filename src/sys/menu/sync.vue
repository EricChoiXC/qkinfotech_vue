<template>
  <n-card>
    <n-button type="info" ghost icon-placement="left" @click="events.handleSync"
      >同步页面<template #icon>
        <div class="flex items-center">
          <n-icon size="14">
            <SyncOutline />
          </n-icon>
        </div>
      </template>
    </n-button>
    <n-result status="success" title="成功" description="" v-if="result">
    </n-result>
  </n-card>
</template>

<script setup>
import { SyncOutline } from '@vicons/ionicons5'
import createApi from './api'
import { onMounted } from 'vue'

const api = createApi(getCurrentInstance())
const menuData = reactive([])
const result = ref(false)

const methods = {
  /** 初始化数据 */
  load: () => {
    var param = { fMenuType: 'pageJson' }
    api.menuList(param).then((res) => {
      const { list } = res.data
      menuData.push(...list)
    })
  },
  menuByType: (type) => {
    return menuData.find((item) => item.fMenuType === type)
  },
  // 遍历
  extractMenus: () => {
    let allMenus = []

    // 递归函数，用于遍历菜单并提取menu属性
    const traverse = (items) => {
      items.forEach((item) => {
        // 检查当前项是否有menu属性
        if (item.menu) {
          // 如果menu是一个数组，直接添加到结果中
          if (Array.isArray(item.menu)) {
            allMenus = [...allMenus, ...item.menu]
          } else {
            // 如果menu不是数组（尽管在你的示例中它总是数组），可以将其包装成数组并添加
            allMenus.push(item.menu)
          }
        }

        // 如果当前项有children属性，递归调用traverse函数
        if (item.children) {
          traverse(item.children)
        }
      })
    }
    // 从传入的menus数组开始遍历
    let routerList = (window['$routerList'] ? window['$routerList'] : [])
    traverse(routerList)

    return allMenus
  },
  // 合并菜单
  mergeMenus: (originalMenus, newMenus) => {
    if (newMenus === null || newMenus === undefined || newMenus.length === 0) {
      return originalMenus
    }
    // 创建一个映射来快速查找原始菜单项
    const originalMenuMap = new Map(
      originalMenus.map((menu) => [`${menu.label}-${menu.key}`, menu]),
    )

    // 初始化最终的结果数组
    let mergedMenus = [...originalMenus]
    // 辅助函数：递归合并菜单项和它们的子菜单
    const mergeMenu = (originalMenu, newMenu) => {
      if (!originalMenu) return newMenu // 如果没有原始菜单项，直接返回新菜单项
      // 合并基本属性（如auth）
      const mergedMenu = {
        ...originalMenu,
        auth: [
          ...new Set([...(originalMenu.auth || []), ...(newMenu.auth || [])]),
        ],
        // 如果新菜单项有子菜单，则递归合并
        menu: newMenu.menu
          ? mergeSubMenus(originalMenu.menu || [], newMenu.menu)
          : originalMenu.menu,
        // 如果新菜单项有子菜单，则递归合并
        children: newMenu.children
          ? mergeSubMenus(originalMenu.children || [], newMenu.children)
          : originalMenu.children,
      }

      return mergedMenu
    }
    // 辅助函数：递归合并子菜单
    const mergeSubMenus = (originalSubMenus, newSubMenus) => {
      const mergedSubMenus = []
      const subMenuMap = new Map(
        originalSubMenus.map((submenu) => [
          `${submenu.label}-${submenu.key}`,
          submenu,
        ]),
      )

      newSubMenus.forEach((newSubmenu) => {
        const subkey = `${newSubmenu.label}-${newSubmenu.key}`
        let existingSubmenu = subMenuMap.get(subkey)

        if (existingSubmenu) {
          // 递归合并子菜单项
          mergedSubMenus.push(mergeMenu(existingSubmenu, newSubmenu))
        } else {
          // 如果不存在，直接将新子菜单项添加到结果中
          mergedSubMenus.push(newSubmenu)
        }
      })

      // 检查原始子菜单中是否有未在新子菜单中出现的项
      // 如果需要保留这些项，则将它们也添加到结果中
      // 注意：这里的实现没有自动添加这些项，但你可以根据需要修改

      return mergedSubMenus
    }
    // 遍历新菜单项，并尝试与原始菜单项合并
    newMenus.forEach((newMenu) => {
      const key = `${newMenu.label}-${newMenu.key}`
      let existingMenu = mergedMenus.find(
        (menu) => `${menu.label}-${menu.key}` === key,
      )
      if (existingMenu) {
        // 如果已存在，则替换为合并后的菜单项
        const index = mergedMenus.findIndex((menu) => menu === existingMenu)
        mergedMenus[index] = mergeMenu(existingMenu, newMenu)
      } else {
        // 如果不存在，将新菜单项添加到结果数组中
        mergedMenus.push(newMenu)
      }
    })

    return mergedMenus
  },
}
const events = {
  /** 同步按钮事件 */
  handleSync: () => {
    const menus = methods.extractMenus()
    let pageJson = methods.menuByType('pageJson')
    if (pageJson) {
      pageJson.fMenuJson = menus
    } else {
      pageJson = { fMenuJson: menus, fMenuType: 'pageJson' }
    }
    api.menuSave(pageJson).then(() => {
      result.value = true
    })
  },
}
onMounted(() => {
  methods.load()
})
</script>
