<template>
  <n-form ref="formRef" inline :label-width="80" :model="data">
    <n-table>
      <tbody>
        <tr>
          <th style="width: 20%; text-align: center">名称</th>
          <td style="text-align: center">
            <n-form-item path="fName">
              {{ data.fName }}
            </n-form-item>
          </td>
        </tr>
        <tr>
          <th style="width: 20%; text-align: center">编号</th>
          <td style="text-align: center">
            <n-form-item path="fNumber">
              {{ data.fNumber }}
            </n-form-item>
          </td>
        </tr>
        <tr>
          <th style="width: 20%; text-align: center">项目模式</th>
          <td style="text-align: center">
            <n-form-item>
              {{ namesArray.join(',') }}
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

const api = createApi(getCurrentInstance())
const data = ref({
  fName: '',
  fNumber: '',
  fId: '',
})

const namesArray = ref([])
const route = useRoute()
// const id = route.query.fId;
const info = (id) => {
  var query = []
  query.push({
    eq: {
      'fMasterDataCategoryId.fId': id,
    },
  })
  api
    .categoryModeList({
      query: query,
    })
    .then((res) => {
      res.data.list.forEach((item) => {
        namesArray.value.push(item.fMasterDataModeId.fName)
      })
    })
  api.load({ fId: id }).then((res) => {
    data.value = res.data
  })
}

  const menuStore = useMenuStore();
  //关闭
  const closeWindow = () => {
    layout.close('masterDataCategoryView');
  }

const modeData = reactive({
  //项目性质
  selectedMode: [],
  selecteModes: [],
  fModes: [],
})

// onMounted(() => {
//   info();
// })
const id = menuStore.currentRouteObj.urlParams.fId // 使用 ref 来创建响应式数据
// 使用 watch 监听路由参数的变化
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
