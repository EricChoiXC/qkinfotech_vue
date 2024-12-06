<script setup>
  import singleLoginApi from '@/utils/singleLogin'
  import baseUrl from '@/utils/baseUrl'
  import layout from '@/layout/layout'
  import {
    getCurrentInstance
  } from 'vue'
/**
 *
  我的公告
  http://ekpdev1.sitcbeta.loc/ekp/sys/news/?j_iframe=true&j_aside=false&categoryId=13f89f0aecc9570a269328c4ea8b510d#j_path=%2FmyNews&mydoc=create%2C%E6%88%91%E6%8F%90%E4%BA%A4%E7%9A%84&cri.q=docStatus%3A30
 */
  const singleLogin = singleLoginApi(getCurrentInstance())
  const refSrc = ref("");
  onMounted(async () => {
    refSrc.value =
      await singleLogin.ekpQuestLink(baseUrl.ekpLocalUrl +
        "/sys/news/?j_iframe=true&j_aside=false&categoryId=13f89f0aecc9570a269328c4ea8b510d#j_path=%2FmyNews&mydoc=create%2C%E6%88%91%E6%8F%90%E4%BA%A4%E7%9A%84&cri.q=docStatus%3A30")
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
