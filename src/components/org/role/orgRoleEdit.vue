<template>
  <n-space vertical size="large">
    <n-layout>
      <div style="text-align: center; width: 80%; margin: auto; padding: 20px">
        <n-form
          ref="formRef"
          :model="element"
          :rules="rules"
          :disabled="$props.method != 'edit' && $props.method != 'add'"
        >
          <div style="display: none"></div>
          <n-form-item label="名称" path="fName">
            <n-input v-model:value="element.fName"></n-input>
          </n-form-item>
          <n-form-item label="是否管理员" path="fAdminRole">
            <n-switch v-model:value="element.fAdminRole" />
          </n-form-item>
        </n-form>
        <n-button @click="add">提交</n-button>
      </div>
    </n-layout>
  </n-space>
</template>
<script lang="ts">
import { ref, defineComponent, h, reactive } from 'vue'
import { FormInst, useMessage } from 'naive-ui'
import createApi from './api'
import formAddress from '@/apps/common/address/formAddress.vue'

export default defineComponent({
  props: {
    fId: String,
    method: String,
  },
  emits: ['onClose'],
  setup(props, context) {
    const api = createApi(getCurrentInstance())
    const element = ref({
      fId: '',
      fName: '',
      fAdminRole: false,
      fRoles: [],
      fElements: [],
    })
    const formRef = ref<FormInst | null>(null)
    if (props.fId) {
      api.roleLoad({ fId: props.fId }).then((value) => {
        if (value.status == 200 && value.data) {
          element.value = value.data
        }
      })
    } else {
      api.roleInit().then((value) => {
        if (value.status == 200 && value.data) {
          element.value = value.data
        }
      })
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

    function add() {
      var form = {
        fId: element.value.fId,
        fName: element.value.fName,
        fAdminRole: element.value.fAdminRole,
      }
      // form.fElements[0].fText = "333"
      // form.fElements[0].fElement.fId = "01HV085JS1T43EMJDBYCXCT2RP"
      console.log(form)
      api
        .roleSave(form)
        .then(function (res) {
          if (res.status == 200) {
            alert('提交成功')
            context.emit('onClose', form)
            //console.log("提交完成")
          } else {
            alert('error status : ' + res)
          }
        })
        .catch(function (error) {
          alert(error)
        })

      /* axios
					.post( + '/pm/sys/role/save', form)
					.then(function(res){
						if (res.status == 200) {
							alert("提交成功")
							context.emit('onClose', form);
						} else {
							alert("error status : " + res);
						}
					})
					.catch(function(error){
						alert(error)
					}); */
    }

    return {
      element,
      onlyAllowNumber: (value) => !value || /^\d+$/.test(value),
      add,
      parseObject,
      rules: {
        fName: {
          retuired: true,
          message: '请输入名称',
          trigger: 'blur',
        },
      },
    }
  },
})
</script>

<style></style>
