<script setup>
  import singleLogin from '@/utils/singleLogin';
  import baseUrl from '@/utils/baseUrl'
  import layout from "@/layout/layout";

  const api = singleLogin(getCurrentInstance())
  const refSrc = ref("");
  onMounted(async () => {
    refSrc.value =
      await api.ekpQuestLink(baseUrl.ekpLocalUrl +
        "/sitc/project/sitc_project_visit_main/index.jsp?j_iframe=true&j_aside=false")
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
