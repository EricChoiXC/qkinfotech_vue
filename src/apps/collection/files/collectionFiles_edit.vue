<template>
  <n-grid :cols="2">
    <n-gi :span="2">
      <p style="font-size: 16px; font-weight: bold">方案征集文件</p>
    </n-gi>
    <n-gi :span="2">
      <n-table :single-line="false">
        <tbody>
          <tr>
            <td style="width: 20%" class="tdcenter">
              征集文件
              <br/>
              <div v-show="showConfirmColFileFinTime()">
                <n-popconfirm @positiveClick="confirmColFileFinTime">
                  <n-date-picker value-format="yyyy-MM-dd" type="date" v-model:formatted-value="clickColFileFinTime"></n-date-picker>
                  <template #trigger>
                    <n-button type="success">
                      确认方案征集文件截止日期
                    </n-button>
                  </template>
                </n-popconfirm>
              </div>
              <div v-show="fColFileFinTime !== undefined">
                截止日期：{{fColFileFinTimeDate}}
              </div>
              <n-button type="success" @click="openIsoApproval($props.data.fId)"
                        v-show="isProjectManager && !finishDocumentation && fColFileFinTime !== undefined">
                成果产品检验流转
              </n-button>
            </td>
            <td class="tdleft">
              <sitc-attachment
                title="征集文件"
                modelName="com.qkinfotech.core.tendering.iso.model.IsoApproval"
                :modelId="collectionFileIsoId"
                fkey="征集文件"
                :disabled="true">
              </sitc-attachment>
            </td>
          </tr>
        </tbody>
      </n-table>
    </n-gi>
    <n-gi :span="2">
      <p style="font-size: 16px; font-weight: bold">附件上传</p>
    </n-gi>
    <n-gi :span="2">
      <n-table :single-line="false">
        <tbody>
          <tr>
            <td style="width: 20%" class="tdcenter">答疑文件</td>
            <td class="tdleft">
              <sitc-attachment
                title="答疑文件"
                modelName="com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain"
                :modelId="id"
                :projectId="id"
                fkey="answerFile"
                :linkPackage="true"
                :disabled="!isProjectManager || finishDocumentation"
              ></sitc-attachment>
            </td>
          </tr>
          <tr>
            <td style="width: 20%" class="tdcenter">技术资料</td>
            <td class="tdleft">
              <sitc-attachment
                title="技术资料"
                modelName="com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain"
                :modelId="id"
                :projectId="id"
                fkey="tecFile"
                :linkPackage="true"
                :disabled="!isProjectManager || finishDocumentation"
              ></sitc-attachment>
            </td>
          </tr>
        </tbody>
      </n-table>
    </n-gi>
  </n-grid>
</template>

<script setup>
import { ref, defineComponent, h, reactive } from 'vue'
import formAddress from '@/apps/common/address/formAddress.vue'
import sitcAttachment from '@/apps/common/attachment/SITCAttachment.vue'
import { Pencil } from '@vicons/ionicons5'
import { useRoute, useRouter } from 'vue-router'
import createApi from './api'
import storage from '@/utils/storage'
import context from '@/context.js'
import {useMenuStore} from '@/store/menu.js'
import baseUrl from "@/utils/baseUrl";
import {useMessage} from 'naive-ui'
import moment from 'moment'
const menuStore = useMenuStore()

const message = useMessage()
const api = createApi(getCurrentInstance())

const props = defineProps({
  data: Object,
})
watch(
  () => props.data.fName,
  (New, Old) => {
    id = props.data.fId
    getManager()
    getCollectionFileIsoId(id)
  },
  {
    deep: true,
  },
)

const finishDocumentation = inject('finishDocumentation')

const route = useRoute()
let id = menuStore.currentRouteObj.urlParams.fId
const isProjectManager = ref(false)
const getManager = async () => {
  await api.load({ fId: id }).then(function (res) {
    if (res.status == 200) {
      isProjectManager.value =
        res.data.fDeptManager.fId === context.user() &&
        res.data.fAuditStatus == '1'
    }
  })
}
if (id) {
  getManager()
}
const checkVal = ref([])

const items = ref([
  {
    fName: '中央公园景观组Agenter合同.pdf',
    fCreateTime: '2023-08-23',
    tooltip: '此处显示关联包件',
  },
  {
    fName: '中央公园景观组BAM合同.pdf',
    fCreateTime: '2023-08-23',
    tooltip: '此处显示关联包件',
  },
  {
    fName: '中央公园景观组Sasaki合同.pdf',
    fCreateTime: '2024-08-23',
    tooltip: '此处显示关联包件',
  },
])
const items2 = ref([])

const collectionFileIsoId = ref("")
function getCollectionFileIsoId(id){
  var query = {
    query: {
      and: [
        {"eq": {"fProjectId": id}},
        {"eq": {"fStatus": "30"}},
        {"eq": {"fAchievementName": "征集文件"}}
      ]
    },
    sort: ["fFinishTime desc"]
  }
  api.isoApprovalList(query).then(function(res){
    if (res.data.list.length > 0) {
      collectionFileIsoId.value = res.data.list[0].fId
    }
  })
}

async function openIsoApproval(id) {
  if (await hasProcessingApproval(id)) {
    message.warning("已有在流转的审批单，无法发起ISO审批！")
  } else {
    window.open(
      baseUrl.pmUrl +
      '/view/projectManagement/implementation/project-iso-edit?projectId=' + id +
      '&name=征集文件', '_blank'
    )
  }
}

//校验是否可发起iso审批
async function hasProcessingApproval(id) {
  //校验规则：当前项目当前类型的所有流程，没有处于正在流转状态，即可针对这版本发起重新审批
  var hasProcessing = false
  var query = {
    query: {
      and: [
        {"eq": {"fAchievementName": "征集文件"}},
        {
          "not": {
            "in": {
              "fStatus": ["00", "30"]
            }
          }
        },
        {"eq": {"fProjectId": id}}
      ]
    }
  }
  await api.isoApprovalList(query).then(function(res){
    hasProcessing = (res.data.list.length != 0)
  })
  return hasProcessing
}

const fColFileFinTime = ref(props.data.fColFileFinTime)
const clickColFileFinTime = ref(props.data.fColFileFinTime)
const fColFileFinTimeDate = ref("")
moment().locale('zn-cn')
fColFileFinTimeDate.value = moment(fColFileFinTime.value).format("YYYY-MM-DD")

function confirmColFileFinTime() {
  if (clickColFileFinTime.value == null) {
    return
  }
  fColFileFinTime.value = clickColFileFinTime.value
  moment().locale('zn-cn')
  fColFileFinTimeDate.value = moment(fColFileFinTime.value).format("YYYY-MM-DD")
  api.appsProjectMainSave({
    fId : props.data.fId,
    fColFileFinTime : fColFileFinTime.value
  })
}

function showConfirmColFileFinTime(){
  return isProjectManager.value && !finishDocumentation.value && fColFileFinTime.value === undefined
}
</script>

<style></style>
