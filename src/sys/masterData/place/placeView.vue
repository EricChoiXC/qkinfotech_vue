<template>
  <n-form ref="formRef" inline :label-width="80" :model="data">
    <n-table>
      <tbody>
        <tr>
          <th style="width: 20%; text-align: center">城市</th>
          <td style="text-align: center">
            <n-form-item path="fName">
              {{ data.fName }}
            </n-form-item>
          </td>
        </tr>

        <tr>
          <th style="width: 20%; text-align: center">国家</th>
          <td style="text-align: center">
            <n-form-item path="fName">
              {{ data.fParentId.fName }}
            </n-form-item>
          </td>
        </tr>

        <tr>
          <th style="width: 20%; text-align: center">城市编号</th>
          <td style="text-align: center">
            <n-form-item path="fCityNum">
              {{ data.fCityNum }}
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

const data = ref({
  fName: '',
  fId: '',
  fParentId: {},
  fCityNum: '',
})
const route = useRoute()

const info = (id) => {
  api.load({ fId: id }).then((res) => {
    console.log('res')
    data.value = res.data
  })
}
//关闭
const closeWindow = () => {
  layout.close('masterDataPlaceView');
}

const id = menuStore.currentRouteObj.urlParams.fId // 使用 ref 来创建响应式数据
// watch(
//   () => route.query.fId,
//   (newFId) => {
//     id.value = newFId;
//     // 在这里可以执行其他逻辑，例如调用处理方法等
handleRouteChange(newFId)
//   }
// );

// 处理路由变化的方法
const handleRouteChange = (newFId) => {
  info(newFId)
}

// 在组件加载时初始化数据
// onMounted(() => {
//   // 初始时获取一次路由参数
//   id.value = route.query.fId;;
// })
</script>

<style></style>
