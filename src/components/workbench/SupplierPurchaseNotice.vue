<!--供应商固定-采购公告-->
<template>
  <n-card :footer-style="{ justifyContent: 'end' }">
    <template #header>
      <div class="header-div">
        <div style="font-weight: bold">
          <n-icon style="padding-top: 4px" size="20" color="blue">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
            >
              <path
                opacity=".3"
                d="M11 11h5v5h-5zm-7 0h5v5H4zm0-7h12v5H4z"
                fill="currentColor"
              ></path>
              <path
                d="M20 6v14H6v2h14c1.1 0 2-.9 2-2V6h-2z"
                fill="currentColor"
              ></path>
              <path
                d="M18 16V4c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2zM4 4h12v5H4V4zm5 12H4v-5h5v5zm2-5h5v5h-5v-5z"
                fill="currentColor"
              ></path>
            </svg>
          </n-icon>
          {{ AssemblyName }}
        </div>
      </div>
    </template>
    <div v-if="limitedItems.length == 0">
      <div style="width: 100%; display: flex; justify-content: center">
        <img src="/public/noData.jpg" style="max-height: 280px" />
      </div>
    </div>
    <n-list hoverable clickable>
      <n-list-item
        v-for="(item, index) in limitedItems"
        :key="index"
        @click="handleLink(item.href)"
      >
        <template #suffix>
          <n-space>
            <span class="classic_suffix">{{ item.creator }}</span>
            <span class="classic_suffix">{{ item.created }}</span>
          </n-space>
        </template>
        <n-ellipsis>
          <span class="cate">[{{ item.catename }}]</span>{{ item.text }}
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
import { DiceSharp, MoveOutline, EllipsisHorizontal } from '@vicons/ionicons5'
import createApi from './api'
import singleLoginApi from '@/utils/singleLogin'
import {MdRefresh} from "@vicons/ionicons4";

export default defineComponent({
  name: 'PurchaseNotice',
  props: {
    AssemblyName: {
      type: String,
      default: '采购公告',
      required: true,
    },
    DataKey: {
      type: String,
      default: 'PurchaseNoticeSupplier',
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
        changeCurMenu(dataworp.value.pagekey,"采购公告")
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
