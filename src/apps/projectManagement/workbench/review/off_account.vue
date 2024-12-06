<script setup>
  import singleLoginApi from '@/utils/singleLogin'
  import baseUrl from '@/utils/baseUrl'
  import layout from '@/layout/layout'
  import {
    getCurrentInstance
  } from 'vue'

/**
公众号
http://ekpdev1.sitcbeta.loc/ekp/km/review/?j_iframe=true&j_aside=false#j_path=%2FlistAll&mydoc=all&cri.q=fdTemplate%3A178d98a0af3ede0b699e4684eb3b4db2
 */

  const singleLogin = singleLoginApi(getCurrentInstance())
  const refSrc = ref("");
  onMounted(async () => {
    refSrc.value =
      await singleLogin.ekpQuestLink(baseUrl.ekpLocalUrl +
        "/km/review/?j_iframe=true&j_aside=false#j_path=%2FlistAll&mydoc=all&cri.q=fdTemplate%3A178d98a0af3ede0b699e4684eb3b4db2")
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
