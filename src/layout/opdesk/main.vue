<script setup>
import {useRouter, useRoute} from 'vue-router'
import {useMenuStore} from "@/store/menu";
import ComponentLoader from "@/components/ComponentLoader.vue";
import {findRouteByKey} from "@/utils/findRouteByKey";
import pages from '@/router/pages.js'
import layout from "@/layout/layout";

const router = useRouter()

const route = useRoute()

const menuStore = useMenuStore()

const panels = computed(() => menuStore.mainContentList)

const handleClose = (name) => {
  const index = menuStore.mainContentList.findIndex(m => m.key === name)
  menuStore.mainContentList.splice(index, 1)
}

const handleUpdateValue = (name) => {
  const current = findRouteByKey(window['$routerList'], route.name)

  current && router.push({name: name.split(":")[0],})
}

const loadMain = () => {
  //加载main.vue时调用，刷新页面或直接访问链接适用
  try {
    var name = window.location.pathname.split("/").pop()
    var param = {}
    if (window.location.search) {
      var paramList = window.location.search.replace("?", "").split("&")

      for (var i = 0; i < paramList.length; i++) {
        var temp = paramList[i].split("=")
        param[temp[0]] = temp[1]
      }
    }
    if (pages[name]) {
      if (window.location.search) {
        layout.close(name);
        layout.open({
          label: pages[name].label,
          key: name,
          path: pages[name].path,
          urlParams: param,
          component: pages[name].url
        })
      }
    }
  } catch (e) {
    console.log(e)
  }
}
loadMain()

</script>

<template>
  <div class="size-full overflow-hidden">

    <n-tabs class="my-n-tabs size-full overflow-hidden" v-model:value="menuStore.currentTab" type="card"
            :addable="false" :closable="true"
            @close="handleClose"
            @update:value="handleUpdateValue"
            tab-style="min-width: 80px;border: 1px solid rgb(65 112 159);"
            pane-style="height:100%"
            style="--n-pane-padding-top:0;">
      <n-tab-pane v-for="panel in panels" :key="panel.tabKey" :name="panel.tabKey" :tab="panel.label"
                  display-directive="show">
        <n-scrollbar style="height:100%">
          <ComponentLoader :data="panel"></ComponentLoader>
        </n-scrollbar>

      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<style scoped>
:deep(.n-tabs .n-tabs-nav.n-tabs-nav--card-type .n-tabs-tab.n-tabs-tab--active) {
  background-color: rgb(65 112 159);
  color: #fff;
}

:deep(.n-tabs .n-tabs-nav) {
  display: none;
}

:deep(.n-base-close) {
  background-color: aliceblue;
}

:deep(.n-base-close::before) {
  background-color: white;
}

:deep(.n-tabs .n-tabs-tab-wrapper) {
  margin-right: 5px;
}

:deep(.n-tabs .n-tabs-nav-scroll-content) {
  margin-left: 15px;
}
</style>
