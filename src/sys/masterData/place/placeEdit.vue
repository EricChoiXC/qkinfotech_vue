<template>
  <n-form ref="formRef" :rules="rules" inline :label-width="80" :model="data">
    <n-table>
      <tbody>
        <tr>
          <th style="width: 20%; text-align: center">
            项目地点<span style="color: red">*</span>
          </th>
          <td>
            <n-form-item label="" path="fName">
              <n-input
                v-model:value="data.fName"
                style="display: inline-block"
                placeholder="请输入城市"
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
            <n-form-item label="" path="selectedOption">
              <n-select
                v-model:value="selectedOption"
                :options="options"
                label="国家"
              />
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
        <tr>
          <td colspan="2">
            <sysComment :modelId="id" modelName="sysMasterdataCity"></sysComment>
          </td>
        </tr>
      </tbody>
    </n-table>
  </n-form>
  <sysLikes modelId="123" modelName="sysMasterdataCity"></sysLikes>
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
  useMessage,
  useDialog,
} from 'naive-ui'
import { useMenuStore } from '@/store/menu.js'
import layout from "@/layout/layout";
import sysComment from '@/sys/comment/sysComment.vue'
import sysLikes from '@/sys/likes/sysLikes_document.vue'

const dialog = useDialog()

const currentInstance = getCurrentInstance()
const api = createApi(currentInstance)
const countryApi = createCountryApi(currentInstance)

const menuStore = useMenuStore()

const message = useMessage()
const route = useRoute()

const options = ref([])
const formRef = ref(null)

const rules = ref({
  fName: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur',
    },
  ],
  fCityNum: [
    {
      required: true,
      message: '请输入编号',
      trigger: 'blur',
    },
  ],
})

const data = reactive({
  fName: '',
  fCityNum: '',
  fId: '',
  fParentId: '',
})
const selectedOption = ref(null)

const info = (id) => {
  api.load({ fId: id }).then((res) => {
    data.fId = res.data.fId
    data.fName = res.data.fName
    data.fCityNum = res.data.fCityNum
    selectedOption.value = res.data.fParentId.fId
  })
}

const check = async () => {
  const postData = { ...data }

  // 验证名称的唯一性
  const nameQuery = [{ eq: { fName: postData.fName } }]
  const nameResponse = await api.list({
    query: nameQuery,
  })
  const nameExists = nameResponse.data.list.some(
    (city) => city.fId !== id && city.fName === postData.fName,
  )

  // 验证编号的唯一性
  const numQuery = [{ eq: { fCityNum: postData.fCityNum } }]
  const numResponse = await api.list({
    query: numQuery,
  })
  const numExists = numResponse.data.list.some(
    (city) => city.fId !== id && city.fCityNum === postData.fCityNum,
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
  if (postData.fName === '') {
    message.error('名称不能为空')
    return
  }
}

async function handleSubmit() {
  data.fParentId = selectedOption.value // 注意这里假设 data 是一个响应式对象，可能需要使用 data.value 访问其属性

  const postData = { ...data }
  // 这里不直接发送请求，而是先调用 check 函数进行验证
  try {
    await check(postData, data.id) // 假设你修改了 check 函数以接受这些参数
    await api.save(postData)
    // 如果需要，可以取消注释以下行来关闭窗口或执行其他操作
    // window.opener.postMessage({ action: 'placeWindowClose' }, '*'); // 注意安全性
    // window.open("/opdesk/sys/master/actionSuccess", "_self");
    layout.close('masterDataPlaceEdit');
    layout.open({
      label: "成功页面",
      key: "actionSuccess",
      component: "/apps/common/successPage.vue"
    })
  } catch (error) {
    // 处理可能出现的错误，比如验证失败或网络请求失败
    console.error('Error submitting city data:', error)
    message.error(error.message || 'An error occurred')
  }
}

const fetchOptions = async () => {
  countryApi.countryList().then((result) => {
    options.value = result.data.list.map((item) => ({
      label: item.fName, // fName作为显示的文本
      value: item.fId, // fId作为选项的值
    }))
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
  console.log('Route parameter fId changed to:', newFId)
  info(newFId)
}

handleRouteChange(id)

//关闭
const closeWindow = () => {
  dialog.warning({
    title: '警告',
    content: '是否关闭此窗口？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: async () => {
      layout.close('masterDataPlaceEdit');
    }
  })
}

onMounted(() => {
  // id.value = route.query.fId;;
  fetchOptions()
})
</script>

<style scoped></style>
