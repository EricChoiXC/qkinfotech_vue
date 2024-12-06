<template>
  <n-space vertical size="large">
    <n-layout>
      <div style="text-align: center; width: 80%; margin: auto; padding: 20px">
        <n-form
          ref="formRef"
          :model="element"
          label-placement="left"
          label-width="150px"
        >
          <div style="display: none"></div>
          <n-form-item label="名称" path="fName">
            <n-input v-model:value="element.fName" disabled></n-input>
          </n-form-item>
          <n-form-item label="授权用户" path="fElements">
            <form-address
              :fElements="element.fElements"
              orgType="ORG_TYPE_ALL"
              status="edit"
              multi
            ></form-address>
          </n-form-item>
        </n-form>
        <n-button @click="update">提交</n-button>
      </div>
    </n-layout>
  </n-space>
</template>
<script>
import { ref, defineComponent, h, reactive } from 'vue'
import { useMessage } from 'naive-ui'
import createApi from './api'
import formAddress from '@/apps/common/address/formAddress.vue'

export default defineComponent({
  components: {
    'form-address': formAddress,
  },
  props: {
    fId: String /* 传入id */,
  },
  emits: ['onClose'],
  setup(props, context) {
    const api = createApi(getCurrentInstance())
    const element = ref({
      fId: '',
      fName: '',
      fElements: [],
    })
    /* 读取角色信息 */
    if (props.fId) {
      api.roleLoad({ fId: props.fId }).then((value) => {
        if (value.status == 200 && value.data) {
          element.value = value.data
        }
      })
    } else {
      /* 授权操作不能进行初始化，提示信息并结束弹窗 */
      alert('请传入角色id')
      context.emit('onClose')
    }

    function parseObject(obj, onlyId) {
      var form = {}
      for (var key in obj) {
        console.log(key + ' : ' + typeof obj[key])
        if (
          typeof obj[key] == 'object' &&
          obj[key] != undefined &&
          Object.prototype.toString.call(obj[key]) == '[object Object]'
        ) {
          form[key] = parseObject(obj[key], true)
        } else if (Array.isArray(obj[key])) {
          form[key] = obj[key]
        } else {
          if (onlyId) {
            if (key == 'fId') {
              form[key] = obj[key]
            }
          } else {
            form[key] = obj[key]
          }
        }
      }
      return form
    }

    /* 更新角色授权 */
    function update() {
      var form = {
        fId: element.value.fId,
        fElements: element.value.fElements,
      }
      api
        .roleSave(form)
        .then(function (res) {
          if (res.status == 200) {
            alert('提交成功')
            //context.emit('onClose', form);
            context.emit('onClose')
          } else {
            alert('error status : ' + res)
          }
        })
        .catch(function (error) {
          alert(error)
        })
    }

    return {
      element,
      update,
      parseObject,
    }
  },
})
</script>

<style></style>
