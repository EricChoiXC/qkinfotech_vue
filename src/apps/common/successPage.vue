<template>
  <n-result status="success" title="成功" description="操作成功！">
    <template #footer>
      <n-button @click="closeWindow">关闭页面</n-button>
    </template>
  </n-result>
</template>

<script setup>
  import layout from "@/layout/layout";
  //关闭
  const closeWindow = () => {
    layout.close('actionSuccess');
  }
</script>
