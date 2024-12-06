<template>
  <n-space vertical size="large">
    <n-layout>
      <div style="text-align: center; width: 80%; margin: auto; padding: 20px">
        <n-form
          ref="formRef"
          :model="shortcuts"
          :rules="rules"
          label-placement="left"
          label-width="150px"
        >
          <div style="display: none">
            <n-input v-model:value="shortcuts.fId"></n-input>
            <n-input v-model:value="shortcuts.fCreator.fId"></n-input>
            <n-date-picker
              v-model:value="shortcuts.fCreateTime"
              type="datetime"
              :default-value="Date.now()"
            ></n-date-picker>
          </div>
          <n-form-item label="名称" path="fName">
            <n-input v-model:value="shortcuts.fName"></n-input>
          </n-form-item>
          <n-form-item label="打开方式" path="fType">
            <n-radio-group v-model:value="shortcuts.fType" name="fAction">
              <n-space>
                <n-radio
                  v-for="option in menuActionOptions"
                  :key="option.value"
                  :value="option.value"
                  >{{ option.label }}</n-radio
                >
              </n-space>
            </n-radio-group>
          </n-form-item>

          <n-form-item v-if="shortcuts.fType===1"label="跳转地址" path="fUrl">
            <n-input v-model:value="shortcuts.fUrl"></n-input>
          </n-form-item>

          <n-form-item v-if="shortcuts.fType===2"label="导航key" path="fPageKey">
            <n-input v-model:value="shortcuts.fPageKey"></n-input>
          </n-form-item>

          <n-form-item label="图标显示url" path="fIconUrl">
            <n-input v-model:value="shortcuts.fIconUrl"></n-input>
          </n-form-item>
          <n-form-item label="可使用者" path="fUsedList">
            <form-address
              :fElements="shortcuts.fUsedList"
              orgType="ORG_TYPE_DEPT|ORG_TYPE_PERSON"
              :multi="true"
              status="edit"
            ></form-address>
          </n-form-item>
          <n-form-item label="排序数字" path="fOrder">
            <n-input
              v-model:value="shortcuts.fOrder"
              style="width: 100%"
              :allow-input="onlyAllowNumber"
            ></n-input>
          </n-form-item>
        </n-form>
        <n-button @click="add">提交</n-button>
      </div>
    </n-layout>
  </n-space>
</template>
<script>
import { ref, defineComponent, h, reactive } from 'vue'
import { useMessage } from 'naive-ui'
import formAddress from '@/apps/common/address/formAddress.vue'
import address from '@/apps/common/address/address.vue'
import storage from '@/utils/storage'
import contextId from '@/context.js'

import createApi from './api'
import { useMenuStore } from '@/store/menu.js'
import layout from "@/layout/layout";


export default defineComponent({
  components: {
    'form-address': formAddress,
    'qk-address': address,
  },
  props: {
    fId: String,
  },
  emits: ['onClose'],
  setup(props, context) {
    const api = createApi(getCurrentInstance())
    const menuStore = useMenuStore()
    const shortcuts = reactive({
      fId: '',
      fName: '',
      fType: '',
      fUrl: '',
      fCreateTime: new Date().getTime(),
      fIconUrl: '',
      fUsedList: [],
      fOrder: '',
      fCreator: {
        fId: '',
      },
      fAction:'',
      fPageKey:'',
    })
    //快捷方式添加 新的打开方式
    const menuActionOptions = computed(() => {
        return actionMode.menu
    })
    const actionMode = {
      menu: [
        { label: '跳转', value: 1 },
        { label: '显示导航内容', value: 2 },
      ],
    }

    const formRef = ref(null)
    if (props.fId) {
      const param = {
        fId: props.fId,
      }
      api.load(param).then(function (res) {
        if (res.status === 200) {
          var data = res.data
          shortcuts.fName = data.fName
          shortcuts.fType = data.fType
          shortcuts.fId = data.fId
          shortcuts.fUrl = data.fUrl
          shortcuts.fIconUrl = data.fIconUrl
          shortcuts.fOrder = data.fOrder
          shortcuts.fCreator = data.fCreator
          shortcuts.fType = data.fType-0
          shortcuts.fPageKey = data.fPageKey
          if (data.fUsedList.length > 0) {
            const users = []
            data.fUsedList.forEach((user) => {
              const userInfo = {
                fId: user.fUsed.fId,
                fName: user.fUsed.fName,
              }
              users.push(userInfo)
            })
            shortcuts.fUsedList = users
          }
          // for (var key in data) {
          //
          //   shortcuts[key] = data[key]
          // }
          console.log('获取数据详情：', shortcuts)
        }
      })
    }

    function add() {
      shortcuts.fCreator.fId = contextId.user()
      if (shortcuts.fUsedList.length > 0) {
        const fUsedList = []
        shortcuts.fUsedList.forEach((fUsed) => {
          const user = {
            fUsed: fUsed,
          }
          fUsedList.push(user)
        })
        shortcuts.fUsedList = fUsedList
      }
      api.save(shortcuts).then(function (res) {
        if (res.status === 200) {
          context.emit('onClose')
          layout.open({
            label: '成功页面',
            key: 'actionSuccess',
            component: '/apps/common/successPage.vue',
          })
        }
      })
    }

    return {
      shortcuts,
      onlyAllowNumber: (value) => !value || /^\d+$/.test(value),
      add,
      menuStore,
      rules: {
        fName: {
          required: true,
          message: '请输入名称',
          trigger: 'blur',
        }
      },
      menuActionOptions,
    }
  },
})
</script>

<style></style>
