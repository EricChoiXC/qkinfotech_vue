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
                placeholder="请输入国家名称"
              ></n-input>
            </n-form-item>
          </td>
        </tr>

        <tr>
          <th style="width: 20%; text-align: center">
            国家编号<span style="color: red">*</span>
          </th>
          <td>
            <n-form-item label="" path="fCountryNum">
              <n-input
                v-model:value="data.fCountryNum"
                style="display: inline-block"
                placeholder="请输入国家名称"
              ></n-input>
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

  fCountryNum: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur',
    },
  ],
})
const data = reactive({
  fCountryNum: '',
  fName: '',
  fId: '',
})

const message = useMessage()

const route = useRoute()
const info = async (id) => {
  try {
    const res = await api.load({ fId: id })
    data.fId = res.data.fId
    data.fName = res.data.fName
    data.fCountryNum = res.data.fCountryNum
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

async function check() {
  const postData = { ...data }
  try {
    // 首先触发表单验证
    await formRef.value.validate()
    if (!data.fName) {
      message.error('名称不能为空')
      return
    }

    // 验证名称的唯一性
    const nameQuery = [{ eq: { fName: postData.fName } }]
    const nameResponse = await api.list({
      query: nameQuery,
    })
    const nameExists = nameResponse.data.list.some(
      (country) => country.fId !== id && country.fName === postData.fName,
    )
    // 验证编号的唯一性
    const numQuery = [{ eq: { fCountryNum: postData.fCountryNum } }]

    const numResponse = await api.list({
      query: numQuery,
    })
    const numExists = numResponse.data.list.some(
      (country) =>
        country.fId !== id && country.fCountryNum === postData.fCountryNum,
    )

    // 处理验证结果
    if (nameExists && nameResponse.data.list[0].fId != data.fId) {
      message.error('已存在相同名称')
      return
    }
    if (numExists && numResponse.data.list[0].fId != data.fId) {
      message.error('此编号已被使用')
      return
    }

    // 处理验证结果
    // if (nameResponse.data.list.length > 0 && nameResponse.data.list[0]!=id.value) {
    //   message.error('已存在相同名称');
    //   return;
    // }
    // if (numResponse.data.list.length > 0&&numResponse.data.list[0]!=id.value ) {
    //   message.error('此编号已被使用');
    //   return;
    // }
    // if (postData.fName === '') {
    //   message.error('名称不能为空');
    //   return;
    // }

    handleSubmit()

    // const query = [{ "eq": { "fName": data.value.fName } }];
    // const res = await axios.post( "/pm/masterdata/country/list", { query });
    // if (res.data.list.length > 0 && res.data.list[0].fId != id) {
    //   message.error('已存在相同名称');
    // } else {
    //   const postData = { ...data.value };
    //   await axios.post( "/pm/masterdata/country/save", postData);
    //   window.opener.postMessage({ action: 'countryWindowClose' }, '*'); // '*' 表示允许任何源接收消息，实际应用中应明确指定源以确保安全
    //   window.open("/opdesk/sys/master/actionSuccess", "_self");
    // }
  } catch (err) {}
}

const handleSubmit = async () => {
  await api.save(data)
  layout.close('masterDataCountryEdit')
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
      layout.close('masterDataCountryEdit')
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
