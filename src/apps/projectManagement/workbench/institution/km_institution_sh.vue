<script setup>
  import singleLoginApi from '@/utils/singleLogin'
  import baseUrl from '@/utils/baseUrl'
  import layout from '@/layout/layout'
  import {
    getCurrentInstance
  } from 'vue'

/**
上海市管理机构
http://ekpdev1.sitcbeta.loc/ekp/km/institution/?j_iframe=true&j_aside=false&categoryId=#j_path=%2FdocCategory&docCategory=171862505b23ebbe437c4b94468a1106
 */

  const singleLogin = singleLoginApi(getCurrentInstance())
  const refSrc = ref("");
  onMounted(async () => {
    refSrc.value =
      await singleLogin.ekpQuestLink(baseUrl.ekpLocalUrl +
        "/km/institution/?j_iframe=true&j_aside=false&categoryId=#j_path=%2FdocCategory&docCategory=171862505b23ebbe437c4b94468a1106")
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
