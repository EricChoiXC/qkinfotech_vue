<template>
  <n-form ref="formRef" inline :label-width="80" :model="data">
    <n-table>
      <tbody>
        <tr>
          <th style="width: 20%; text-align: center">项目性质</th>
          <td style="text-align: center">
            <n-form-item path="fName">
              {{ data.fName || '加载中...' }}
            </n-form-item>
          </td>
        </tr>
        <tr>
          <th style="width: 20%; text-align: center">
            说明内容
          </th>
          <td>
            <n-form-item label="" path="fNote">
              {{ data.fNote || '' }}
            </n-form-item>
          </td>
        </tr>
        <tr>
          <th style="width: 20%; text-align: center">
            排序号
          </th>
          <td>
            <n-form-item label="" path="fOrder">
              {{data.fOrder}}
            </n-form-item>
          </td>
        </tr>
        <tr>
          <th style="width: 20%; text-align: center">
            前置性质
          </th>
          <td>
            <n-form-item label="" path="fPreNature">
              <n-select v-model:value="data.selectedPreNature" multiple :options="natures" disabled></n-select>
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
import {NCard, NSpace, NText, NTag, NInput, NFormItem} from 'naive-ui'
import createApi from './api'
import { useRoute } from 'vue-router'
import { useMenuStore } from '@/store/menu.js'
import layout from "@/layout/layout";

const menuStore = useMenuStore()
const api = createApi(getCurrentInstance())

const loading = ref(true) // 添加加载状态标识
const data = ref({
  fId: '',
  fName: '',
  fNote: '',
  fOrder: 0,
  fPreNature: '',
  selectedPreNature: []
}) // 初始化 data 以避免 undefined
const natures = ref([])

const route = useRoute()
const fetchNature = async (id) => {
  await api.list().then((res) => {
    natures.value.length = 0
    for (var i=0; i<res.data.list.length; i++) {
      natures.value.push({
        label: res.data.list[i].fName,
        value: res.data.list[i].fId,
        key: res.data.list[i].fId
      })
    }
  })
  api
    .load({ fId: id })
    .then((res) => {
      for (var key in res.data) {
        if (data.value[key] != undefined) {
          data.value[key] = res.data[key]
        }
      }
      data.value.selectedPreNature = []
      for (var i=0; i<data.value.fPreNature.split(";").length; i++) {
        if (data.value.fPreNature.split(";")[i]) {
          data.value.selectedPreNature.push(data.value.fPreNature.split(";")[i])
        }
      }
      loading.value = false
    })
    .catch((error) => {
      console.error('Error fetching nature data:', error)
      loading.value = false
    })
}

const closeWindow = () => {
  layout.close('masterDataNatureView');
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
  fetchNature(newFId)
}
handleRouteChange(id)
// 在组件加载时初始化数据
// onMounted(() => {
//   // 初始时获取一次路由参数
//   id.value = route.query.fId;;
// })
</script>

<style></style>
