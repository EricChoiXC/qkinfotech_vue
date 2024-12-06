<template>
  <n-form ref="formRef" inline :label-width="80" :model="data">
    <n-table>
      <tbody>
        <tr>
          <th style="width: 20%; text-align: center">项目会议类型</th>
          <td style="text-align: center">
            <n-form-item path="fName">
              {{ data.fName || '加载中...' }}
            </n-form-item>
          </td>
        </tr>
        <tr>
          <th style="text-align: center">所属会议</th>
          <td>
            <n-form-item path="fMeetingKey">
              <n-select
                v-model:value="data.fMeetingKey"
                :options="options"
                disabled
              />
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

const options = [
  {
    label: '资格预审',
    value: '1',
  },
  {
    label: '汇报评审',
    value: '2',
  },
]

const data = ref({})
const loading = ref(true) // 新增加载状态标识符
const route = useRoute()

const info = async (id) => {
  await api.load({ fId: id }).then((res) => {
    data.value = res.data || {}
    loading.value = false // 加载完成后将 loading 设置为 false
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
