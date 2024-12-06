<!--供应商固定-已领购项目-->
<template>
  <n-card :footer-style="{ justifyContent: 'end' }">
    <template #header>
      <div class="header-div">
        <div style="font-weight: bold">
          <n-icon style="padding-top: 4px" size="20" color="blue">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 16 16"
            >
              <g fill="none">
                <path
                  d="M8 2a4.5 4.5 0 0 0-4.5 4.5v2.401l-.964 2.414A.5.5 0 0 0 3 12h3c0 1.108.892 2 2 2s2-.892 2-2h3a.5.5 0 0 0 .464-.685L12.5 8.9V6.5A4.5 4.5 0 0 0 8 2zm1 10c0 .556-.444 1-1 1s-1-.444-1-1h2zM4.5 6.5a3.5 3.5 0 1 1 7 0v2.498a.5.5 0 0 0 .036.185L12.262 11H3.738l.726-1.817a.5.5 0 0 0 .036-.185V6.5z"
                  fill="currentColor"
                ></path>
              </g>
            </svg>
          </n-icon>
          {{ AssemblyName }}
        </div>
      </div>
    </template>
    <template #default>
      <div v-if="limitedItems.length == 0">
        <div style="width: 100%; display: flex; justify-content: center">
          <img src="/public/noData.jpg" style="max-height: 280px" />
        </div>
      </div>
      <n-list hoverable clickable>
        <n-list-item
          v-for="(item, index) in limitedItems.slice(0, 6)"
          :key="index"
          @click="handleLink(item.href)"
          style="height: 48px"
        >
          <template #suffix>
            <n-space>
              <span class="classic_suffix">{{ item.creator }}</span>
            </n-space>
          </template>
          <n-ellipsis>
            <span class="cate">[{{ item.catename }}]</span>{{ item.text }}
            <div v-html="item.otherinfo"></div>
          </n-ellipsis>
        </n-list-item>
      </n-list>
    </template>
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
import { DiceSharp, MoveOutline, EllipsisHorizontal } from '@vicons/ionicons5'
import createApi from './api'
import singleLoginApi from '@/utils/singleLogin'
import {MdRefresh} from "@vicons/ionicons4";

export default defineComponent({
  name: 'PurchaseAnnouncement',
  props: {
    AssemblyName: {
      type: String,
      default: '已领购项目',
      required: true,
    },
    DataKey: {
      type: String,
      default: 'purchaseAnnouncement',
      required: true,
    },
    AssemblyIcon: String,
    MaxItems: { type: Number, default: 7, required: true },
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
    const singleLogin = singleLoginApi(currentInstance)
    const dataworp = ref({
      data: [],
      host: null,
      url: null,
    })

    const refreshInterval = 30 * 60 * 1000; // 设置定时器时间为30分钟
    const loadData = () => {
      /* dataworp.value = {
          host: "https://www.shabidding.com/ekp/",
          url: "/km/professional/km_professional_sign/",
          data: [{ "id": "18f273a6753345015452a4b4f5ab010f", "text": "上海市生态环境局自然生态保护处上海市生物多样性体验中心建设服务项目供应商领购", "catehref": "/sys/news/sys_news_main/sysNewsMain.do?method=view&fdId=18f0e933e26a30555f495ce401c96e41", "href": "/sys/news/sys_news_main/sysNewsMain.do?method=view&fdId=18f0e933e26a30555f495ce401c96e41", "otherinfo": "&nbsp<a target=", "title": "点击后可快速进入查看页面!请在2024-04-30 23:59:00之前完成领购流程!", "catename": "2105007018", "creator": "上海植物园" }]
        } */
      api.queryAssemblyData(props.DataKey).then((res) => {
        dataworp.value = res
      })
    }
    const limitedItems = computed(() => {
      return dataworp.value.data.slice(0, props.MaxItems)
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
        changeCurMenu(dataworp.value.pagekey,"已领购项目")
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
    return {
      limitedItems,
      handleLink,
      handleMore,
      loadData
    }
  },
})
</script>
