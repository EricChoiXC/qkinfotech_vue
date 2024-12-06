<!--我的流程-->
<template>
  <n-card :footer-style="{ justifyContent: 'end' }">
    <template #header>
      <div class="header-div">
        <div style="font-weight: bold">
          <n-icon style="padding-top: 4px" size="20" color="blue">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 20 20"
            >
              <g fill="none">
                <path
                  d="M4 4.5A2.5 2.5 0 0 1 6.5 2h7A2.5 2.5 0 0 1 16 4.5v13a.5.5 0 0 1-.794.404L10 14.118l-5.206 3.786A.5.5 0 0 1 4 17.5v-13zM6.5 3A1.5 1.5 0 0 0 5 4.5v12.018l4.706-3.422a.5.5 0 0 1 .588 0L15 16.518V4.5A1.5 1.5 0 0 0 13.5 3h-7z"
                  fill="currentColor"
                ></path>
              </g>
            </svg>
          </n-icon>
          {{ AssemblyName }}
        </div>
      </div>
    </template>
    <template #header-extra>
      <n-icon size="20">
        <svg
          t="1721877331690"
          class="icon"
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          p-id="6013"
          width="200"
          height="200"
        >
          <path
            d="M358.08 904.32v-0.64s-1.92-2.24-2.88-3.2-0.96-1.6-1.28-2.24l-1.92-2.88-101.76-156.8a84.8 84.8 0 0 1-12.16-62.08c3.84-21.44 16-40.32 33.92-52.8 23.36-16 53.44-18.24 79.04-5.76v-261.76c0-45.44 34.24-82.56 76.16-82.56s76.48 37.12 76.48 82.56v84.16c6.08-1.92 12.8-3.2 19.2-3.2 19.84 0 38.72 9.6 51.84 26.24 10.24-6.72 22.4-10.56 34.88-10.88 14.4 0 28.16 5.12 39.36 13.76 8.64 6.72 16 15.68 21.44 25.92 6.08-1.92 12.8-2.88 19.2-2.88 39.04 0 71.04 37.12 71.04 82.56v219.84c0 48.64-21.44 102.4-54.72 136.96-18.56 19.2-38.4 30.08-56.32 30.08h-217.28c-40.64 0-58.88-30.08-73.6-54.4z m295.36 13.76c6.72 0 23.04-10.88 39.04-35.52 17.28-26.24 27.2-57.6 27.2-86.08v-225.92c0-18.56-11.52-34.56-24.32-34.56-2.88 0-5.76 0.64-8.32 2.24v79.04c-0.96 13.12-11.52 23.68-24.32 23.68s-23.68-10.56-24.32-23.68v-68.48l-1.6-19.2c-1.28-17.28-12.16-31.04-24.64-31.04-5.44 0-10.88 2.88-15.36 8v85.44c0 14.08-10.88 25.28-24.64 25.28-13.44 0-24.32-11.52-24.64-25.28v-75.2l-1.92-8.64c-2.88-14.72-13.12-25.6-23.36-25.6-7.04 0-14.08 5.12-18.88 13.12l-0.64 84.8v32c0 12.48-9.92 22.4-21.76 22.4h-5.44c-12.16 0-21.76-10.24-21.76-22.4v-264.32c0-18.88-13.44-34.56-30.08-34.56s-29.76 15.36-29.76 34.56l0.96 247.36V696c0 12.48-9.28 23.36-21.44 24.96-12.16 1.6-23.68-6.4-26.88-18.56l-9.28-27.84c-4.8-7.68-12.48-12.8-21.12-14.72a31.36 31.36 0 0 0-24.96 5.12c-15.36 10.56-19.52 32-8.96 48l104.64 160.96h0.32l1.28 2.56 1.6 2.56c0.96 1.6 1.92 3.2 2.88 4.48l0.64 0.96 0.64 0.96c16.32 26.88 22.72 32.64 34.88 32.64h224.32zM300.16 240.32L218.56 158.72s-1.92-3.2-1.92-4.8 0.64-3.52 1.92-4.8l81.6-81.6c1.92-1.92 5.12-2.56 7.68-1.6 2.56 0.96 4.16 3.52 4.16 6.4v162.88c0 2.88-1.6 5.44-4.16 6.4s-5.44 0.64-7.68-1.6z m423.36 0c-1.92 1.92-5.12 2.56-7.68 1.6a6.688 6.688 0 0 1-4.16-6.4v-163.2c0-2.88 1.6-5.44 4.16-6.4s5.44-0.32 7.68 1.6l81.6 81.6s1.92 3.2 1.92 4.8c0 1.92-0.64 3.52-1.92 4.8l-81.6 81.6z m-423.36 0"
            p-id="6014"
          ></path>
          <path d="M302.4 130.24h416.96v46.4H302.4z" p-id="6015"></path>
        </svg>
      </n-icon>
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
import { MdRefresh } from '@vicons/ionicons4'
import createApi from './api'
import singleLoginApi from '@/utils/singleLogin'

export default defineComponent({
  name: 'UserProcess',
  props: {
    AssemblyName: {
      type: String,
      default: '我的流程',
      required: true,
    },
    DataKey: {
      type: String,
      default: 'UserProcess',
      required: true,
    },
    AssemblyIcon: String,
    MaxItems: { type: Number, default: 7, required: true },
  },
  components: {
    DiceSharp,
    MoveOutline,
    EllipsisHorizontal,
    MdRefresh
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
      singleLogin.ekpJump(`${dataworp.value.host}${url}`)
    }
   const changeCurMenu = inject("changeCurMenu")
   const handleMore = () => {
     if (dataworp.value.pagekey !== "") {
       changeCurMenu(dataworp.value.pagekey,"我的流程")
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
