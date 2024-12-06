<template>
  <n-grid :cols="1" y-gap="10">
    <n-gi>
      <n-space>
        <p style="font-size: 16px; font-weight: bold">汇报评审</p>
        <n-select
          v-if="isProjectStart"
          :options="hasMeeting"
          v-model:value="hasVal"
          style="width: 80px"
          @update:value="isProjectReportReviewChange"
          :disabled="
            !props.data.isManager ||
            reports.length > 0 ||
            props.data.fAuditStatus != '1'
          "
        ></n-select>
        <n-button-group>
          <n-space>
            <n-button
              v-if="
                hasVal &&
                isProjectStart &&
                props.data.isManager &&
                props.data.fAuditStatus == '1' &&
                !finishDocumentation
              "
              type="primary"
              @click="reportAdd"
              :disabled="!props.open"
            >
              添加
            </n-button>
            <n-button
              v-if="
                hasVal &&
                isProjectStart &&
                props.data.fAuditStatus == '1' &&
                !finishDocumentation
              "
              tag="a"
              @click="reservationOaMeeting"
              target="_blank"
              type="primary"
              :disabled="!props.open"
            >
              会议室预订
            </n-button>
            <n-button
              v-if="
                hasVal &&
                isProjectStart &&
                props.data.fAuditStatus == '1' &&
                !finishDocumentation
              "
              tag="a"
              @click="reservationOaCar"
              target="_blank"
              type="primary"
              :disabled="!props.open"
            >
              车辆预订
            </n-button>
            <n-button
              v-if="hasVal && isProjectStart && props.data.fAuditStatus == '1'"
              tag="a"
              @click="openOaMeetingRoom"
              type="primary"
            >
              会议室查看
            </n-button>
            <n-button
              v-if="hasVal && isProjectStart && props.data.fAuditStatus == '1'"
              tag="a"
              @click="openOaCar"
              type="primary"
            >
              车辆查看
            </n-button>
          </n-space>
        </n-button-group>
      </n-space>
    </n-gi>
    <n-gi v-for="report in reports" v-show="showMeeting(report)">
      <n-card>
        <n-grid :cols="1">
          <n-gi>
            <p style="font-size: 16px; font-weight: bold">会议信息</p>
          </n-gi>
          <n-gi>
            <n-table :single-line="false">
              <tbody>
                <tr>
                  <td style="width: 20%; height: auto" class="tdcenter">
                    包件信息<br />
                    <n-button
                      v-if="
                        props.data.isManager &&
                        props.data.fAuditStatus == '1' &&
                        !finishDocumentation
                      "
                      @click="editOaMeeting(report)"
                      >编辑</n-button
                    >
                  </td>
                  <td class="tdleft" style="width: 30%">
                    {{ report.packageName }}
                  </td>
                  <td style="width: 20%" class="tdcenter">会议类型</td>
                  <td class="tdleft" style="width: 30%">
                    {{ report.type }}
                  </td>
                </tr>
                <tr>
                  <td style="width: 20%" class="tdcenter">会议名称</td>
                  <td class="tdleft">
                    {{ report.fName }}
                  </td>
                  <td style="width: 20%" class="tdcenter">会议时间</td>
                  <td class="tdleft">
                    {{ report.meetingStartTime }} ~
                    {{ report.meetingEndTime }}
                  </td>
                </tr>
                <tr>
                  <td style="width: 20%" class="tdcenter">会议地点</td>
                  <td class="tdleft">
                    {{ report.meetingRoom }}
                  </td>
                  <td style="width: 20%" class="tdcenter">业主专家</td>
                  <td class="tdleft">
                    {{ report.experts }}
                  </td>
                </tr>
                <tr>
                  <td style="width: 20%" class="tdcenter">外聘专家</td>
                  <td class="tdleft">
                    <p v-for="expert in report.exExperts">{{ expert.name }};</p>
                  </td>
                  <td style="width: 20%" class="tdcenter">备注</td>
                  <td class="tdleft">
                    {{ report.remarks }}
                  </td>
                </tr>
              </tbody>
            </n-table>
          </n-gi>
          <!--            <n-gi>
              <p style="font-size: 16px; font-weight: bold">附件上传</p>
            </n-gi>
            <n-gi>
              <n-table :single-line="false">
                <tbody>
                  <tr>
                    <td style="width: 20%" class="tdcenter">会议方案</td>
                    <td class="tdleft">
                        <sitc-attachment
                          :linkPackage="true"
                          :projectId="props.data.fId"
                          modelName="com.qkinfotech.core.tendering.model.apps.report.AppsReport"
                          :modelId="report.fId"
                          fkey="meetingPlan"
                          :disabled="
                            !props.data.isManager ||
                            props.data.fAuditStatus != '1' || finishDocumentation
                          "
                        >
                        </sitc-attachment>
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 20%" class="tdcenter"><span>会议议程</span><span style="color: red">*</span></td>
                    <td class="tdleft">
                        <sitc-attachment
                          :linkPackage="true"
                          :projectId="props.data.fId"
                          modelName="com.qkinfotech.core.tendering.model.apps.report.AppsReport"
                          :modelId="report.fId"
                          fkey="meetingAgenda"
                          :disabled="
                            !props.data.isManager ||
                            props.data.fAuditStatus != '1' || finishDocumentation
                          "
                        >
                        </sitc-attachment>
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 20%" class="tdcenter">签到表</td>
                    <td class="tdleft">
                        <sitc-attachment
                          :linkPackage="true"
                          :projectId="props.data.fId"
                          modelName="com.qkinfotech.core.tendering.model.apps.report.AppsReport"
                          :modelId="report.fId"
                          fkey="meetingSign"
                          :disabled="
                            !props.data.isManager ||
                            props.data.fAuditStatus != '1' || finishDocumentation
                          "
                        >
                        </sitc-attachment>
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 20%" class="tdcenter">专家打分表</td>
                    <td class="tdleft">
                        <sitc-attachment
                          :linkPackage="true"
                          :projectId="props.data.fId"
                          modelName="com.qkinfotech.core.tendering.model.apps.report.AppsReport"
                          :modelId="report.fId"
                          fkey="expertMark"
                          :disabled="
                            !props.data.isManager ||
                            props.data.fAuditStatus != '1' || finishDocumentation
                          "
                        >
                        </sitc-attachment>
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 20%" class="tdcenter">专家意见表</td>
                    <td class="tdleft">
                        <sitc-attachment
                          :linkPackage="true"
                          :projectId="props.data.fId"
                          modelName="com.qkinfotech.core.tendering.model.apps.report.AppsReport"
                          :modelId="report.fId"
                          fkey="expertSuggestion"
                          :disabled="
                            !props.data.isManager ||
                            props.data.fAuditStatus != '1' || finishDocumentation
                          "
                        >
                        </sitc-attachment>
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 20%" class="tdcenter">会议纪要</td>
                    <td class="tdleft">
                        <sitc-attachment
                          :linkPackage="true"
                          :projectId="props.data.fId"
                          modelName="com.qkinfotech.core.tendering.model.apps.report.AppsReport"
                          :modelId="report.fId"
                          fkey="meetingMinutes"
                          :disabled="
                            !props.data.isManager ||
                            props.data.fAuditStatus != '1' || finishDocumentation
                          "
                        >
                        </sitc-attachment>
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 20%" class="tdcenter">成果文件</td>
                    <td class="tdleft">
                        <sitc-attachment
                          :linkPackage="true"
                          :projectId="props.data.fId"
                          modelName="com.qkinfotech.core.tendering.model.apps.report.AppsReport"
                          :modelId="report.fId"
                          fkey="resultFile"
                          :disabled="
                            !props.data.isManager ||
                            props.data.fAuditStatus != '1' || finishDocumentation
                          "
                        >
                        </sitc-attachment>
                    </td>
                  </tr>
                  <tr>
                    <td style="width: 20%" class="tdcenter">其他</td>
                    <td class="tdleft">
                        <sitc-attachment
                          :linkPackage="true"
                          :projectId="props.data.fId"
                          modelName="com.qkinfotech.core.tendering.model.apps.report.AppsReport"
                          :modelId="report.fId"
                          fkey="other"
                          :disabled="
                            !props.data.isManager ||
                            props.data.fAuditStatus != '1' || finishDocumentation
                          "
                        >
                        </sitc-attachment>
                    </td>
                  </tr>
                </tbody>
              </n-table>
            </n-gi>-->
        </n-grid>
      </n-card>
    </n-gi>
  </n-grid>
  <n-modal
    v-model:show="reportShow"
    style="width: 60%"
    preset="dialog"
    title="新建汇报评审"
    :mask-closable="false"
  >
    <reportEdit
      @createReport="createReport"
      @onClose="closeModal"
      :data="props.data"
    ></reportEdit>
  </n-modal>
  <n-modal
    v-model:show="editShow"
    style="width: 60%"
    preset="dialog"
    title="汇报评审编辑"
    :mask-closable="false"
  >
    <reportEdit
      :data="props.data"
      :id="editId"
      @createReport="createReport"
      @onClose="closeModal"
    ></reportEdit>
  </n-modal>
</template>

<script setup>
import { ref, defineComponent, reactive, inject } from 'vue'
import formAddress from '@/apps/common/address/formAddress.vue'
import sitcAttachment from '@/apps/common/attachment/SITCAttachment.vue'
import reportEdit from './report_edit.vue'
import singleLoginApi from '@/utils/singleLogin'
import { useMessage } from 'naive-ui'
import baseUrl from '@/utils/baseUrl'
import createApi from './api'

const props = defineProps(['open', 'data', 'isProjectStart'])
//在评审会list后调用，刷新节点
const emits = defineEmits(['handleNodes'])

const currentInstance = getCurrentInstance()
const api = createApi(currentInstance)
const singleLogin = singleLoginApi(currentInstance)
const message = useMessage()
const finishDocumentation = inject('finishDocumentation')

const isProjectReportReviewChange = (v) => {
  if (!v) {
    //用户选中了无,更新项目中该字段
    const param = {
      fId: props.data.fId,
      isReportReview: v,
    }
    api.editProjectNoReportReview(param).then(function (res) {
      if (res.status === 200) {
        message.success('更新成功')
        emits('handleNodes', true)
      }
    })
  }
}
const projectModel = reactive({})
watch(
  () => props.data.fName,
  (New, Old) => {
    Object.assign(projectModel, props.data)
    init()
  },
  {
    deep: true,
  },
)

const hasVal = ref()
const hasMeeting = reactive([
  {
    label: '请选择',
    value: '',
    disabled: true,
  },
  {
    label: '有',
    value: true,
  },
  {
    label: '无',
    value: false,
  },
])
const openReport = ref(true)
const options = reactive([
  {
    label: '选项1',
    value: '1',
  },
  {
    label: '选项2',
    value: '2',
  },
  {
    label: '选项3',
    value: '3',
  },
  {
    label: '选项4',
    value: '4',
  },
])

const reportShow = ref(false)
const reportAdd = () => {
  reportShow.value = true
}

const options2 = [
  {
    label: '会议申请',
    key: 'meetingApplication',
  },
  {
    label: '申请用车',
    key: 'vehicleApplication',
  },
  {
    label: '其他会议',
    key: 'otherMeeting',
  },
]

const reports = reactive([])
//会议list初始化方法
const init = async () => {
  reports.length = 0
  await api
    .reportMeetingList({
      fId: props.data.fId,
    })
    .then((result) => {
      const data = result.data
      const isDisplay = ref(false)
      if (data.length !== 0) {
        hasVal.value = true
        props.data.isAddCollectionResult = hasVal.value === true
        for (var i = 0; i < data.length; i++) {
          const obj = {}
          obj.meetingEndTime = data[i].meetingEndTime
          obj.meetingRoom = data[i].meetingRoom
          obj.meetingStartTime = data[i].meetingStartTime
          obj.packageName = data[i].packageName
          obj.remarks = data[i].remarks
          obj.type = data[i].type
          obj.fName = data[i].fName
          obj.fId = data[i].fId
          obj.experts = data[i].fOwnerExpert
          obj.exExperts = data[i].fOutsideExpert
          obj.id = data[i].id
          obj.fFrom = data[i].fFrom
          obj.fInId = data[i].fInId
          obj.fEdited = data[i].fEdited
          obj.projectNo = props.data.fProjectNo
          reports.push(obj)
          if (obj.packageName) {
            isDisplay.value = true
          }
        }
      } else {
        if (props.data.fIsProjectReportReview != null) {
          hasVal.value = props.data.fIsProjectReportReview
        }
        isDisplay.value = false
      }
      emits('handleNodes', isDisplay)
    })
    .catch((err) => {
      console.log(err)
    })
}

//保存
function createReport(report) {
  reportShow.value = false
  editShow.value = false
  saveProjectReportReview(true)
  emits('handleNodes', true)
  init()
}

//修改项目中是否有评审会字段
function saveProjectReportReview(isOk) {
  const param = {
    fId: props.data.fId,
    isReportReview: isOk,
  }
  api.editProjectNoReportReview(param)
}
//取消
const closeModal = (v) => {
  reportShow.value = false
  editShow.value = false
}

//初始化调用
onMounted(() => {
  init()
})

function reservationOaCar() {
  var url = baseUrl.oaJumpUrl + '/j/sitc/adm/car_order/new.jsp'
  singleLogin.oaJump(url)
}

function reservationOaMeeting() {
  var url = baseUrl.oaJumpUrl + '/j/sitc/adm/mroom/mroom_list.jsp'
  singleLogin.oaJump(url)
}

function openOaCar() {
  var url = baseUrl.oaJumpUrl + '/j/sitc/adm/car_order/list.jsp'
  singleLogin.oaJump(url)
}

function openOaMeetingRoom() {
  var url = baseUrl.oaJumpUrl + '/j/sitc/adm/mroom/mroom_list_p.jsp'
  singleLogin.oaJump(url)
}

const editShow = ref(false)
const editId = ref('')
function editOaMeeting(row) {
  editShow.value = true
  editId.value = row.id
}

const selectedPackageId = inject('selectedPackageId')
const selectedPackageName = inject('selectedPackageName')
function showMeeting(meeting) {
  if (selectedPackageId.value.length == 0) {
    return true
  }
  if (meeting.packageName === '') {
    return true
  }
  return (
    meeting.packageName
      .split(';')
      .filter((value) => selectedPackageName.value.includes(value)).length > 0
  )
}
</script>

<style></style>
