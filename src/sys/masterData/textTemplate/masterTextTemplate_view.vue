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
          {{ masterTextTemplate.fName }}
        </n-form-item>
        <n-form-item label="关键字" path="fKey" style="width: 100%">
          {{ masterTextTemplate.fKey }}
        </n-form-item>
        <n-form-item label="模板" path="fContent" style="width: 100%">
          <n-dynamic-input
            v-model:value="masterTextTemplate.fContent"
            :on-create="onCreate"
            disabled
          >
            <template #default="{ value }">
              <div style="width: 100%">
                <n-input
                  v-model:value="value.text"
                  placeholder="分类"
                  disabled
                ></n-input>
              </div>
              <br />
              <n-dynamic-input
                v-model:value="value.children"
                placeholder="模板名称"
                disabled
              >
                <template #action="{ index, create, remove, mode }">
                  <div></div>
                </template>
              </n-dynamic-input>
            </template>
            <template #action="{ index, create, remove, mode }">
              <div></div>
            </template>
          </n-dynamic-input>
        </n-form-item>
      </n-form>
    </n-space>
    <n-space justify="center"> </n-space>
  </n-card>
</template>

<script setup>
import { reactive } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import createApi from './api'
import { useMenuStore } from '@/store/menu.js'

const menuStore = useMenuStore()
const api = createApi(getCurrentInstance())
const dialog = useDialog()
const message = useMessage()
const route = useRoute()

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
    api.init().then(function (res) {})
  }
}
init()

// watch(
//   () => route.query.fId,
//   (newFId) => {
//     init()
//   }
// );
</script>

<style></style>
