<script setup>
  import ComponentLoader from "@/components/ComponentLoader.vue";
  import Header from './header.vue'
  import {
    useLoadingBar,
    useDialog,
    useMessage
  } from 'naive-ui'
  // 挂载loading,message,dialog,modal
  window['$loading'] = useLoadingBar();
  window['$message'] = useMessage();
  window['$dialog'] = useDialog();
  window['$modal'] = (component, props, options) => new Promise((resolve, reject) => {
    const content = h(component, props);
    window['$dialog'].create(Object.assign({
      showIcon: false,
      title: '对话框',
      maskClosable: false,
      content: () => content,
      positiveText: "确定",
      negativeText: "取消",
      onPositiveClick: () => {
        console.log(
          content.component,
        )
        resolve(content.component.exposed?.output?.());
      }
    }, options || {}));
  });

  const panel = null;
</script>

<template>
  <n-layout class="layout">
    <n-layout-header style="height:80px">
      <Header></Header>
    </n-layout-header>

    <n-layout-content>
      <!--
      <ComponentLoader :data="panel"></ComponentLoader>
      -->
      <div style="box-sizing:border-box;width:100%; height:100%; overflow: auto; padding: 0 50px;">
      <router-view></router-view>
      </div>
    </n-layout-content>
  </n-layout>
</template>

<style lang="scss" scoped>
  .layout {
    height: 100%;

    > :deep(.n-layout-scroll-container) {
      height: 100%;

      >.n-layout-header {
        height: var(--main-header-height);
        box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
      }

      >.n-layout {
        height: calc(100% - var(--main-header-height));

        >.n-layout-scroll-container {
          height: 100%;
          display: flex;

          // 侧边栏
          >.n-layout-sider {
            height: 100%;
            width: 200px;
            box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
            background-color: white;

            .n-layout-sider__border {
              background-color: white;
            }
          }

          // 内容区域
          >.n-layout-content {
            flex: 1;
            height: 100%;
            padding: 16px;
            background-color: #f0f2f5;
          }
        }
      }
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
