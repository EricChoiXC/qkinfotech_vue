<template>
  <div v-if="!loading">
    <n-form ref="formRef" inline :label-width="80" :model="data">
      <n-table>
        <tbody>
          <tr>
            <th style="width: 20%; text-align: center">项目规模</th>
            <td style="text-align: center">
              <n-form-item path="fName">
                {{ data?.fName || '加载中...' }}
              </n-form-item>
            </td>
          </tr>
          <tr>
            <th style="width: 20%; text-align: center">所属分组</th>
            <td style="text-align: center">
              <n-form-item path="fGroup">
                {{ data?.fGroup || '加载中...' }}
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
  </div>
  <div v-else>Loading...</div>
</template>

<script setup>
import { ref } from 'vue'
import createApi from './api'
import { useRoute } from 'vue-router'
import { useMenuStore } from '@/store/menu.js'
import layout from "@/layout/layout";

const menuStore = useMenuStore()
const api = createApi(getCurrentInstance())

const data = ref({ fName: '' })

const route = useRoute()
const info = (id) => {
  api
    .load({ fId: id })
    .then((res) => {
      data.value = res.data || {}
    })
    .catch((error) => {
      console.error('Error fetching data:', error)
    })
}

//关闭
const closeWindow = () => {
  layout.close('masterDataScaleView')
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
