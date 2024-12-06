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
            <n-input v-model:value="element.fName" disabled></n-input>
          </n-form-item>
          <n-form-item label="赋权权限" path="fAuthorities"> </n-form-item>
          <n-checkbox-group
            v-for="(group, key) in authsGroup"
            :key="key"
            style="width: 100%"
            v-model:value="authoritys"
          >
            <n-grid :cols="4">
              <n-gi :span="4">
                <div style="background-color: rgb(220, 220, 220)">
                  {{ key }}
                </div>
              </n-gi>
              <n-gi v-for="auth in group">
                <n-checkbox :value="auth.fId" :label="auth.fName"> </n-checkbox>
              </n-gi>
            </n-grid>
          </n-checkbox-group>
        </n-form>
        <n-button @click="update">提交</n-button>
      </div>
    </n-layout>
  </n-space>
</template>
<script lang="ts">
import { ref, defineComponent, h, reactive } from 'vue'
import { FormInst, useMessage } from 'naive-ui'
import createApi from './api'

export default defineComponent({
  props: {
    fId: String /* 传入id */,
    method: String,
  },
  emits: ['onClose'],
  setup(props, context) {
    const api = createApi(getCurrentInstance())
    const element = ref({
      fId: '',
      fName: '',
      fAuthorities: [],
    })
    const formRef = ref<FormInst | null>(null)
    const auths = ref([])
    const authsGroup = ref({}) /* 分组后的权限 */
    const authoritys = ref([])
    /* 读取角色信息 */
    if (props.fId) {
      api.roleLoad({ fId: props.fId }).then((value) => {
        if (value.status == 200 && value.data) {
          element.value = value.data
          for (var i = 0; i < element.value.fAuthorities.length; i++) {
            authoritys.value.push(element.value.fAuthorities[i].fId)
          }
        }
      })
    } else {
      /* 授权操作不能进行初始化，提示信息并结束弹窗 */
      alert('请传入角色id')
      context.emit('onClose')
    }

    /* 读取权限信息 */
    api.authorityList({ query: [] }).then((res) => {
      if (res.status == 200) {
        auths.value = res.data.list
        /* 权限分组 */
        for (var i = 0; i < auths.value.length; i++) {
          var auth = auths.value[i]
          if (!authsGroup.value[auth.fGroup + '-' + auth.fModule]) {
            authsGroup.value[auth.fGroup + '-' + auth.fModule] = []
          }
          authsGroup.value[auth.fGroup + '-' + auth.fModule].push({
            fId: auth.fId,
            fName: auth.fName,
            fModule: auth.fModule,
          })
        }
      }
    })

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
      element.value.fAuthorities.splice(0, element.value.fAuthorities.length)
      for (var i = 0; i < authoritys.value.length; i++) {
        element.value.fAuthorities.push({
          fId: authoritys.value[i],
        })
      }
      var form = {
        fId: element.value.fId,
        fAuthorities: element.value.fAuthorities,
      }
      api
        .roleSave(form)
        .then(function (res) {
          if (res.status == 200) {
            alert('提交成功')
            //context.emit('onClose', form);
            console.log('提交完成')
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
      auths,
      authsGroup,
      authoritys,
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
