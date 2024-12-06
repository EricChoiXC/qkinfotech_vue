<template>
  <n-grid :cols="1" y-gap="10">
    <n-gi>
      <n-space>
        <p style="font-size: 16px; font-weight: bold">项目启动会</p>
        <n-select
          v-if="isProjectNomination"
          :options="hasMeeting"
          v-model:value="hasVal"
          style="width: 80px"
          @update:value="isProjectStartChange"
          :disabled="
            !props.data.isManager ||
            meetingKickoffs.length > 0 ||
            props.data.fAuditStatus != '1' ||
            finishDocumentation
          "
        ></n-select>
        <n-button
          v-if="
            hasVal &&
            isProjectNomination &&
            props.data.isManager &&
            props.data.fAuditStatus == '1' &&
            !finishDocumentation
          "
          type="primary"
          @click="meetingAdd"
        >
          添加
        </n-button>
        <n-button
          v-if="
            hasVal &&
            isProjectNomination &&
            props.data.fAuditStatus == '1' &&
            !finishDocumentation
          "
          tag="a"
          @click="reservationOaMeeting"
          target="_blank"
          type="primary"
        >
          会议室预订
        </n-button>
        <n-button
          v-if="
            hasVal &&
            isProjectNomination &&
            props.data.fAuditStatus == '1' &&
            !finishDocumentation
          "
          tag="a"
          @click="reservationOaCar"
          target="_blank"
          type="primary"
        >
          车辆预订
        </n-button>
        <n-button
          v-if="hasVal && isProjectNomination && props.data.fAuditStatus == '1'"
          tag="a"
          @click="openOaMeetingRoom"
          type="primary"
        >
          会议室查看
        </n-button>
        <n-button
          v-if="hasVal && isProjectNomination && props.data.fAuditStatus == '1'"
          tag="a"
          @click="openOaCar"
          type="primary"
        >
          车辆查看
        </n-button>
      </n-space>
    </n-gi>
    <n-gi v-for="meeting in meetingKickoffs" v-show="showMeeting(meeting)">
      <n-card>
        <n-grid :cols="1">
          <n-gi>
            <p style="font-size: 16px; font-weight: bold">会议信息</p>
          </n-gi>
          <n-gi>
            <n-table :single-line="false">
              <tbody>
                <tr>
                  <td style="width: 20%" class="tdcenter">
                    包件信息<br />
                    <n-button
                      v-if="
                        props.data.isManager &&
                        props.data.fAuditStatus == '1' &&
                        !finishDocumentation
                      "
                      @click="editOaMeeting(meeting)"
                      >编辑
                    </n-button>
                  </td>
                  <td class="tdleft" style="width: 30%">
                    {{ meeting.packageName }}
                  </td>
                  <td style="width: 20%" class="tdcenter">会议名称</td>
                  <td class="tdleft">
                    {{ meeting.fName }}
                  </td>
                </tr>
                <tr>
                  <td style="width: 20%" class="tdcenter">会议时间</td>
                  <td class="tdleft">
                    {{ meeting.meetingStartTime }} ~
                    {{ meeting.meetingEndTime }}
                  </td>
                  <td style="width: 20%" class="tdcenter">会议地点</td>
                  <td class="tdleft">
                    {{ meeting.meetingRoom }}
                  </td>
                </tr>
              </tbody>
            </n-table>
          </n-gi>
          <!-- <n-gi>
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
                      :projectId="id"
                      modelName="com.qkinfotech.core.tendering.model.apps.meeting.AppsMeetingKickoff"
                      :modelId="meeting.fId"
                      fkey="meetingPlan"
                      :disabled="
                        !props.data.isManager ||
                        props.data.fAuditStatus != '1' ||
                        finishDocumentation
                      "
                    >
                    </sitc-attachment>
                  </td>
                </tr>
                <tr>
                  <td style="width: 20%" class="tdcenter">
                    <span>会议议程</span><span style="color: red">*</span>
                  </td>
                  <td class="tdleft">
                    <sitc-attachment
                      :linkPackage="true"
                      :projectId="id"
                      modelName="com.qkinfotech.core.tendering.model.apps.meeting.AppsMeetingKickoff"
                      :modelId="meeting.fId"
                      fkey="meetingAgenda"
                      :disabled="
                        !props.data.isManager ||
                        props.data.fAuditStatus != '1' ||
                        finishDocumentation
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
                      :projectId="id"
                      modelName="com.qkinfotech.core.tendering.model.apps.meeting.AppsMeetingKickoff"
                      :modelId="meeting.fId"
                      fkey="meetingSign"
                      :disabled="
                        !props.data.isManager ||
                        props.data.fAuditStatus != '1' ||
                        finishDocumentation
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
                      :projectId="id"
                      modelName="com.qkinfotech.core.tendering.model.apps.meeting.AppsMeetingKickoff"
                      :modelId="meeting.fId"
                      fkey="other"
                      :disabled="
                        !props.data.isManager ||
                        props.data.fAuditStatus != '1' ||
                        finishDocumentation
                      "
                    >
                    </sitc-attachment>
                  </td>
                </tr>
              </tbody>
            </n-table>
          </n-gi> -->
        </n-grid>
      </n-card>
    </n-gi>
  </n-grid>
  <n-modal
    v-model:show="meetingShow"
    style="width: 60%"
    preset="dialog"
    title="启动会新建"
    :mask-closable="false"
  >
    <meetingKickoffEdit
      @createMeetingKickoff="createMeeting"
      @onClose="closeModal"
    ></meetingKickoffEdit>
  </n-modal>
  <n-modal
    v-model:show="editShow"
    style="width: 60%"
    preset="dialog"
    title="启动会编辑"
    :mask-closable="false"
  >
    <meetingKickoffEdit
      :id="editId"
      @createMeetingKickoff="createMeeting"
      @onClose="closeModal"
    ></meetingKickoffEdit>
  </n-modal>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import {
  ref,
  defineComponent,
  h,
  reactive,
  inject,
  getCurrentInstance,
} from 'vue'
import {
  useMessage
} from 'naive-ui'
import formAddress from '@/apps/common/address/formAddress.vue'
import sitcAttachment from '@/apps/common/attachment/SITCAttachment.vue'
import meetingKickoffEdit from './meetingKickoff_edit.vue'
import { Pencil } from '@vicons/ionicons5'
import storage from '@/utils/storage'
import singleLoginApi from '@/utils/singleLogin'
import baseUrl from '@/utils/baseUrl'
import createApi from './api'
import {useMenuStore} from '@/store/menu.js'
const menuStore = useMenuStore()

const singleLogin = singleLoginApi(getCurrentInstance())
const api = createApi(getCurrentInstance())
const route = useRoute()
const id = menuStore.currentRouteObj.urlParams.fId

const props = defineProps(['data', 'isProjectNomination'])

//在启动会list后调用，刷新节点
const emits = defineEmits(['handleNodes'])
const checkProjectStarts = inject('checkProjectStarts')
const finishDocumentation = inject('finishDocumentation')

const hasVal = ref()

const meetingShow = ref(false)
const meetingAdd = () => {
  meetingShow.value = true
}

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

const options = [
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

const meetingKickoffs = reactive([])

const message = useMessage()

const isProjectStartChange = (v) => {
  if (!v) {
    //用户选中了无,更新项目中该字段
    const param = {
      fId: id,
      isStart: v,
    }
    api.editProjectNoStart(param).then(function (res) {
      if (res.status === 200) {
        message.success('更新成功')
        checkProjectStarts()
        emits('handleNodes', true)
      }
    })
  }
}
const init = async () => {
  meetingKickoffs.length = 0;
  await api.meetingList({
    fId: id
  }).then(result => {
    const data = result.data;
    const isDisplay = ref(false);
    if (data.length != 0) {
      hasVal.value = true
      isDisplay.value = true;
      for (var i = 0; i < data.length; i++) {
        const obj = data[i].json;
        obj.meetingEndTime = data[i].meetingEndTime
        obj.meetingRoom = data[i].meetingRoom
        obj.meetingStartTime = data[i].meetingStartTime
        obj.packageName = data[i].packageName
        obj.fName = data[i].fName
        obj.id = data[i].id
        obj.fFrom = data[i].fFrom
        obj.fInId = data[i].fInId
        obj.fEdited = data[i].fEdited
        obj.projectNo = props.data.fProjectNo
        meetingKickoffs.push(obj)
      }
    }else{
      if(props.data.fIsProjectStart != null){
        hasVal.value = props.data.fIsProjectStart
        isDisplay.value = true;
      }
    }
    emits('handleNodes', isDisplay)
  }).catch(err => {
    console.log(err)
  });
}

//保存
function createMeeting(meeting) {
  meetingShow.value = false
  editShow.value = false
  init()
}

//取消
const closeModal = async (v) => {
  meetingShow.value = false
  editShow.value = false
}

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
