<template>
  <n-card>
    <n-space justify="center">
      <n-form
        ref="formRef"
        :model="masterTextTemplate"
        label-placement="left"
        label-width="100px"
        style="width: 50vw"
        :rules="rules"
      >
        <div style="display: none">
          {{ masterTextTemplate.fId }}
        </div>
        <n-form-item label="名称" path="fName" style="width: 100%">
          <n-input
            placeholder="名称"
            v-model:value="masterTextTemplate.fName"
          ></n-input>
        </n-form-item>
        <n-form-item label="关键字" path="fKey" style="width: 100%">
          <n-input
            placeholder="关键字"
            v-model:value="masterTextTemplate.fKey"
          ></n-input>
        </n-form-item>
        <n-form-item label="模板" path="fContent" style="width: 100%">
          <!-- <n-input placeholder="模板" v-model:value="masterTextTemplate.fContent" type="textarea"></n-input> -->
          <n-dynamic-input
            v-model:value="masterTextTemplate.fContent"
            :on-create="onCreate"
          >
            <template #default="{ value }">
              <div style="width: 100%">
                <n-input
                  v-model:value="value.text"
                  placeholder="分类"
                ></n-input>
              </div>
              <br />
              <n-dynamic-input
                v-model:value="value.children"
                placeholder="模板名称"
              >
              </n-dynamic-input>
            </template>
            <template #action="{ index, create, remove, mode }">
              <n-button @click="() => create(index)">添加分类</n-button>
              <n-button @click="() => remove(index)">删除</n-button>
            </template>
          </n-dynamic-input>
        </n-form-item>
      </n-form>
    </n-space>
    <n-space justify="center">
      <n-button type="primary" @click="submit">提交</n-button>
    </n-space>
  </n-card>
</template>

<script setup>
import { reactive } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import createApi from './api'
import { useMenuStore } from '@/store/menu.js'
import layout from "@/layout/layout";

const menuStore = useMenuStore()
const api = createApi(getCurrentInstance())
const dialog = useDialog()
const message = useMessage()
const route = useRoute()

const rules = {
  fName: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入名称',
  },
  fKey: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入关键字',
  },
  fContent: {
    validator: validateContent,
    trigger: ['blur', 'input'],
    message: '请填写文本模板数据，或移除空白数据',
  },
}
const masterTextTemplate = reactive({
  fId: '',
  fName: '',
  fKey: 'IsoApproval',
  fContent: [],
})
const formRef = ref(null)

function init() {
  var id = menuStore.currentRouteObj.urlParams.fId
  if (id) {
    api.load({ fId: id }).then(function (res) {
      masterTextTemplate.fId = res.data.fId
      masterTextTemplate.fName = res.data.fName
      masterTextTemplate.fKey = res.data.fKey
      masterTextTemplate.fContent = res.data.fContent
    })
  } else {
    api.init().then(function (res) {
      masterTextTemplate.fId = res.data.fId
    })
  }
}
init()

// watch(
//   () => route.query.fId,
//   (newFId) => {
//     init()
//   }
// );

//添加模板分类
function onCreate() {
  return {
    text: '',
    children: [''],
  }
}

//校验
function validateContent() {
  for (var i = 0; i < masterTextTemplate.fContent.length; i++) {
    var content = masterTextTemplate.fContent[i]
    if (content.text == undefined || content.text == '') {
      return false
    }
    for (var j = 0; j < content.children.length; j++) {
      if (content.children[j] == '') {
        return false
      }
    }
  }
  return true
}

//提交
function submit() {
  formRef.value.validate((error) => {
    if (error) {
      message.error('校验失败')
    } else {
      api.save(masterTextTemplate).then(function (res) {
        if (res.status == 200) {
          layout.open({
            label: '成功页面',
            key: 'actionSuccess',
            component: '/apps/common/successPage.vue',
            urlParams: {},
          })
        } else {
          message.error('提交失败，请重试')
        }
      })
    }
  })
}
</script>

<style></style>
