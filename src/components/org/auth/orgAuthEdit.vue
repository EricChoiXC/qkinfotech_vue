<template>
  <n-space vertical size="large">
    <n-layout>
      <div style="text-align: center; width: 80%;margin: auto; padding: 20px;">
        <n-form ref="formRef" :model="element" :rules="rules">
          <div style="display: none;">
          </div>
          <n-form-item label="名称" path="fName">
            <n-input v-model:value="element.fName"></n-input>
          </n-form-item>
          <n-form-item label="包含权限" path="fRoles">
            <n-input v-model:value="element.fRoles"></n-input>
          </n-form-item>
          <n-form-item label="角色所属" path="fRoles">
            <!-- <formAddress :fElement="element.fElements" orgType="ORG_TYPE_ALL" multi></formAddress> -->
          </n-form-item>
        </n-form>
        <n-button @click="add">提交</n-button>
      </div>
    </n-layout>
  </n-space>
</template>
<script lang="ts">
import {ref, defineComponent, h, reactive} from 'vue'
import {FormInst, useMessage} from 'naive-ui'
import createApi from './api'

export default defineComponent({
  props: {
    fId: String
  },
  emits: ['onClose'],
  setup(props, context) {
    const api = createApi(getCurrentInstance())
    const element = ref({
      fId: "",
      fName: "",
      fRoles: [],
      fElements: []
    })
    const formRef = ref<FormInst | null>(null)
    if (props.fId) {
      api.load({fId: props.fId})
        .then((value) => {
          console.log(value)
          if (value.status == 200 && value.data) {
            element.value = value.data
          }
        })
    } else {
      api.init()
        .then((value) => {
          console.log(value)
          if (value.status == 200 && value.data) {
            element.value = value.data
          }
        })
    }

    function parseObject(obj, onlyId) {
      var form = {}
      for (var key in obj) {
        console.log(key + " : " + typeof obj[key])
        if (typeof obj[key] == "object" && obj[key] != undefined && Object.prototype.toString.call(obj[key]) == '[object Object]') {
          parseObject(obj[key], true)
        } else if (Array.isArray(obj[key])) {
          form[key] = obj[key]
        } else {
          if (onlyId) {
            if (key == "fId") {
              form[key] = obj[key];
            }
          } else {
            form[key] = obj[key];
          }
        }
      }
      return form
    }

    function add() {
      var form = parseObject(element.value, false)
      // form.fElements[0].fText = "333"
      // form.fElements[0].fElement.fId = "01HV085JS1T43EMJDBYCXCT2RP"
      console.log(form)
      api.save(form).then(function(res){
        if (res.status == 200) {
          //alert("提交成功")
          //context.emit('onClose', form);
          console.log("提交完成")
        } else {
          alert("error status : " + res);
        }
      })
        .catch(function (error) {
          alert(error)
        });

      /* axios
        .post('/pm/org/auth/save', form)
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
          trigger: 'blur'
        }
      }
    };
  }
});


</script>

<style>
</style>
