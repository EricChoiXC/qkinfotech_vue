<template>
  <n-form ref="formRef" inline :label-width="80" :model="data" :rules="rules">
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
                placeholder="请输入城市名称"
              ></n-input>
            </n-form-item>
          </td>
        </tr>

        <tr>
          <th style="width: 20%; text-align: center">
            城市编号<span style="color: red">*</span>
          </th>
          <td>
            <n-form-item label="" path="fCityNum">
              <n-input
                v-model:value="data.fCityNum"
                style="display: inline-block"
                placeholder="请输入城市编号"
              ></n-input>
            </n-form-item>
          </td>
        </tr>

        <tr>
          <th style="width: 20%; text-align: center">
            所属国家<span style="color: red">*</span>
          </th>
          <td>
            <n-form-item label="" path="fParentId">
              <n-select
                v-model:value="selectedOption"
                :options="options"
                label="名称"
              />
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
import createCountryApi from '../country/api'

import { reactive, ref } from 'vue'
import {
  NForm,
  NGrid,
  NGridItem,
  NFormItem,
  NInput,
  NDatePicker,
  NDialog,
  useDialog,
  useMessage,
} from 'naive-ui'

import { useMenuStore } from '@/store/menu.js'
import layout from '@/layout/layout'
const menuStore = useMenuStore()
const currentInstance = getCurrentInstance()
const api = createApi(currentInstance)
const countryApi = createCountryApi(currentInstance)

const options = ref([])
const selectedOption = ref(null)

const formRef = ref(null)
const data = ref({
  fName: '',
  fCityNum: '',
  fKey: 16,
  fParentId: {},
})

const rules = ref({
  fName: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur',
    },
  ],
  fCityNum: {
    required: true,
    message: '请输入城市编号',
    trigger: 'blur',
  },
})

const message = useMessage()
const dialog = useDialog()

const check = async () => {
  await formRef.value.validate()

  const nameres = await api.list({
    query: [{ eq: { fName: data.value.fName } }],
  })
  const numres = await api.list({
    query: [{ eq: { fCityNum: data.value.fCityNum } }],
  })
  if (nameres.data.list.length > 0) {
    message.error('已存在相同名称')
    return
  }

  if (numres.data.list.length > 0) {
    message.error('已存在相同城市编号')
    return
  }

  if (selectedOption.value == null) {
    message.error('请选择国家')
    return
  }

  handleSubmit()
}

async function handleSubmit() {
  const postData = { ...data.value }
  postData.fParentId = selectedOption.value
  await api.save(postData)

  // window.opener.postMessage({ action: 'placeWindowClose' }, '*'); // '*' 表示允许任何源接收消息，实际应用中应明确指定源以确保安全
  // window.open("/opdesk/sys/master/actionSuccess", "_self");

  layout.close('masterDataPlaceAdd')
  layout.open({
    label: '成功页面',
    key: 'actionSuccess',
    component: '/apps/common/successPage.vue',
  })
}

const fetchOptions = async () => {
  var query = []
  countryApi.countryList().then((result) => {
    options.value = result.data.list.map((item) => ({
      label: item.fName,
      value: item.fId,
    }))
  })
}
const closeWindow = () => {
  dialog.warning({
    title: '警告',
    content: '是否关闭此窗口？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      layout.close('masterDataPlaceAdd')
    },
  })
}

onMounted(async () => {
  await fetchOptions()
})
</script>

<style scoped></style>
