<template>
  <n-space vertical size="large">
    <n-layout>
      <div style="text-align: center; width: 80%; margin: auto; padding: 20px">
        <n-form
          ref="formRef"
          :model="assembly"
          :rules="rules"
          label-placement="left"
          label-width="150px"
        >
          <div style="display: none">
            <n-input v-model:value="assembly.fId"></n-input>
            <n-date-picker
              v-model:value="assembly.fCreateTime"
              type="datetime"
              :default-value="Date.now()"
            ></n-date-picker>
          </div>
          <n-form-item label="组件名称" path="fName">
            <n-input v-model:value="assembly.fName"></n-input>
          </n-form-item>
          <n-form-item label="组件类型" path="fComponentKey">
            <n-select
              v-model:value="assembly.fComponentKey"
              :options="fComponents"
              @update:value="changeKey"
            />
            <!--            <n-input v-model:value="assembly.fComponentKey"></n-input>-->
          </n-form-item>
          <n-form-item label="组件数据类型" path="fAssemblyComponentDataKey">
            <n-select
              v-model:value="assembly.fAssemblyComponentDataKey"
              :options="fAssemblyComponentData"
            />
            <!--            <n-input v-model:value="assembly.fAssemblyComponentDataKey"></n-input>-->
          </n-form-item>

          <n-form-item label="可使用者" path="fUsedList">
            <form-address
              :fElements="assembly.fUsedList"
              orgType="ORG_TYPE_DEPT|ORG_TYPE_PERSON"
              :multi="true"
              status="edit"
            ></form-address>
            <!-- <qk-address :fElement="fElement" :fElements="fElements" status="edit" :multi="false"></qk-address> -->
          </n-form-item>
          <n-form-item label="排序数字" path="fOrder">
            <n-input
              v-model:value="assembly.fOrder"
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
import createApi from './api'
import layout from "@/layout/layout";

const fComponents = [
  {
    value: 'EchartReport',
    label: '项目统计',
  },
  {
    value: 'ExamArrange',
    label: '考试安排',
  },
  {
    value: 'LawKnowledge',
    label: '法律法规知识库',
  },
  {
    value: 'OfficialAccountProcess',
    label: '公众号流程',
  },
  {
    value: 'OfflineAudit',
    label: '线下待审',
  },
  {
    value: 'OrgStructDiagram',
    label: '业主架构图',
  },
  {
    value: 'PurchaseNotice',
    label: '采购公告',
  },
  {
    value: 'UserProcess',
    label: '我的流程',
  },
  {
    value: 'SupplierProject',
    label: '供应商项目',
  },
  {
    value: 'TextLibrary',
    label: '文本库',
  },
  {
    value: 'UserProject',
    label: '用户项目',
  },
  {
    value: 'WaitAlloAgreement',
    label: '待分配协议',
  },
  {
    value: 'PurchaseAnnouncement',
    label: '已领购项目',
  },
]

const fAssemblyComponentData = reactive([
  {
    value: 'EchartReport',
    label: '年度项目统计',
    parent: 'EchartReport',
  },
  {
    value: 'projectTypeStatistics',
    label: '项目类别统计',
    parent: 'EchartReport',
  },
  {
    value: 'childProject',
    label: '分子公司项目情况',
    parent: 'EchartReport',
  },
  {
    value: 'ExamArrange',
    label: '考试安排',
    parent: 'ExamArrange',
  },
  {
    value: 'LawKnowledge',
    label: '法律法规知识库',
    parent: 'LawKnowledge',
  },
  {
    value: 'OfficialAccountProcess',
    label: '公众号流程',
    parent: 'OfficialAccountProcess',
  },
  {
    value: 'OfflineAudit',
    label: '线下待审',
    parent: 'OfflineAudit',
  },
  {
    value: 'OrgStructDiagram',
    label: '业主架构图',
    parent: 'OrgStructDiagram',
  },
  {
    value: 'PurchaseNotice',
    label: '国招工作台-采购公告',
    parent: 'PurchaseNotice',
  },
  {
    value: 'PurchaseNoticeSupplier',
    label: '供应商门户-采购公告',
    parent: 'PurchaseNotice',
  },
  {
    value: 'UserProcess',
    label: '我的流程',
    parent: 'UserProcess',
  },
  {
    value: 'SupplierProject',
    label: '供应商项目',
    parent: 'SupplierProject',
  },
  {
    value: 'TextLibrary',
    label: '文本库',
    parent: 'TextLibrary',
  },
  {
    value: 'UserProject',
    label: '用户项目',
    parent: 'UserProject',
  },
  {
    value: 'WaitAlloAgreement',
    label: '待分配协议',
    parent: 'WaitAlloAgreement',
  },
  {
    value: 'purchaseAnnouncement',
    label: '已领购项目',
    parent: 'purchaseAnnouncement',
  },
])

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
    const assembly = reactive({
      fId: '',
      fName: '',
      fComponentKey: '',
      fAssemblyComponentDataKey: '',
      fCreateTime: new Date().getTime(),
      fUsedList: [],
      fOrder: '',
      fCreator: {
        fId: '',
      },
    })
    const formRef = ref(null)
    if (props.fId) {
      const param = {
        fId: props.fId,
      }
      api.load(param).then(function (res) {
        if (res.status === 200) {
          var data = res.data
          assembly.fComponentKey = data.fComponentKey
          assembly.fAssemblyComponentDataKey = data.fAssemblyComponentDataKey
          assembly.fName = data.fName
          assembly.fId = data.fId
          assembly.fOrder = data.fOrder
          assembly.fCreator = data.fCreator
          if (data.fUsedList.length > 0) {
            const users = []
            data.fUsedList.forEach((user) => {
              const userInfo = {
                fId: user.fUsed.fId,
                fName: user.fUsed.fName,
              }
              users.push(userInfo)
            })
            assembly.fUsedList = users
          }
          // console.log("获取数据详情：", assembly)
        }
      })
    }

    function add() {
      if (assembly.fUsedList.length > 0) {
        const fUsedList = []
        assembly.fUsedList.forEach((fUsed) => {
          const user = {
            fUsed: fUsed,
          }
          fUsedList.push(user)
        })
        assembly.fUsedList = fUsedList
      }
      api.save(assembly).then(function (res) {
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

    function changeKey(value) {
      assembly.fAssemblyComponentDataKey = ''
      for (var i = 0; i < fAssemblyComponentData.length; i++) {
        if (fAssemblyComponentData[i].parent == value) {
          fAssemblyComponentData[i].disabled = false
        } else {
          fAssemblyComponentData[i].disabled = true
        }
      }
    }

    return {
      assembly,
      onlyAllowNumber: (value) => !value || /^\d+$/.test(value),
      add,
      fComponents,
      fAssemblyComponentData,
      rules: {
        fComponentKey: {
          required: true,
          message: '请输入组件key',
          trigger: 'blur',
        },
        fAssemblyComponentDataKey: {
          required: true,
          message: '请输入组件数据key',
          trigger: 'blur',
        },
        fName: {
          required: true,
          message: '请输入组件名称',
          trigger: 'blur',
        },
      },
      changeKey,
    }
  },
})
</script>

<style></style>
