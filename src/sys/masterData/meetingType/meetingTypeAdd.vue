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
                placeholder="请输入会议类型"
              ></n-input>
            </n-form-item>
          </td>
        </tr>
        <tr>
          <th style="text-align: center">
            所属会议<span style="color: red">*</span>
          </th>
          <td>
            <n-form-item label="" path="fMeetingKey">
              <n-select v-model:value="data.fMeetingKey" :options="options" />
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
import { onMounted, reactive, ref } from 'vue'
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
import layout from "@/layout/layout";

const menuStore = useMenuStore()
const api = createApi(getCurrentInstance())

const formRef = ref(null)
const rules = ref({
  fName: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur',
    },
  ],
  fMeetingKey: {
    required: true,
    trigger: ['blur', 'change'],
    message: '请选择 所属会议',
  },
})
const data = ref({
  fName: '',
  fMeetingKey: '',
  fKey: 16,
  fId: '',
})

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

const message = useMessage()

async function init() {
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
    const meetingKeys = []
    for (var i = 0; i < res.data.list.length; i++) {
      meetingKeys.push(res.data.list[i].fMeetingKey)
    }
    if (
      res.data.list.length > 0 &&
      meetingKeys.includes(data.value.fMeetingKey)
    ) {
      message.error('已存在相同名称')
      return
    }
    if (data.value.fName == '') {
      message.error('名称不能为空')
      return
    } else {
      const postData = { ...data.value }
      await api.save(postData)
      layout.close('masterDataModeAdd')
      layout.open({
        label: '成功页面',
        key: 'actionSuccess',
        component: '/apps/common/successPage.vue',
      })
    }
  } catch (err) {}
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
      layout.close('masterDataModeAdd')
    },
  })
}
onMounted(() => {
  init()
})
</script>

<style scoped></style>
