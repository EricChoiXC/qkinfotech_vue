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
            所属分组<span style="color: red">*</span>
          </th>
          <td>
            <n-form-item label="" path="fGroup">
              <n-select
                v-model:value="data.fGroup"
                :options="optionsVal.fGroup"
              ></n-select>
            </n-form-item>
          </td>
        </tr>
<!--
        <tr>
          <th style="width: 20%; text-align: center">
            项目规模<span style="color: red">*</span>
          </th>
          <td>
            <n-form-item label="" path="selectedScale">
              <n-checkbox-group
                v-model:value="data.selectedScale"
                @update:value="handleUpdateScale"
              >
                <n-checkbox
                  v-for="(item, index) in scaleData.fScales"
                  :key="index"
                  :value="item.fId"
                  :label="item.fName"
                >
                  {{ item.fName }}
                </n-checkbox>
              </n-checkbox-group>
            </n-form-item>
          </td>
        </tr> -->

        <tr>
          <th style="width: 20%; text-align: center">
            项目标签<span style="color: red">*</span>
          </th>
          <td>
            <n-form-item label="" path="selectedTag">
              <n-checkbox-group v-model:value="data.selectedTag">
                <n-checkbox
                  v-for="(item, index) in option.tags"
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
import createTagApi from '../tag/api'
import createScaleApi from '../scale/api'

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
} from 'naive-ui'
import { useMenuStore } from '@/store/menu.js'
import publicValues from '@/utils/publicValues'
import layout from '@/layout/layout'

const currentInstance = getCurrentInstance()
const api = createApi(currentInstance)
const tagApi = createTagApi(currentInstance)
const scaleApi = createScaleApi(currentInstance)
const optionsVal = ref({
  fGroup: publicValues.fGroups,
})

const option = ref({
  tags: [],
})

const menuStore = useMenuStore()
const message = useMessage()
const formRef = ref(null)
const rules = ref({
  fName: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur',
    },
  ],
  // selectedScale: {
  //   type: 'array',
  //   required: true,
  //   trigger: 'change',
  //   message: '请选择规模',
  // },
})
const data = reactive({
  fName: '',
  fId: '',
  fNumber: '',
  fKey: '',
  selectedScale: [],
  selectedTag: [],
  fGroup: '',
})

const scaleData = reactive({
  //项目模式
  selectedScale: [],
  selectedScales: [],
  fScales: ref([]),
})

const oldTypeTagValues = reactive([])

//项目模式
// const handleUpdateScale = (v) => {
//   scaleData.selectedScales = []
//   for (var i = 0; i < v.length; i++) {
//     scaleData.selectedScales.push({
//       fId: v[i],
//     })
//   }
// }
//id
const route = useRoute()

const scaleIds = []

//初始化方法
async function info(id) {
  api.load({ fId: id }).then((res) => {
    data.fId = res.data.fId
    data.fName = res.data.fName
    data.fGroup = res.data.fGroup
    data.fKey = res.data.fKey
  })
  var query = []
  query.push({
    eq: {
      'fMasterDataTypeId.fId': id,
    },
  })

  await api
    .typeScaleList({
      query: query,
    })
    .then((res) => {
      res.data.list.forEach((item) => {
        data.selectedScale.push(item.fMasterDataScaleId.fId)
        scaleIds.push(item.fId)
      })
    })

  //读取当前类型标签信息
  await api
    .tagList({
      query: {
        eq: {
          'fMasterDataType.fId': data.fId,
        },
      },
    })
    .then(function (res) {
      if (res.status == 200) {
        res.data.list.forEach((value) => {
          data.selectedTag.push(value.fMasterDataTag.fId)
          oldTypeTagValues.push(value)
        })
      }
    })
}

const check = async () => {
  // 首先触发表单验证
  await formRef.value.validate()
  //是否有重复
  const nameRes = await api.list({
    query: [{ eq: { fName: data.fName } }],
  })
  if (nameRes.data.list.length > 0 && nameRes.data.list[0].fId != data.fId) {
    message.error('已存在相同名称')
    return
  }
  handleSubmit()
}

// 清楚 不要的项目规模
const deleteUnnecessaryModes = async (itemsToDelete) => {
  const deletePromises = itemsToDelete.map(async (item) => {
    if (!data.selectedScale.includes(item.fMasterDataScaleId.fId)) {
      return api.typeScaleDelete({ fId: item.fId })
    }
  })

  // 筛选出有效的 Promise
  const validDeletePromises = deletePromises.filter(Boolean)

  // 等待所有删除操作完成
  await Promise.all(validDeletePromises)
}

// 插入新的项目规模
const insertNewModes = async (currentModes) => {
  const modesToInsert = data.selectedScale.filter(
    (modeId) =>
      !currentModes.some(
        (currentMode) => currentMode.fMasterDataScaleId.fId === modeId,
      ),
  )

  const insertPromises = modesToInsert.map(async (modeId) => {
    const fMasterDataTypeId = { fId: data.fId }
    const fMasterDataScaleId = { fId: modeId }
    const a = { fMasterDataTypeId, fMasterDataScaleId }

    return api.typeScaleSave(a)
  })

  // 等待所有插入操作完成
  await Promise.all(insertPromises)
}

//更新类型标签
async function updateTypeTag() {
  var includesIdx = []
  //1.删除没被勾选的标签
  for (var i = 0; i < oldTypeTagValues.length; i++) {
    var value = oldTypeTagValues[i]
    if (!data.selectedTag.includes(value.fMasterDataTag.fId)) {
      await api.tagDelete({ fId: [value.fId] })
    } else {
      includesIdx.push(i)
    }
  }
  //2.更新新标签
  for (var i = 0; i < data.selectedTag.length; i++) {
    if (!includesIdx.includes(i)) {
      var form = {
        fId: '',
        fMasterDataType: {
          fId: data.fId,
        },
        fMasterDataTag: {
          fId: data.selectedTag[i],
        },
      }
      await api.tagSave(form)
    }
  }
}

// 提交函数修改为显示确认对话框
const handleSubmit = async () => {
  var query = [{ eq: { 'fMasterDataTypeId.fId': data.fId } }]

  // 将 categoryMode 查询出来
  var categoeyModeList = await api.typeScaleList({
    query: query,
  })

  // 删除不必要的项目模式
  await deleteUnnecessaryModes(categoeyModeList.data.list)

  // 再查询数据库，将 selectedScale 剩下的插入进去
  var addCategoeyModeList = await api.typeScaleList({
    query: query,
  })

  // 插入新的项目模式
  await insertNewModes(addCategoeyModeList.data.list)

  // 清空 selectedScale
  // data.selectedScale.length = 0

  //更新类型标签
  await updateTypeTag()

  // 最后保存主数据
  await api.save(data).then((res) => {
    layout.close('masterDataTypeEdit')
    layout.open({
      label: '成功页面',
      key: 'actionSuccess',
      component: '/apps/common/successPage.vue',
    })
  })
}

const masterList = {
  scaleList: async (url, filter) => {
    scaleData.fScales.length = []
    //项目规模
    await scaleApi
      .list()
      .then((result) => {
        const dataList = result.data.list
        for (let i = 0; i < dataList.length; i++) {
          const obj = {
            fName: dataList[i].fName,
            fId: dataList[i].fId,
          }
          scaleData.fScales.push(obj)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  },

  tagList: async () => {
    tagApi.list().then(function (res) {
      if (res.status == 200) {
        for (var i = 0; i < res.data.list.length; i++) {
          var temp = res.data.list[i]
          option.value.tags.push(temp)
        }
      }
    })
  },
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
const handleRouteChange = async (newFId) => {
  await masterList.scaleList()
  masterList.tagList()
  info(newFId)
}
handleRouteChange(id)
// onMounted(async () => {
//   id.value = route.query.fId;;
// })

const dialog = useDialog()

//关闭
const closeWindow = () => {
  dialog.warning({
    title: '警告',
    content: '是否关闭此窗口？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      layout.close('masterDataMeetingTypeEdit')
    },
  })
}
</script>

<style scoped></style>
