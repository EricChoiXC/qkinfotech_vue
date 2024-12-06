<script setup>
import Header from '@/layout/opdesk/header.vue'
import Aside from '@/layout/opdesk/aside.vue'
import Main from '@/layout/opdesk/main.vue'
import { useLoadingBar, useDialog, useMessage } from 'naive-ui'
import { provide } from 'vue'
import intro from 'intro.js'
import 'intro.js/introjs.css'
import layout from "@/layout/layout";
import {useMenuStore} from "@/store/menu";
import baseUrl from "@/utils/baseUrl";

// 挂载loading,message,dialog,modal
window['$loading'] = useLoadingBar()
window['$message'] = useMessage()
window['$dialog'] = useDialog()
window['$modal'] = (component, props, options) =>
  new Promise((resolve, reject) => {
    const content = h(component, props)
    window['$dialog'].create(
      Object.assign(
        {
          showIcon: false,
          title: '对话框',
          maskClosable: false,
          content: () => content,
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: () => {
            resolve(content.component.exposed?.output?.())
          },
        },
        options || {},
      ),
    )
  })

const show = ref(true)

// 刷新路由
const reload = () => {
  show.value = false
  nextTick(() => (show.value = true))
}
provide('reload', reload)

const currentMenuName = ref(['首页'])
provide('currentMenuName', currentMenuName)

const menuStore = useMenuStore()
//通过指定key值，改变当前路由
function changeCurMenu(key,name) {
  var target = getRouter(window.$routerList, key, [])
  if (target[1]) {
    currentMenuName.value = target[0]
    if (target.length > 2 && target[2]) {
      handleUpdateValue(target[2])
    }
    setTimeout(() => {
      if (document.getElementsByName("aside-" + key).length > 0) {
        document.getElementsByName("aside-" + key)[0].click()
      }else{
        layout.open({
          label: name,
          key: key,
          component: baseUrl.pmUrl +"/"+key,
        })
      }
    }, 100)
  }
  return target
}
provide('changeCurMenu', changeCurMenu)

//遍历routerList，返回对应的路由，数组第一项未替换的currentMenuName，第二项开始为目标路由向上层级返回
function getRouter(routers, key, newMenuNames) {
  for (var i=0; i<routers.length; i++) {
    var route = routers[i]
    if (route.key === key) {
      return [newMenuNames, route]
    }
    if (route.children) {
      var nextMenuNames = [...newMenuNames]
      nextMenuNames.push(route.label)
      var result = getRouter(route.children, key, nextMenuNames)
      if (result[1]) {
        return [...result, route]
      }
    }
    if (route.menu) {
      var nextMenuNames = [...newMenuNames]
      nextMenuNames.push(route.label)
      var result = getRouter(route.menu, key, nextMenuNames)
      if (result[1]) {
        return [...result, route]
      }
    }
  }
  return [newMenuNames, undefined]
}

//更新路由数据
function handleUpdateValue(item) {
  if (item.url === undefined) {
    menuStore.currentHeaderMenuItem = item
  } else if (item.url.startsWith('http') || item.url.startsWith('https')) {
    if (item.url.startsWith(baseUrl.ekpUrl)) {
      singleLogin.ekpJump(item.url)
    } else {
      window.open(item.url, '_blank')
    }
  } else {
    menuStore.currentHeaderMenuItem = item
  }
}


const collapsed = ref(false)

const introOption = {
  prevLabel: '上一步',
  nextLabel: '下一步',
  skipLabel: '跳过',
  doneLabel: '完成',
  tooltipClass: 'intro-tooltip',
  exitOnEsc: false,
  exitOnOverlayClick: false,
  keyboardNavigation: true,
  showBullets: false,
  showProgress: false,
  scrollToElement: true,
  overlayOpacity: 0.5,
  positionPrecedence: ['bottom', 'top', 'right', 'left'],
  disableInteraction: false,
  hidePrev: true,
  steps: [],
}
const initGuide = () => {
  if (checkShowGuide()) {
    // 绑定标签元素的选择器数组
    introOption.steps = [
      {
        title: '系统使用指导',
        element: '#box1',
        intro: `新系统已上线。`,
      },
      {
        title: '帮助文档',
        element: '#box2',
        intro: `点击使用说明，查看系统介绍！`,
      },
    ]
    intro()
      .setOptions(introOption)
      // 点击结束按钮后执行的事件
      .oncomplete(() => {
        localStorage.setItem('GuideState', 'complete')
      })
      // 点击跳过按钮后执行的事件
      .onexit(() => {
        localStorage.setItem('GuideState', 'complete')
      })
      .start()
  }
}
const checkShowGuide = () => {
  const isToday20241130 = () => {
    // 创建一个表示2024年11月30日的Date对象
    const targetDate = new Date(2024, 10, 30) // 注意月份是从0开始的，所以11月是10
    // 获取当前时间的Date对象
    const now = new Date()

    // 比较当前时间是否大于等于目标时间
    if (now >= targetDate) {
      return true
    } else {
      return false
    }
  }
  const guideState = localStorage.getItem('GuideState')
  if ((guideState && guideState === 'complete') || isToday20241130()) {
    return false
  } else {
    return true
  }
}
onMounted(initGuide)
</script>

<template>
    <n-layout class="layout" id="box1">
      <n-layout-header>
        <Header></Header>
      </n-layout-header>

      <n-layout has-sider>
        <n-layout-sider
          style="background-color: #f0f2f5"
          :inverted="true"
          collapse-mode="width"
          :collapsed-width="60"
          :width="360"
          :collapsed="collapsed"
          @collapse="collapsed = true"
          @expand="collapsed = false"
        >
          <div style="height: 100%; overflow: auto; scrollbar-width: none">
            <Aside></Aside>
          </div>
        </n-layout-sider>
        <n-layout-content>
          <Main></Main>
        </n-layout-content>
      </n-layout>
    </n-layout>
</template>

<style lang="scss" scoped>
.layout {
  height: 100%;

  > :deep(.n-layout-scroll-container) {
    height: 100%;

    > .n-layout-header {
      height: fit-content;
      box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    }

    > .n-layout {
      height: calc(100% - var(--main-header-height));

      > .n-layout-scroll-container {
        height: 100%;
        display: flex;

        // 侧边栏
        > .n-layout-sider {
          height: 100%;
          width: 200px;
          // box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
          background-color: white;

          .n-layout-sider__border {
            background-color: white;
          }
        }

        // 内容区域
        > .n-layout-content {
          flex: 1;
          height: 100%;
          padding: 12px;
          background-color: rgb(240, 242, 245);
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
<!-- 新手引导提示样式 -->
<style lang="scss">
.introjs-helperLayer {
  box-shadow:
    rgba(33, 33, 33, 0.8) 0px 0px 1px 0px,
    rgba(33, 33, 33, 0.5) 0px 0px 0px 5000px !important;
  border: 3px dashed #409eff;
}
.new-tips {
  color: #409eff;
  line-height: 80px;
  cursor: pointer;
}
.introjs-tooltip-title {
  font-size: 16px;
  width: 80%;
  padding-top: 10px;
}
.warper {
  width: 200px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px solid saddlebrown;
}
/* 重置引导组件样式(类似element-ui个人使用) */
.intro-tooltip {
  color: #ffff;
  background: #2c3e50;
}
/* 引导提示框的位置 */
.introjs-bottom-left-aligned {
  left: 45% !important;
}
.introjs-right,
.introjs-left {
  top: 30%;
}
.intro-highlight {
  background: rgba(255, 255, 255, 0.5);
}
.introjs-arrow.left {
  border-right-color: #2c3e50;
}
.introjs-arrow.top {
  border-bottom-color: #2c3e50;
}
.introjs-arrow.right {
  border-left-color: #2c3e50;
}
.introjs-arrow.bottom {
  border-top-color: #2c3e50;
}
/* 提示框头部区域 */
.introjs-tooltip-header {
  padding-right: 0 !important;
  padding-top: 0 !important;
}
.introjs-skipbutton {
  color: #409eff !important;
  font-size: 14px !important;
  font-weight: normal !important;
  //   padding: 8px 10px !important ;
}
.introjs-tooltipbuttons {
  border: none !important;
}
.introjs-tooltiptext {
  font-size: 14px !important;
  padding: 15px !important;
}
/* 提示框按钮 */
.introjs-tooltipbuttons {
  display: flex;
  align-items: center;
  justify-content: center;
}
.introjs-button {
  width: 50px !important;
  text-align: center;
  padding: 4px !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  border-radius: 3px !important;
  border: none !important;
}
.introjs-button:last-child {
  margin-left: 10px;
}
.introjs-prevbutton {
  color: #606266 !important;
  background: #fff !important;
  border: 1px solid #dcdfe6 !important;
}
.introjs-nextbutton {
  color: #fff !important;
  background-color: #409eff !important;
  border-color: #409eff !important;
}
.introjs-disabled {
  color: #9e9e9e !important;
  border-color: #bdbdbd !important;
  background-color: #f4f4f4 !important;
}
</style>
