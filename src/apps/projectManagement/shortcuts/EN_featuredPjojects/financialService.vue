<script setup>
  import singleLoginApi from '@/utils/singleLogin'
  import baseUrl from '@/utils/baseUrl'
  import layout from '@/layout/layout'
  import {
    getCurrentInstance
  } from 'vue'
/**
 *  Financial Service
 */
  const singleLogin = singleLoginApi(getCurrentInstance())
  const refSrc = ref("");
  onMounted(async () => {
    refSrc.value =
      await singleLogin.ekpQuestLink(baseUrl.ekpLocalUrl +
        "/sys/news/?j_iframe=true&j_aside=false#j_path=%2FdocCategory&docCategory=17433c14d7c3af7f1430e294e3685507&cri.q=docStatus%3A30%3BdisplayRange%3A35")
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
