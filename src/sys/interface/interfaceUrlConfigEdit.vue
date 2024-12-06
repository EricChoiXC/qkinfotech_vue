<template>
  <n-form ref="formRef" :model="data">
    <n-form-item label="所属系统" path="fInterfaceSystem">
      <n-input v-model:value="data.fInterfaceSystem" />
    </n-form-item>
    <n-form-item label="接口key" path="fInterfaceKey">
      <n-input v-model:value="data.fInterfaceKey" />
    </n-form-item>
    <n-form-item label="接口名称" path="fInterfaceName">
      <n-input v-model:value="data.fInterfaceName" />
    </n-form-item>
    <n-form-item label="接口地址" path="fInterfaceUrl">
      <n-input v-model:value="data.fInterfaceUrl" />
    </n-form-item>
    <n-form-item>
      <n-space style="display: flex; justify-content: center">
        <n-button type="primary" @click="handleSubmit">提交</n-button>
        <n-button type="error" @click="closeWindow">关闭</n-button>
      </n-space>
    </n-form-item>
  </n-form>
</template>

<script setup>
import { ref } from 'vue'
import { NCard, NSpace, NText, NTag } from 'naive-ui'
import createApi from './api'
import { useRoute } from 'vue-router'
import { useMenuStore } from '@/store/menu.js'
const menuStore = useMenuStore()
const api = createApi(getCurrentInstance())
const props = defineProps({
  viewData: Object,
})
const data = ref({
  fId: props.viewData.fId,
  fInterfaceSystem: props.viewData.fInterfaceSystem,
  fInterfaceKey: props.viewData.fInterfaceKey,
  fInterfaceName: props.viewData.fInterfaceName,
  fInterfaceUrl: props.viewData.fInterfaceUrl,
})
const emit = defineEmits()
const handleSubmit = async () => {
  await api.urlConfigSave(data.value)
  emit('closeModal')
}
const closeWindow = () => {
  emit('closeModal')
}
</script>

<style></style>
