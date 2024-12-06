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
                placeholder="请输入项目类型"
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
                @update:value="handleUpdateMode"
              >
                <n-checkbox
                  v-for="(item, index) in scaleData.fModes"
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
import createTagApi from '../tag/api'
import createScaleApi from '../scale/api'
import { reactive, ref } from 'vue'
import { NForm, NFormItem, NInput, useDialog, useMessage } from 'naive-ui'
import { useMenuStore } from '@/store/menu.js'
import publicValues from '@/utils/publicValues'
import layout from '@/layout/layout'

const menuStore = useMenuStore()
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
const data = ref({
  fName: '',
  fKey: 16,
  fId: '',
  selectedScale: [],
  selectedTag: [],
  fGroup: '',
})

const scaleData = reactive({
  //项目模式
  selectedScale: [],
  selectedScales: [],
  fModes: ref([]),
})

//项目模式
// const handleUpdateMode = (v) => {
//   scaleData.selectedScales = []
//   for (var i = 0; i < v.length; i++) {
//     scaleData.selectedScales.push({
//       fId: v[i],
//     })
//   }
// }

const init = async () => {
  await api.init().then((res) => {
    data.value.fId = res.data.fId
  })
}

const message = useMessage()

async function handleSubmit() {
  await formRef.value.validate()

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
  } else if (data.value.fName == '') {
    message.error('名称不能为空')
  } else {
    const postData = {
      ...data.value,
    }

    await api.save(postData)

    for (let i = 0; i < scaleData.selectedScales.length; i++) {
      const typeScale = {}
      typeScale.fMasterDataTypeId = data.value.fId
      typeScale.fMasterDataScaleId = scaleData.selectedScales[i].fId
      await api.typeScaleSave(typeScale)
    }

    // window.opener.postMessage({
    //   action: 'typeWindowClose'
    // }, '*'); // '*' 表示允许任何源接收消息，实际应用中应明确指定源以确保安全
    // window.open("/opdesk/sys/master/actionSuccess", "_self");

    //添加项目标签信息
    for (var i = 0; i < data.value.selectedTag.length; i++) {
      var form = {
        fId: '',
        fMasterDataType: {
          fId: data.value.fId,
        },
        fMasterDataTag: {
          fId: data.value.selectedTag[i],
        },
      }
      await api.tagSave(form)
    }

    layout.close('masterDataTypeAdd')
    layout.open({
      label: '成功页面',
      key: 'actionSuccess',
      component: '/apps/common/successPage.vue',
    })
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
      layout.close('masterDataTypeAdd')
    },
  })
}

const masterList = {
  scaleList: async (url, filter) => {
    //项目性质
    await scaleApi
      .list()
      .then((result) => {
        const dataList = result.data.list
        scaleData.fModes.value = []
        for (let i = 0; i < dataList.length; i++) {
          const obj = {
            fName: dataList[i].fName,
            fId: dataList[i].fId,
          }
          scaleData.fModes.push(obj)
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

onMounted(async () => {
  masterList.scaleList()
  masterList.tagList()
  await init()
})
</script>

<style scoped></style>
