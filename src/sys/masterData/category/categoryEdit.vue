<template>
  <n-form ref="formRef" :rules="rules" inline :label-width="80" :model="data">
    <n-table>
      <tbody>
        <tr>
          <th style="width: 20%; text-align: center">
            名称<span style="color: red">*</span>
          </th>
          <td>
            <n-form-item label="" path="fName">
              <n-input
                v-model:value="data.fName"
                style="display: inline-block"
                placeholder="请输入名称"
              ></n-input>
            </n-form-item>
          </td>
        </tr>

        <tr>
          <th style="width: 20%; text-align: center">
            编号<span style="color: red">*</span>
          </th>
          <td>
            <n-form-item label="" path="fNumber">
              <n-input
                v-model:value="data.fNumber"
                style="display: inline-block"
                placeholder="请输入编号"
              ></n-input>
            </n-form-item>
          </td>
        </tr>

        <tr>
          <th style="width: 20%; text-align: center">
            项目模式<span style="color: red">*</span>
          </th>
          <td>
            <n-form-item path="selectedMode">
              <n-checkbox-group
                v-model:value="data.selectedMode"
                @update:value="handleUpdateMode"
              >
                <n-checkbox
                  v-for="(item, index) in modeData.fModes"
                  :key="index"
                  :value="item.fId"
                  :label="item.fName"
                >
                  {{ item.fName }}
                </n-checkbox>
              </n-checkbox-group>
            </n-form-item>
          </td>
        </tr>

        <tr>
          <td colspan="2">
            <n-space style="display: flex; justify-content: center">
              <n-button type="primary" @click="check">提交</n-button>
              <n-button type="error" @click="closeWindow">关闭</n-button>
            </n-space>
          </td>
        </tr>
      </tbody>
    </n-table>
  </n-form>
</template>

<script setup>
import createApi from './api'
import createModeApi from '../mode/api'
import { useMenuStore } from '@/store/menu.js'
import { useRoute } from 'vue-router'
import { reactive, ref } from 'vue'
import {
  NForm,
  NGrid,
  NGridItem,
  NFormItem,
  NInput,
  NDatePicker,
  useDialog,
  useMessage,
  c,
} from 'naive-ui'
import layout from '@/layout/layout'

const currentInstance = getCurrentInstance()
const api = createApi(currentInstance)
const modeApi = createModeApi(currentInstance)
const message = useMessage()
const formRef = ref(null)
const menuStore = useMenuStore()

const route = useRoute()
//输入规则
const rules = ref({
  fName: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur',
    },
  ],
  fNumber: [
    {
      required: true,
      message: '请输入编号',
      trigger: 'blur',
    },
  ],
  selectedMode: {
    type: 'array',
    required: true,
    trigger: 'change',
    message: '请选择项目模式',
  },
})
//formdata
const data = reactive({
  fName: '',
  fKey: 16,
  fId: '',
  selectedMode: [],
  fNumber: '',
})
// 项目模式 checkbox
const modeData = reactive({
  fModes: [],
})

//选择项目模式事件
const handleUpdateMode = (v) => {
  data.selectedMode = v // 更新整个数组的值
}

//初始化方法
async function info(newFId) {
  data.length = 0
  await api.load({ fId: newFId }).then((res) => {
    data.fName = res.data.fName
    data.fNumber = res.data.fNumber
    data.fId = res.data.fId
  })
  var query = []
  query.push({
    eq: {
      'fMasterDataCategoryId.fId': newFId,
    },
  })
  await api
    .list({
      query: query,
    })
    .then((res) => {
      // 清除旧的选择
      data.selectedMode.length = 0
      res.data.list.forEach((item) => {
        data.selectedMode.push(item.fMasterDataModeId.fId)
        // modeIds.push(item.fId)
      })
    })
}

const check = async () => {
  formRef.value.validate()

  const nameQuery = [{ eq: { fName: data.fName } }]
  const nameResponse = await api.list({
    query: nameQuery,
  })

  const numberQuery = [{ eq: { fNumber: data.fNumber } }]
  const numberRes = await api.list({
    query: numberQuery,
  })

  if (
    nameResponse.data.list.length > 0 &&
    nameResponse.data.list[0].fId != data.fId
  ) {
    message.error('已存在相同名称')
    return
  }
  if (
    numberRes.data.list.length > 0 &&
    numberRes.data.list[0].fId != data.fId
  ) {
    message.error('已存在相同编号')
    return
  }
  handleSubmit()
}

// 删除不必要的项目模式
const deleteUnnecessaryModes = async (itemsToDelete) => {
  const deletePromises = itemsToDelete.map(async (item) => {
    if (!data.selectedMode.includes(item.fMasterDataModeId.fId)) {
      return api.delete({ fId: [item.fId] })
    }
  })

  // 筛选出有效的 Promise
  const validDeletePromises = deletePromises.filter(Boolean)

  // 等待所有删除操作完成
  await Promise.all(validDeletePromises)
}

// 插入新的项目模式
const insertNewModes = async (currentModes) => {
  const modesToInsert = data.selectedMode.filter(
    (modeId) =>
      !currentModes.some(
        (currentMode) => currentMode.fMasterDataModeId.fId === modeId,
      ),
  )

  const insertPromises = modesToInsert.map(async (modeId) => {
    const fMasterDataCategoryId = { fId: data.fId }
    const fMasterDataModeId = { fId: modeId }
    const a = { fMasterDataCategoryId, fMasterDataModeId }

    return api.categoryModeSave(a)
  })

  // 等待所有插入操作完成
  await Promise.all(insertPromises)
}

const handleSubmit = async () => {
  var query = [{ eq: { 'fMasterDataCategoryId.fId': data.fId } }]

  // 将 categoryMode 查询出来
  var categoeyModeList = await api.categoryModeList({
    query: query,
  })

  // 删除不必要的项目模式
  await deleteUnnecessaryModes(categoeyModeList.data.list)

  // 再查询数据库，将 selectedMode 剩下的插入进去
  var addCategoeyModeList = await api.categoryModeList({ query: query })

  // 插入新的项目模式
  await insertNewModes(addCategoeyModeList.data.list)

  // 清空 selectedMode
  data.selectedMode.length = 0

  // 最后保存主数据
  await api.save(data).then((res) => {
    layout.close('masterDataCategoryEdit')
    layout.open({
      label: '成功页面',
      key: 'actionSuccess',
      component: '/apps/common/successPage.vue',
    })
  })
}

const masterList = {
  ModeList: async (url, filter) => {
    //项目性质 初始化
    modeApi
      .list()
      .then((result) => {
        const dataList = result.data.list
        modeData.fModes.length = 0
        for (let i = 0; i < dataList.length; i++) {
          const obj = {
            fName: dataList[i].fName,
            fId: dataList[i].fId,
          }
          modeData.fModes.push(obj)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  },
}

const dialog = useDialog()
//关闭
const closeWindow = () => {
  dialog.warning({
    title: '警告',
    content: '是否关闭此窗口？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      // window.close()
      layout.close('masterDataCategoryEdit')
    },
  })
}

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
  masterList.ModeList(newFId)
  info(newFId)
}
handleRouteChange(id)
// 在组件加载时初始化数据
// onMounted(() => {
//   // 初始时获取一次路由参数
//   id.value = route.query.fId;;
// })
</script>

<style scoped></style>
