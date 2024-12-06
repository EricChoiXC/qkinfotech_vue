<!--待办-->
<template>
  <n-card :footer-style="{ justifyContent: 'end' }" style="height: 570px">
    <template #header>
      <div class="header-div">
        <div style="font-weight: bold">
          <n-icon style="padding-top: 4px" size="20" color="blue">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 512 512"
            >
              <rect
                x="64"
                y="176"
                width="384"
                height="256"
                rx="28.87"
                ry="28.87"
                fill="none"
                stroke="currentColor"
                stroke-linejoin="round"
                stroke-width="32"
              ></rect>
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-miterlimit="10"
                stroke-width="32"
                d="M144 80h224"
                fill="currentColor"
              ></path>
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-miterlimit="10"
                stroke-width="32"
                d="M112 128h288"
                fill="currentColor"
              ></path>
            </svg>
          </n-icon>
          {{ AssemblyName }}
        </div>
      </div>
    </template>
    <div v-if="limitedItems && limitedItems.length == 0">
      <div style="width: 100%; display: flex; justify-content: center">
        <img src="/public/noData.jpg" style="max-height: 300px" />
      </div>
    </div>
    <n-list hoverable clickable>
      <n-list-item
        v-for="(item, index) in limitedItems"
        :key="index"
        @click="clickTodo(item)"
        style="height: 55px"
      >
        <n-ellipsis>
          <span class="cate">
            <n-tag
              v-if="item.level === 2"
              type="error"
              style="font-size: 12px; height: 16px; width: 36px"
              >紧急</n-tag
            >
            <n-tag
              v-if="item.level === 1"
              type="warning"
              style="font-size: 12px; height: 16px; width: 36px"
              >加急</n-tag
            >
          </span>
          {{ item.subject }}
          <div style="margin-top: 6px">
            <span style="color: #18a058">{{ item.moduleName }}</span>
            <span style="margin-left: 30px; color: #aaaaaa">{{
              item.createTime
            }}</span>
          </div>
        </n-ellipsis>
      </n-list-item>
    </n-list>
    <template #footer>
      <n-space justify="end">
        <n-button size="tiny" @click="handleMore">
          <template #icon>
            <n-icon size="15">
              <EllipsisHorizontal />
            </n-icon>
          </template>
        </n-button>
        <n-button size="tiny" @click="loadData">
          <template #icon>
            <n-icon size="15">
              <MdRefresh />
            </n-icon>
          </template>
        </n-button>
      </n-space>
    </template>
  </n-card>
</template>
<script>
import {
  defineComponent,
  onMounted,
  ref,
  computed,
  getCurrentInstance,
} from 'vue'
import {
  DiceSharp,
  MoveOutline,
  EllipsisHorizontal,
  Notifications,
} from '@vicons/ionicons5'
import createApi from './api'
import sysConfigApi from '@/utils/sysConfig'
import singleLoginApi from '@/utils/singleLogin'
import {MdRefresh} from "@vicons/ionicons4";

export default defineComponent({
  name: 'Todo',
  props: {
    AssemblyName: {
      type: String,
      default: '待办',
      required: true,
    },
    DataKey: {
      type: String,
      default: 'Todo',
      required: true,
    },
    AssemblyIcon: String,
    MaxItems: {
      type: Number,
      default: 7,
      required: false,
    },
  },
  components: {
    MdRefresh,
    DiceSharp,
    MoveOutline,
    EllipsisHorizontal,
  },
  setup(props) {
    const currentInstance = getCurrentInstance()
    const api = createApi(currentInstance)
    const sysConfig = sysConfigApi(currentInstance)
    const singleLogin = singleLoginApi(currentInstance)
    const dataworp = ref({
      data: [],
      host: null,
      url: null,
    })

    const refreshInterval = 25 * 1000; // 设置定时器时间为25秒
    const loadData = () => {
      api.queryAssemblyData(props.DataKey).then((res) => {
        if (res.data != null && res.data!="") {
          const data = res.data
          data.forEach((item) => {
            if (item.createTime) {
              const parts = item.createTime.split(':')
              parts.pop()
              item.createTime = parts.join(':')
            }
          })
          res.data = data
        }
        dataworp.value = res
      })
    }
    const limitedItems = computed(() => {
      if (dataworp.value.data !== undefined) {
        return dataworp.value.data.slice(0, props.MaxItems)
      }
      return []
    })
    const handleLink = (url) => {
      if (url.startsWith('/ekp')) {
        url = url.replace('/ekp', '')
      }
      singleLogin.ekpJump(`${dataworp.value.host}${url}`)
    }
    const changeCurMenu = inject("changeCurMenu")
    const handleMore = () => {
      if (dataworp.value.pagekey !== "") {
        changeCurMenu(dataworp.value.pagekey,"待办")
      } else {
      singleLogin.ekpJump(`${dataworp.value.host}${dataworp.value.url}`)
      }
    }
    onMounted(() => {
      loadData()

      const intervalId = setInterval(loadData, refreshInterval);

      // 在组件卸载时清除定时器
      onBeforeUnmount(() => {
        clearInterval(intervalId);
      });
    })

    async function clickTodo(todo) {
      if (todo.link) {
        if (todo.link.startsWith('http')) {
          window.open(todo.link, '_blank')
        } else {
          var val = await sysConfig.get('ekpUrl')
          if (val && val.fPropertyValue) {
            singleLogin.ekpJump(val.fPropertyValue + todo.link)
          } else {
            singleLogin.ekpJump(window.origin + '/ekp' + todo.link)
          }
        }
      }
    }
    return {
      dataworp,
      limitedItems,
      handleLink,
      handleMore,
      clickTodo,
      loadData
    }
  },
})
</script>
