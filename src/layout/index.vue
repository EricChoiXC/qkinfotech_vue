<script setup>
import Header from '@/layout/Header/index.vue'
import Menu from '@/layout/Menu/index.vue'
import TagsView from '@/layout/TagsView/index.vue'
import { useLoadingBar } from 'naive-ui'
// 挂载loading
window['$loading'] = useLoadingBar()

const show = ref(true)

// 刷新路由
const reload = () => {
  show.value = false
  nextTick(() => (show.value = true))
}
provide('reload', reload)
const collapsed = ref(false)


// window['$dialog'] = useDialog();
window['$modal'] = (component, props, options) => new Promise((resolve,reject) => {
  const content = h(component, props);
  window['$dialog'].create(Object.assign({
    showIcon: false,
    title: '对话框',
    maskClosable: false,
    content: () => content,
    positiveText: "确定",
    negativeText: "取消",
    onPositiveClick: () => {
      resolve(content.component.exposed.output());
    }
  }, options || {}));
});

</script>

<template>
  <n-layout class="layout" has-sider>
    <n-layout-sider
      :inverted="true"
      bordered
      collapse-mode="width"
      :collapsed-width="60"
      :width="240"
      :collapsed="collapsed"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <Menu />
    </n-layout-sider>
    <n-layout class="layout-container">
      <n-layout-header>
        <Header />
      </n-layout-header>
      <TagsView />
      <n-layout-content :native-scrollbar="false">
        <router-view v-if="show" v-slot="{ Component, route }">
          <transition name="fade-slide" mode="out-in" appear>
            <component :is="Component" :key="route.fullPath" />
          </transition>
        </router-view>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<style lang="scss" scoped>
.layout {
  height: 100%;
  :deep(.n-layout-scroll-container) {
    flex: 1;
    display: flex;
    flex-direction: column;
    background-color: rgb(245, 247, 249);
  }
  :deep(.n-layout-sider) {
    width: 200px !important;
    box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
    .n-layout-sider-scroll-container {
      min-width: 50px !important;
    }
  }
  .n-layout-header {
    height: 70px;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
  }
  .n-layout-content,
  .layout-container {
    flex: 1;
    background-color: rgb(245, 247, 249);
  }

  :deep(.n-scrollbar) {
    > .n-scrollbar-container > .n-scrollbar-content {
      height: 100%;
    }
  }

  .tags-view,
  .n-layout-content {
    margin: 0 8px;
  }
}

.fade-slide-leave-active,
.fade-slide-enter-active {
  transition: all 0.3s;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
