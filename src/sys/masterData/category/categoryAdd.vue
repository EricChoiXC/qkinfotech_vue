<template>
  <n-form
    ref="formRef"
    :rules="rules"
    inline
    :label-width="80"
    :model="data"
    label-required-marker="*"
  >
    <n-table>
      <tbody>
        <tr>
          <th style="width: 20%; text-align: center">
            名称<span style="color: red">*</span>
          </th>
          <td>
            <n-form-item path="fName" aria-label="">
              <n-input
                v-model:value="data.fName"
                style="display: inline-block"
                placeholder="请输入项目类别"
              ></n-input>
            </n-form-item>
          </td>
        </tr>

        <tr>
          <th style="width: 20%; text-align: center">
            编号<span style="color: red">*</span>
          </th>
          <td>
            <n-form-item path="fNumber">
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
              <n-button type="primary" @click="handleSubmit">提交</n-button>
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
import { reactive, ref } from 'vue'
import { NForm, NFormItem, NInput, useDialog, useMessage } from 'naive-ui'
import { useMenuStore } from '@/store/menu.js'
import { useRoute } from 'vue-router'
import layout from '@/layout/layout'

const currentInstance = getCurrentInstance()
const api = createApi(currentInstance)
const modeApi = createModeApi(currentInstance)
const route = useRoute()
const message = useMessage()
const menuStore = useMenuStore()
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

const formRef = ref(null)
const data = ref({
  fName: '',
  fKey: 16,
  fId: '',
  selectedMode: null,
})
const modeData = reactive({
  //项目模式
  selectedMode: [],
  selecteModes: [],
  fModes: ref([]),
})

//项目模式
const handleUpdateMode = (v) => {
  modeData.selecteModes = []
  for (var i = 0; i < v.length; i++) {
    modeData.selecteModes.push({
      fId: v[i],
    })
  }
}

async function init() {
  await api.init().then((response) => {
    data.value.fId = response.data.fId
  })
}

async function handleSubmit() {
  try {
    // 首先触发表单验证
    await formRef.value.validate()
    // 如果验证通过，则继续执行你的提交逻辑
    var query = []
    query.push({
      eq: {
        fName: data.value.fName,
      },
    })
    const res = await api.list({
      query: query,
    })
    if (res.data.list.length > 0) {
      message.error('已存在相同名称')
    } else if (data.value.fName === '') {
      message.error('名称不能为空')
    } else {
      await categoryHandleSubmit()
    }
  } catch (error) {
    // 如果验证失败，错误会被抛出，你可以在这里处理错误信息
    console.error('Validation failed:', error)
  }
}

async function categoryHandleSubmit() {
  const postData = {
    ...data.value,
  }
  await api.save(postData)
  for (let i = 0; i < modeData.selecteModes.length; i++) {
    const modeCatrgory = {}
    modeCatrgory.fMasterDataCategoryId = postData.fId
    modeCatrgory.fMasterDataModeId = modeData.selecteModes[i].fId
    await api.categoryModeSave(modeCatrgory)
  }

  layout.close('masterDataCategoryAdd')
  layout.open({
    label: '成功页面',
    key: 'actionSuccess',
    component: '/apps/common/successPage.vue',
  })
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
      layout.close('masterDataCategoryAdd')
    },
  })
}

const masterList = {
  ModeList: async (url, filter) => {
    //项目性质
    await modeApi
      .list()
      .then((result) => {
        const dataList = result.data.list
        modeData.fModes.value = []
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

onMounted(async () => {
  await masterList.ModeList()
  init()
})
</script>

<style scoped></style>
