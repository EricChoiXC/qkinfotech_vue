<template>
  <n-form ref="formRef" :rules="rules" inline :label-width="80" :model="data">
    <n-table>
      <tbody>
        <tr>
          <th style="width: 20%; text-align: center">
            项目重要性<span style="color: red">*</span>
          </th>
          <td>
            <n-form-item label="" path="fName">
              <n-input
                v-model:value="data.fName"
                style="display: inline-block"
                placeholder="请输入项目重要性"
              ></n-input>
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
import { useRoute } from 'vue-router'
import layout from "@/layout/layout";
const menuStore = useMenuStore()
const api = createApi(getCurrentInstance())

const rules = ref({
  fName: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur',
    },
  ],
})

const formRef = ref(null)
const data = ref({
  fName: '',
  fId: '',
  fKey: 16,
})

const message = useMessage()

async function initFund() {
  await api.init().then((response) => {
    data.value.fId = response.data.fId
  })
}

async function handleSubmit() {
  try {
    // 首先触发表单验证
    await formRef.value.validate()
    var query = []
    query.push({ eq: { fName: data.value.fName } })
    const res = await api.list({
      query: query,
    })
    if (res.data.list.length > 0) {
      message.error('已存在相同名称')
    } else if (data.value.fName == '') {
      message.error('名称不能为空')
    } else {
      const postData = { ...data.value }
      await api.save(postData)
      // window.opener.postMessage({ action: 'importWindowClose' }, '*'); // '*' 表示允许任何源接收消息，实际应用中应明确指定源以确保安全
      // window.open("/opdesk/sys/master/actionSuccess","_self");
      layout.close('masterDataImportanceAdd');
      layout.open({
        label: "成功页面",
        key: "actionSuccess",
        component: "/apps/common/successPage.vue"
      });
    }
  } catch (err) {
    console.error('err', err)
  }
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
      layout.close('masterDataImportanceAdd');    }
  })
}

onMounted(() => {
  initFund()
})
</script>

<style scoped></style>
