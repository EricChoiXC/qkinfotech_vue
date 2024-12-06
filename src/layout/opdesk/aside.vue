<template>
  <n-scrollbar style="height: 100%">
    <!--
    <div class="box1">
      <n-space vertical :size="24" :column="1">
        <n-descriptions bordered label-align="center" content-style="width:240px;height:240px" label-style="background-color: rgb(65, 112, 159);color: rgb(255, 255, 255);border-radius: 16px 16px 0px 0px;">
          <n-descriptions-item>
            <template #label>
              <div>
                <n-ellipsis style="max-width: 85px;">
                  {{ data.fName }}
                </n-ellipsis>
                , {{ data.fTime }}
                <button @click="loginOut">（退出）</button>
              </div>
            </template>
            <div class="flex justify-center mb-2">
              <a :href="data.fThisMonthSheet.url" target="_blank" :style="{ color: data.fThisMonthSheet.color }">
                {{ data.fThisMonthSheet.text }}
              </a>
            </div>
            <div class="flex justify-center mb-2">
              <a :href="data.fLastMonthSheet.url" target="_blank" :style="{ color: data.fLastMonthSheet.color }">
                {{ data.fLastMonthSheet.text }}
              </a>
            </div>
            <div class="flex justify-center mb-2">
              <a :href="data.fDaishenUrl" target="_blank">
                待审批其他委托({{ data.fDaishenNum }})
              </a>

            </div>
            <div class="flex justify-center mb-2">
              <a :href="data.fProcessingNum.url" target="_blank">
                {{ data.fProcessingNum.text }}
              </a>

            </div>
            <div class="flex justify-center mb-2">
              <a :href="data.fLianjinNum.url" target="_blank">
                {{ data.fLianjinNum.text }}
              </a>
            </div>
            <div class="flex justify-center mb-2">
              <n-button type="info" ghost @click="methods.getData" class="refreshBtn">
                刷新列表
              </n-button>
            </div>

          </n-descriptions-item>
        </n-descriptions>
        <n-descriptions size="medium" label-align="center" content-style="height:500px" label-style="background-color: rgb(65 112 159);color: #fff;height:48px;border-radius:16px 16px 0px 0px">
          <n-descriptions-item content-style="width:100%">
            <template #label>
              功能
            </template>
            <div style="background-color: #fff;height: 450px;overflow: auto;scrollbar-width: none;">
              <n-menu :options="menuStore.asideMenu" @update:value="handleUpdateValue" responsive/>
            </div>
          </n-descriptions-item>
        </n-descriptions>
      </n-space>
    </div> -->
    <div class="box">
      <n-card :segmented="{
          content: true,
          header: 'soft',
        }" size="small" style="min-height: 390px">
        <template #header>
          <div style="height: 28px; line-height: 28px">
            <n-icon size="20">
              <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 20 20"
                width="20" height="20" color="blue" style="position: relative; top: 3px">
                <g fill="none">
                  <path
                    d="M7.5 11A1.5 1.5 0 0 1 9 12.5v4A1.5 1.5 0 0 1 7.5 18h-4A1.5 1.5 0 0 1 2 16.5v-4A1.5 1.5 0 0 1 3.5 11h4zm9 0a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a1.5 1.5 0 0 1-1.5-1.5v-4a1.5 1.5 0 0 1 1.5-1.5h4zm-9-9A1.5 1.5 0 0 1 9 3.5v4A1.5 1.5 0 0 1 7.5 9h-4A1.5 1.5 0 0 1 2 7.5v-4A1.5 1.5 0 0 1 3.5 2h4zm9 0A1.5 1.5 0 0 1 18 3.5v4A1.5 1.5 0 0 1 16.5 9h-4A1.5 1.5 0 0 1 11 7.5v-4A1.5 1.5 0 0 1 12.5 2h4z"
                    fill="currentColor"></path>
                </g>
              </svg>
            </n-icon>
            <div style="position: relative; left: 21px; bottom: 29px">
              <n-breadcrumb>
                <n-breadcrumb-item v-for="item in currentMenuName" style="
                    font-size: 16px;
                    font-weight: bold;
                    --n-font-weight-active: bold;
                  ">
                  {{ item }}
                </n-breadcrumb-item>
              </n-breadcrumb>
            </div>
          </div>
        </template>
        <template #default>
          <n-menu :options="menuStore.asideMenu" @update:value="handleUpdateValue" responsive />
        </template>
      </n-card>
      <div id="box2">
        <n-card :segmented="{
            content: true,
            header: 'soft',
          }" size="small" class="mt-3" style="min-height: 385px">
          <template #header>
            <div style="font-weight: bold">
              <n-icon style="padding-top: 4px" size="20">
                <svg style="color: blue" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 24 24">
                  <path d="M21 11l-6-6v5H8c-2.76 0-5 2.24-5 5v4h2v-4c0-1.65 1.35-3 3-3h7v5l6-6z" fill="currentColor">
                  </path>
                </svg>
              </n-icon>
              快捷方式
            </div>
          </template>
          <template #default>
            <n-grid :cols="3" :y-gap="16">
              <n-gi v-for="item in shortcutsData">
                <div class="icon-item-shortcuts" :key="item.fId">
                  <n-icon size="45" color="#0e7a0d" #>
                    <img :src="item.fIconUrl" class="" @click="openUrl(item)" />
                  </n-icon>
                  <br />
                  <n-ellipsis style="max-width: 90px">
                    {{ item.fName }}
                  </n-ellipsis>
                </div>
              </n-gi>
            </n-grid>
          </template>
        </n-card>
      </div>
    </div>
  </n-scrollbar>
</template>

<script setup>
  import {
    useMenuStore
  } from '@/store/menu.js'
  import storage from '@/utils/storage.js'
  import {
    inject,
    onMounted
  } from 'vue'
  import singleLoginApi from '@/utils/singleLogin'
  import baseUrls from '@/utils/baseUrl'
  import context from '@/context.js'
  import createApi from './api'

  const currentInstance = getCurrentInstance()
  const api = createApi(currentInstance)
  const singleLogin = singleLoginApi(currentInstance)
  const shortcutsData = ref([])

  const currentMenuName = inject('currentMenuName')

  const data = reactive({
    menuStore: useMenuStore(),
    //姓名
    fName: '',
    //当前时间
    fTime: '',
    //待审项目数量
    fDaishenNum: '',
    //进行中项目
    fProcessingNum: {},
    //临近限制日期项目
    fLianjinNum: {},
    //本月有()天TimeSheet未填
    fThisMonthSheet: {},
    //上月有()天TimeSheet未填
    fLastMonthSheet: {},
  })

  const changeCurMenu = inject("changeCurMenu")
  function openUrl(item) {
    //按照不同方式展示 1-url跳转 2-从菜单导航打开
    if (item.fType === "2") {
      changeCurMenu(item.fPageKey)
    } else {
      singleLogin.ekpJump(item.fUrl)
    }
  }

  const loginOut = async () => {
    try {
      // 发送登出请求
      await api.loginOut()
      // 清除 cookie 中的会话信息
      context.logout()
      // 重定向到登录页面
      window.location.assign(context.path + '/login')
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  const methods = {
    async getData() {
      const baseUrl = baseUrls.oaUrl // 基础 URL
      var param = {
        url: baseUrl + '/j/api/sitc/jy/left_user_box_2407.jsp',
        id: context.user(),
      }
      api
        .oaQuest(param)
        .then(function(res) {
          var pwd = res.oaQuest
          api
            .leftUserBox2407(pwd)
            .then(function(res2) {
              if (res2.list !== undefined && res2.list.length !== 0) {
                for (let i = 0; i < res2.list.length; i++) {
                  var item = res2.list[i]
                  let fullUrl = baseUrl + item.url // 拼接 URL
                  if (item.text.startsWith('本月有')) {
                    data.fThisMonthSheet = {
                      text: item.text,
                      url: fullUrl,
                      color: item.color,
                    }
                  } else if (item.text.startsWith('上月有')) {
                    data.fLastMonthSheet = {
                      text: item.text,
                      url: fullUrl,
                      color: item.color,
                    }
                  } else if (item.text.startsWith('进行中项目')) {
                    data.fProcessingNum = {
                      text: item.text,
                      url: fullUrl,
                    }
                  } else if (item.text.startsWith('临近限制日期项目')) {
                    data.fLianjinNum = {
                      text: item.text,
                      url: fullUrl,
                    }
                  }
                }
              } else {
                console.log('无timeSheet.list内容', res2)
              }
              var form = {
                fCreateTime: new Date(),
                fInterfaceName: '个人timesheet接口',
                fInterfaceUrl: `${baseUrl}/j/api/sitc/jy/left_user_box_2407.jsp`,
                fInterfaceInfo: JSON.stringify(res2),
                fInputParameter: JSON.stringify(param),
                fInterfaceStatus: '1',
              }
              api.interfaceLogSave(form)
            })
            .catch(function(error) {
              console.error('Error fetching data:', error)
              var form = {
                fCreateTime: new Date(),
                fInterfaceName: '个人timesheet接口',
                fInterfaceUrl: `${baseUrl}/j/api/sitc/jy/left_user_box_2407.jsp`,
                fInterfaceInfo: JSON.stringify(error),
                fInputParameter: JSON.stringify(param),
                fInterfaceStatus: '2',
              }
              api.interfaceLogSave(form)
            })
        })
        .catch(function(error) {
          console.error('Error getting password:', error)
        })
    },

    getUserInfo() {
      api
        .orgPersonLoad(context.user())
        // axios
        //   .post(`/pm/org/person/load?fId=${context.user()}`, {})
        .then((result) => {
          data.fName = result.data.fName
        })
    },

    //获取当前时间
    getTimeOfDay() {
      var now = new Date()
      var hours = now.getHours()
      var timeOfDay
      if (hours < 12) {
        timeOfDay = '上午好'
      } else if (hours < 18) {
        timeOfDay = '下午好'
      } else {
        timeOfDay = '晚上好'
      }
      data.fTime = timeOfDay
    },
  }

  const menuStore = useMenuStore()

  function handleUpdateValue(key, item) {
    item.tabKey = item.key
    menuStore.currentAsideMenuItem = item
  }

  onMounted(async () => {
    // methods.getUserInfo();
    // methods.getTimeOfDay();
    // methods.getData();
    const param = {
      userId: context.user(),
    }
    const res = await api.shortcutsUserList(param)
    shortcutsData.value = res.data
  })
</script>

<style scoped>
  .box {
    height: 100%;
    padding-left: 12px;
    padding-top: 12px;
  }

  .icon-item-shortcuts {
    display: inline-block;
    width: 100px;
    /* 或其他宽度 */
    box-sizing: border-box;
    padding: 5px;
    text-align: center;
    /* margin: 25px 0px 0px 17px; */
    background-color: white;
  }

  .icon-item-shortcuts:hover {
    background-color: lightcyan;
  }

  :deep(.n-menu .n-menu-item:hover) {
    color: #fff;
    background-color: rgb(65 112 159);
    --n-item-text-color-hover: none;
    --n-item-color-hover: none;
  }

  :deep(.n-descriptions.n-descriptions--bordered .n-descriptions-table-wrapper) {
    border-radius: 16px 16px 0 0;
  }

  :deep(.refreshBtn:hover) {
    border: 1px solid #fff;
    background-color: rgb(65 112 159);
    color: #fff;
  }

  .global-mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    /* 确保遮罩层在其他内容之上 */
  }

  .mask-content {
    /* 遮罩内容的样式 */
    padding: 20px;
    background-color: #fff;
    border-radius: 5px;
    color: #333;
  }
</style>
