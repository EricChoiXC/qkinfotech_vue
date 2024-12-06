<script setup>
  import singleLoginApi from '@/utils/singleLogin'
  import baseUrl from '@/utils/baseUrl'
  import layout from '@/layout/layout'
  import {
    getCurrentInstance
  } from 'vue'
/**
 *  采购预告
 */
  const singleLogin = singleLoginApi(getCurrentInstance())
  const refSrc = ref("");
  onMounted(async () => {
    refSrc.value =
      await singleLogin.ekpQuestLink(baseUrl.ekpLocalUrl +
        "/sys/news/?j_iframe=true&j_aside=false#j_path=%2FdocCategory&docCategory=16f434fad462dfeec84fc6a419b9ef06&cri.q=docStatus%3A30")
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
