<template>
  <n-form ref="formRef" :model="props.viewData" :disabled="true">
    <n-form-item label="所属系统" path="data.fInterfaceSystem">
      <n-input v-model:value="props.viewData.fInterfaceSystem" />
    </n-form-item>
    <n-form-item label="接口key" path="data.fInterfaceKey">
      <n-input v-model:value="props.viewData.fInterfaceKey" />
    </n-form-item>
    <n-form-item label="接口名称" path="data.fInterfaceName">
      <n-input v-model:value="props.viewData.fInterfaceName" />
    </n-form-item>
    <n-form-item label="接口地址" path="data.fInterfaceUrl">
      <n-input v-model:value="props.viewData.fInterfaceUrl" />
    </n-form-item>
    <n-form-item>
      <n-space style="display: flex;justify-content: center;">
        <n-button type="error" @click="closeWindow">关闭</n-button>
      </n-space>
    </n-form-item>
  </n-form>
</template>

<script setup>
  import {
    ref
  } from 'vue';
  import {
    NCard,
    NSpace,
    NText,
    NTag
  } from 'naive-ui';
  import {
    useRoute
  } from "vue-router"
  import {
    useMenuStore
  } from '@/store/menu.js'
  const menuStore = useMenuStore();

  const props = defineProps({
    viewData: Object,
  })

  const data = ref({
    fInterfaceSystem: '',
    fInterfaceKey: '',
    fInterfaceName: '',
    fInterfaceUrl: '',
    fCreateTime: new Date(),
  });
  const emit = defineEmits();
  const closeWindow = () => {
    emit('closeModal');
  }
</script>

<style></style>
