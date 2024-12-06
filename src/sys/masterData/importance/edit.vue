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
})
const data = ref({
  fName: '',
})

const message = useMessage()
const route = useRoute()

const info = async (id) => {
  try {
    const res = await api.load({ fId: id })
    data.value = res.data || {} // 确保总是给 data.value 赋一个对象
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

async function handleSubmit() {
  try {
    // 首先触发表单验证
    await formRef.value.validate()
    if (!data.value.fName) {
      message.error('名称不能为空')
      return
    }

    const query = [{ eq: { fName: data.value.fName } }]
    const res = await api.list({ query })
    if (res.data.list.length > 0 && res.data.list[0].fId !== id) {
      message.error('已存在相同名称')
    } else {
      const postData = { ...data.value }
      await api.save(postData)
      // window.opener.postMessage({ action: 'importWindowClose' }, '*'); // '*' 表示允许任何源接收消息，实际应用中应明确指定源以确保安全
      // window.open("/opdesk/sys/master/actionSuccess","_self");
      layout.close('masterDataCategoryEdit');
      layout.open({
        label: "成功页面",
        key: "actionSuccess",
        component: "/apps/common/successPage.vue"
      });
    }
  } catch (err) {}
}

//关闭
const closeWindow = () => {
  dialog.warning({
    title: '警告',
    content: '是否关闭此窗口？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      // window.close()
      layout.close('masterDataImportanceedit');
    }
  })
}

const dialog = useDialog()

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
  console.log('Route parameter fId changed to:', newFId)
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
