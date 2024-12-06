<script setup>
  import singleLoginApi from '@/utils/singleLogin';
  import baseUrl from '@/utils/baseUrl'
  import layout from "@/layout/layout";
  const singleLogin = singleLoginApi(getCurrentInstance())
  const callback = ()=>{
    layout.close("preformance")
  }
  singleLogin.oaJump(baseUrl.oaJumpUrl + "/j/sitc/stat/performance/#/",callback)

</script>

<template>
  <div>
    单点登录中...
  </div>
</template>

<style scoped lang="scss"></style>
