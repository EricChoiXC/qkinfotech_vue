<template>
  <div v-if="!loading">
    <n-form ref="formRef" inline :label-width="80" :model="data">
      <n-table>
        <tbody>
          <tr>
            <th style="width: 20%; text-align: center">名称</th>
            <td style="text-align: center">
              <n-form-item path="fName">
                {{ data.fName || '加载中...' }}
              </n-form-item>
            </td>
          </tr>
          <tr>
            <th style="width: 20%; text-align: center">所属分组</th>
            <td style="text-align: center">
              <n-form-item path="fGroup">
                {{ data.fGroup || '加载中...' }}
              </n-form-item>
            </td>
          </tr>
          <tr>
            <th style="width: 20%; text-align: center">类型标签</th>
            <td style="text-align: center">
              <n-form-item path="fTypeTag">
                {{ data.fTypeTag }}
              </n-form-item>
            </td>
          </tr>
          <tr>
            <th style="width: 20%; text-align: center">项目规模</th>
            <td style="text-align: center">
              <n-form-item path="fScale">
                {{ namesArray.length > 0 ? namesArray.join(',') : '加载中...' }}
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

const loading = ref(true) // 加载状态标识
const data = ref({ fName: '' })
const namesArray = ref([])

const route = useRoute()

const fetchData = async (id) => {
  try {
    const [typeRes, scaleRes, typeTags] = await Promise.all([
      api.load({ fId: id }),
      api.typeScaleList({
        query: [{ eq: { 'fMasterDataTypeId.fId': id } }],
      }),
      api.tagList({
        query: [{ eq: { 'fMasterDataType.fId': id } }],
      }),
    ])

    data.value = typeRes.data
    scaleRes.data.list.forEach((item) => {
      namesArray.value.push(item.fMasterDataScaleId.fName)
    })
    if (typeTags.status == 200) {
      data.value.fTypeTag = ''
      typeTags.data.list.forEach((value) => {
        data.value.fTypeTag += value.fMasterDataTag.fName + '；'
      })
    }

    loading.value = false // 所有数据加载完成后关闭加载状态
  } catch (error) {
    console.error('Error fetching data:', error)
    loading.value = false // 即使有错误也关闭加载状态
  }
}

//关闭
const closeWindow = () => {
  layout.close('masterDataTypeView')
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
  fetchData(newFId)
}
handleRouteChange(id)
// onMounted(() => {
//   id.value = route.query.fId;;
// });
</script>

<style>
/* 保持原有样式 */
</style>
