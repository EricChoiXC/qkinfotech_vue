<script setup>
import storage from '@/utils/storage.js'
import { useMenuStore } from '@/store/menu.js'
import baseUrl from '@/utils/baseUrl'
import singleLoginApi from '@/utils/singleLogin'
import context from '@/context.js'
import { IosClose } from '@vicons/ionicons4'
import { getCurrentInstance, inject, onMounted, provide } from 'vue'
import { findRouteByKey } from '@/utils/findRouteByKey'
import { useRouter, useRoute } from 'vue-router'
import createApi from './api'

const currentInstance = getCurrentInstance()
const api = createApi(currentInstance)
const singleLogin = singleLoginApi(currentInstance)
const router = useRouter()

const route = useRoute()

const menuStore = useMenuStore()

const panels = computed(() => menuStore.mainContentList)

const close = (key) => {
  const index = menuStore.mainContentList.findIndex((m) => m.key === key)
  menuStore.mainContentList.splice(index, 1)
  if (menuStore.mainContentList.length > 0) {
    menuStore.currentTab = (
      index == 0
        ? menuStore.mainContentList[0]
        : menuStore.mainContentList[index - 1]
    ).key
  } else {
    menuStore.currentTab = null
  }
}
const update = (name) => {
  const current = findRouteByKey(window['$routerList'], route.name)

  current &&
    router.push({
      name: name.split(':')[0],
    })
}

const userName = ref('')
const getUserInfo = async () => {
  await api.orgPersonLoad({ fId: context.user() }).then((result) => {
    userName.value = result.data.fName
  })
}

onMounted(() => {
  getUserInfo()
})

const options = [
  {
    label: '退出登录',
    key: logout,
  },
]

const currentMenuName = inject('currentMenuName')

function handleUpdateValue(key, item) {
  if (item.url === undefined) {
    menuStore.currentHeaderMenuItem = item
    currentMenuName.value = getMontageMenu(item.key)
  } else if (item.url.startsWith('http') || item.url.startsWith('https')) {
    if (item.url.startsWith(baseUrl.ekpUrl)) {
      singleLogin.ekpJump(item.url)
    } else {
      window.open(item.url, '_blank')
    }
  } else {
    menuStore.currentHeaderMenuItem = item
    currentMenuName.value = getMontageMenu(item.key)
  }
}

/** 获取拼接菜单名称 */
const getMontageMenu = (key) => {
  let label = []
  const menuArray = window['$routerList']
  menuArray.forEach((item) => {
    if (item.key === key) {
      label.push(item.label)
    }
    if (item.children != null && item.children.length > 0) {
      item.children.forEach((children) => {
        if (children.key === key) {
          label.push(item.label)
          label.push(children.label)
        }
      })
    }
  })
  return label
}

async function logout() {
  try {
    // 发送登出请求
    await api.loginOut()
    // 清除 cookie 中的会话信息
    context.logout()
    // 重定向到登录页面
    window.location.assign(context.path+'/login')
  } catch (err) {
    console.error('Logout failed:', err)
  }
}

// 递归地将数据树修剪到指定的级别。
function getTreeData(data, level = 1) {
  return data.map((item) => {
    if (item.children && item.children.length > 0 && level > 1) {
      item.children = getTreeData(item.children, level - 1)
    } else {
      delete item.children
    }
    return item
  })
}

/* 简单解决SessionStorage跨标签页无同步刷新场景 */
// for (var cookie in document.cookie.split(';')) {
//   if (document.cookie.split(';')[cookie].trim().startsWith('id=')) {
//     if (
//       context.user() !=
//       document.cookie.split(';')[cookie].trim().replace('id=', '')
//     ) {
//       session.set(
//         'id',
//         document.cookie.split(';')[cookie].trim().replace('id=', ''),
//       )
//     }
//   }
// }
</script>

<template>
  <!--  顶部  -->
  <div
    class="px-4 h-[60px] bg-[#41709f] flex items-center"
    style="height: fit-content"
  >
    <a
      href="https://www.shabidding.com/shgjzb/"
      target="_blank"
    >
      <!-- <n-image width="70px" src="/src/assets/logo.png" preview-disabled ref="https://www.shabidding.com" /> -->
      <img src="@/assets/logo.jpg" alt="logo" />
    </a>

    <!--  二级菜单  -->
    <div class="grow px-2">
      <n-menu
        @update:value="handleUpdateValue"
        :options="menuStore.headerMenu"
        mode="horizontal"
        style="
          --n-item-height: 56px;
          --n-item-text-color: #fff;
          --n-option-color-hover: #007ca8;
          --n-option-text-color-hover: #ffffff;
          --n-item-text-color-hover-horizontal: none;
        "
      />
    </div>

    <div class="flex items-center gap-4 text-white">
      欢迎您，{{ userName }}
      <span style="display: inline-block; width: 40px"></span>
      <div @click="logout" class="cursor-pointer">
        <img
          src="/public/退出.png"
          style="width: 22px; height: 20px; margin-left: 7px"
        />退出
      </div>
    </div>
  </div>
  <div class="pl-8">
    <n-tabs
      type="line"
      v-model:value="menuStore.currentTab"
      tab-style="min-width: 20px;"
      class="tabs"
      @update:value="update"
    >
      <n-tab v-for="panel in panels" :key="panel.tabKey" :name="panel.tabKey">
        {{ panel.label }}&nbsp;<n-icon
          size="20"
          @click="() => close(panel.tabKey)"
        >
          <IosClose />
        </n-icon>
      </n-tab>
    </n-tabs>
  </div>

  <!--              @close="handleClose"
              @update:value="handleUpdateValue -->
</template>

<style scoped>
/*  :deep(.n-menu .n-menu-item-content .n-menu-item-content-header) {
  color: #000
} */

:deep(.n-menu .n-menu-item:hover) {
  background-color: #026df9;
  color: #fff;
}

.tabs {
  --n-tab-text-color-active: #41709f !important;
  --n-tab-text-color: #aaa !important;
  --n-bar-color: #41709f !important;
  --n-tab-padding: 5px !important;
}
</style>
