<template>
  <n-space vertical size="large">
    <n-layout>
      <n-layout-header> </n-layout-header>
      <n-layout>
        <div style="text-align: center; width: 80%; margin: auto">
          <n-form ref="formRef" :model="orgInfo">
            <div style="display: none">
              <n-input v-model:value="orgInfo.fType"></n-input>
            </div>
            <n-form-item label="名称" path="fName">
              <n-input
                v-model:value="orgInfo.fName"
                :disabled="$props.status == 'view'"
              ></n-input>
            </n-form-item>
             <n-form-item label="所属" path="fOwner">
              <formAddress :fElement="orgInfo.fOwner" orgType="ORG_TYPE_ALL" status="edit"></formAddress>
            </n-form-item>
            <n-form-item label="范围" path="fMembers">
              <formAddress
                :fElements="orgInfo.fMembers"
                orgType="ORG_TYPE_ALL"
                multi
                :status="$props.status"
              ></formAddress>
            </n-form-item>
            <n-form-item label="群组分类" path="fGroupCate">
              <singleCateDialog :multi="false" :fElement="orgInfo.fGroupCate" status="edit" categoryName="org/group/cate">

              </singleCateDialog>
              <singleCateDialog :multi="true" :fElements="orgInfo.fGroupCates" status="edit" categoryName="org/group/cate">

              </singleCateDialog>
            </n-form-item>
          </n-form>
          <n-button @click="add">提交</n-button>
        </div>
      </n-layout>
    </n-layout>
  </n-space>
</template>
<script>
import { ref, defineComponent, h } from 'vue'
import { useMessage } from 'naive-ui'
import formAddress from '@/apps/common/address/formAddress.vue'
import singleCateDialog from '@/sys/common/dialog/SingleCateDialog.vue'
import createApi from './api'
import SingleCateDialog from "@/sys/common/dialog/SingleCateDialog.vue";

export default defineComponent({
  components: {
    SingleCateDialog,
    formAddress: formAddress,
  },
  props: {
    fId: String,
    status: String,
  },
  emits: ['onClose'],
  setup(props, context) {
    const api = createApi(getCurrentInstance())
    const orgInfo = ref({
      fId: '',
      fName: '',
      fType: 5,
      fMembers: [],
      fOwner : {
        fId : '',
        fName : ''
      },
      fGroupCate: {
        fId : '',
        fName : ''
      },
      fGroupCates : []
    })
    console.log(props.status)

    if (props.fId) {
      api.groupLoad({ fId: props.fId }).then(function (res) {
        if (res.status == 200) {
          orgInfo.value.fId = res.data.fId
          orgInfo.value.fName = res.data.fName
          if (res.data.fOwner) {
            orgInfo.value.fOwner = res.data.fOwner
          }
          orgInfo.value.fMembers.length = 0
          if (res.data.fMembers.length > 0) {
            for (var i = 0; i < res.data.fMembers.length; i++) {
              orgInfo.value.fMembers.push({
                fId: res.data.fMembers[i].fElement.fId,
                fName: res.data.fMembers[i].fElement.fName,
              })
            }
          }
        }
      })
    } else {
      api.groupInit().then((value) => {
        if (value.status == 200) {
          orgInfo.value.fId = value.data.fId
        }
      })
    }

    function parseObject(obj, onlyId) {
      var form = {}
      for (var key in obj) {
        if (typeof obj[key] == 'object') {
          form[key] = parseObject(obj[key], true)
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
      /* var form = parseObject(orgInfo.value, false)
        console.log(orgInfo.value)
        axios
          .post('/pm/orgGroup/update', form)
          .then(function(res) {
            if (res.status == 200) {
              alert("提交成功")
              context.emit('onClose', form);
            } else {
              alert("error status : " + res);
            }
          })
          .catch(function(error) {
            alert(error)
          }); */
      api.orgGroupSave(orgInfo.value).then(function (res) {
        if (res.status == 200) {
          alert('提交成功')
          context.emit('onClose')
        } else {
          alert('error status : ' + res)
        }
      })
    }

    return {
      orgInfo,
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
