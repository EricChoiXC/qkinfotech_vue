<template>
  <n-form ref="formRef" inline :label-width="80" :model="data">
    <n-table>
      <tbody>
        <tr>
          <th style="width: 20%; text-align: center">项目模式</th>
          <td style="text-align: center">
            <n-form-item path="fName">
              {{ data.fName || '数据加载中...' }}
            </n-form-item>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <n-space style="display: flex; justify-content: center">
              <n-button type="error" @click="closeWindow">关闭</n-button>
            </n-space>
          </td>
        </tr>
      </tbody>
    </n-table>
  </n-form>
</template>

<script setup>
import { ref } from 'vue'
import { NCard, NSpace, NText, NTag } from 'naive-ui'
import createApi from './api'
import { useRoute } from 'vue-router'
import { useMenuStore } from '@/store/menu.js'
import layout from "@/layout/layout";

const menuStore = useMenuStore()
const api = createApi(getCurrentInstance())

const loading = ref(true) // 添加一个加载状态标识符
const data = ref({ fName: '' })

const route = useRoute()
const info = (id) => {
  api
    .load({ fId: id })
    .then((res) => {
      data.value = res.data || {} // 确保data至少是一个对象
      loading.value = false // 数据加载完成，设置加载状态为false
    })
    .catch((error) => {
      console.error('Error fetching data:', error)
      loading.value = false // 即使加载失败，也要关闭加载状态
    })
}

//关闭
const closeWindow = () => {
  layout.close('masterDataImportanceview')
}
const id = menuStore.currentRouteObj.urlParams.fId // 使用 ref 来创建响应式数据
// watch(
//   () => route.query.fId,
//   (newFId) => {
//     id.value = newFId;
//     // 在这里可以执行其他逻辑，例如调用处理方法等

//   }
// );

// 处理路由变化的方法
const handleRouteChange = (newFId) => {
  info(newFId)
}
handleRouteChange(id)
// 在组件加载时初始化数据
// onMounted(() => {
//   // 初始时获取一次路由参数
//   id.value = route.query.fId;;
// })
</script>

<style></style>
