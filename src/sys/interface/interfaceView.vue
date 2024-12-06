<template>
  <n-form ref="formRef" inline :label-width="80" :model="data">
    <n-table>
      <tbody>
        <tr>
          <th style="width: 20%; text-align: center">接口名称</th>
          <td style="text-align: center">
            <n-form-item path="fInterfaceName">
              {{ data?.fInterfaceName || '加载中...' }}
            </n-form-item>
          </td>
        </tr>

        <tr>
          <th style="width: 20%; text-align: center">接口地址</th>
          <td style="text-align: center">
            <n-form-item path="fInterfaceUrl">
              {{ data?.fInterfaceUrl || '加载中...' }}
            </n-form-item>
          </td>
        </tr>

        <tr>
          <th style="width: 20%; text-align: center">调用时间</th>
          <td style="text-align: center">
            <n-form-item path="fCreateTime">
              {{ data?.fCreateTime || '加载中...' }}
            </n-form-item>
          </td>
        </tr>

        <tr>
          <th style="width: 20%; text-align: center">项目编号</th>
          <td style="text-align: center">
            <n-form-item path="fProtocolNo">
              {{ data?.fProtocolNo || '加载中...' }}
            </n-form-item>
          </td>
        </tr>

        <tr>
          <th style="width: 20%; text-align: center">入参</th>
          <td style="text-align: center">
            <n-form-item path="fInputParameter">
              {{ data?.fInputParameter || '加载中...' }}
            </n-form-item>
          </td>
        </tr>

        <tr>
          <th style="width: 20%; text-align: center">状态</th>
          <td style="text-align: center">
            <n-form-item path="fInterfaceStatus">
              {{ data.fInterfaceStatus }}
            </n-form-item>
          </td>
        </tr>

        <tr>
          <th style="width: 20%; text-align: center">接口返回信息</th>
          <td style="text-align: center">
            <n-form-item path="fInterfaceInfo">
              {{ data?.fInterfaceInfo || '加载中...' }}
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

const data = ref({ value: {} })
const loading = ref(true) // 新增加载状态

const route = useRoute()
/**获取 数据 */
const info = async (id) => {
  await api.logLoad({ fId: id }).then((res) => {
    data.value = res.data || {} // 确保 data.value 总是一个对象
    loading.value = false // 数据加载完成，设置 loading 为 false
  })
}

//关闭
const closeWindow = () => {
  layout.close('interfaceInfoView')
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
// 初始时获取一次路由参数
// id = menuStore.currentRouteObj.urlParams.fId;
// })
</script>

<style></style>
