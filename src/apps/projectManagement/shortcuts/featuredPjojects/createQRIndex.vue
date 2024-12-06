<script setup>
  import singleLoginApi from '@/utils/singleLogin'
  import baseUrl from '@/utils/baseUrl'
  import layout from '@/layout/layout'
  import {
    getCurrentInstance
  } from 'vue'
/**
 *  签到码生成
 */
  const singleLogin = singleLoginApi(getCurrentInstance())
  const refSrc = ref("");
  onMounted(async () => {
    refSrc.value =
      baseUrl.ekpLocalUrl +
        "/resource/expert/km_expert_person/expertSign.do?method=createQRIndex"
  })
</script>

<template>
  <iframe :src="refSrc"></iframe>
</template>

<style scoped lang="scss">
  body,
  html {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  iframe {
    width: 100%;
    height: 780px;
    border: none;
  }
</style>
