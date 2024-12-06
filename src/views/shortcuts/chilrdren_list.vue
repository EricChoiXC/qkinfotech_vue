<template>
  <n-card :footer-style="{ justifyContent: 'end' }">
    <template #header>
      <div class="header-div">
        <div style="padding-left: 20px; font-weight: bold">
          <n-icon size="20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
            >
              <path
                d="M21 11l-6-6v5H8c-2.76 0-5 2.24-5 5v4h2v-4c0-1.65 1.35-3 3-3h7v5l6-6z"
                fill="currentColor"
              ></path>
            </svg>
          </n-icon>
          快捷方式
        </div>
      </div>
    </template>
    <div class="icon-item" v-for="item in shortcutsData" :key="item.fId">
      <n-icon size="60" color="#0e7a0d">
        <img :src="item.fIconUrl" class="" @click="openUrl(item.fUrl)" />
      </n-icon>
      <span>{{ item.fName }}</span>
    </div>
  </n-card>
</template>
<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import context from '@/context.js'

import storage from '@/utils/storage'
import createApi from './api'

const api = createApi(getCurrentInstance())
const shortcutsData = ref([])

function openUrl(url) {
  window.open(url, '_blank')
}

onMounted(async () => {
  const param = {
    userId: context.user(),
  }
  const res = await api.shortcutsUserList(param)
  shortcutsData.value = res.data
})
</script>

<style lang="scss" scoped>
.icon-item {
  display: inline-block;
  width: 100px;
  /* 或其他宽度 */
  box-sizing: border-box;
  border: 1px solid rgb(239, 239, 245);
  padding: 5px;
  text-align: center;
  margin: 10px 0px 0px 17px;

  span {
    display: block;
  }
}

.icon-item:hover {
  background-color: #f0f0f0;
  /* 鼠标移入时的背景色 */
}
</style>
