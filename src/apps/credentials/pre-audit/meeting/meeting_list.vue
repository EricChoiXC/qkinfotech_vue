<template>
  <n-card v-for="item in data" style="margin-bottom:20px" v-show="showMeeting(item)">
      <n-table :single-line="false">
        <tbody>
          <tr>
            <td style="width:20%;" class="tdcenter">
              包件信息<br/>
              <n-button v-if="props.isManager" @click="editOaMeeting(item)">编辑</n-button>
            </td>
            <td class="tdleft" style="width: 30%">
                {{item.packageName}}
            </td>
            <td style="width:20%;" class="tdcenter">会议类型</td>
            <td class="tdleft" style="width: 30%">
                {{item.type}}
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">会议地点</td>
            <td class="tdleft">
                {{item.meetingRoom}}
            </td>
            <td style="width:20%;" class="tdcenter">会议时间</td>
            <td class="tdleft">
                {{item.meetingStartTime}} ~ {{item.meetingEndTime}}
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">业主专家</td>
            <td class="tdleft">
                {{item.experts}}
            </td>
            <td style="width:20%;" class="tdcenter">外聘专家</td>
            <td class="tdleft">
                <!-- {{item.exExperts}} -->
                <n-space>
                  <span v-for="exp in item.exExperts">
                    {{exp.name}}
                  </span>
                </n-space>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">备注</td>
            <td class="tdleft" colspan="3">
                {{item.remarks}}
            </td>
          </tr>
          <!-- <tr>
            <td style="width:20%;" class="tdcenter">签到表</td>
            <td class="tdleft" colspan="3">
                <sitc-attachment :linkPackage="true" :projectId="item.projId"
                  modelName="com.qkinfotech.core.tendering.model.apps.pre.AppsPreAuditMeeting"
                  :modelId="item.id" fkey="attendanceSheet" :disabled="!props.isManager">
                </sitc-attachment>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">专家投票/打分表</td>
            <td class="tdleft" colspan="3">
                <sitc-attachment :linkPackage="true" :projectId="item.projId"
                  modelName="com.qkinfotech.core.tendering.model.apps.pre.AppsPreAuditMeeting"
                  :modelId="item.id" fkey="expertVote" :disabled="!props.isManager">
                </sitc-attachment>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">专家意见表</td>
            <td class="tdleft" colspan="3">
                <sitc-attachment :linkPackage="true" :projectId="item.projId"
                  modelName="com.qkinfotech.core.tendering.model.apps.pre.AppsPreAuditMeeting"
                  :modelId="item.id" fkey="expertOpinion" :disabled="!props.isManager">
                </sitc-attachment>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">结果公告</td>
            <td class="tdleft" colspan="3">
                <sitc-attachment :linkPackage="true" :projectId="item.projId"
                  modelName="com.qkinfotech.core.tendering.model.apps.pre.AppsPreAuditMeeting"
                  :modelId="item.id" fkey="resultNotice" :disabled="!props.isManager">
                </sitc-attachment>
            </td>
          </tr>
          <tr>
            <td style="width:20%;" class="tdcenter">资格预审报告</td>
            <td class="tdleft" colspan="3">
                <sitc-attachment :linkPackage="true" :projectId="item.projId"
                  modelName="com.qkinfotech.core.tendering.model.apps.pre.AppsPreAuditMeeting"
                  :modelId="item.id" fkey="preReport" :disabled="!props.isManager">
                </sitc-attachment>
            </td>
          </tr> -->
        </tbody>
      </n-table>
  </n-card>
  <n-modal style="width:85%" v-model:show="editShow" preset="dialog" title="资格预审会议" :mask-closable="false">
    <MeetingEdit :id="editId" @onClose="closeModal(editShow)" @onSuccess="successModal"></MeetingEdit>
  </n-modal>
</template>


<script setup>
  import {
    defineComponent,
    ref,
    inject
  } from "vue";
  import sitcAttachment from '@/apps/common/attachment/SITCAttachment.vue'
  import {
    Pencil
  } from '@vicons/ionicons5'
  import MeetingEdit from './meeting_edit.vue'

  const disabled = ref(true);
  const props = defineProps({
    data: Array,
    isManager: Boolean
  })
  const emit = defineEmits(['init'])

  const data = props.data

  const editShow = ref(false)
  const editId = ref("")
  function editOaMeeting(row) {
    editShow.value = true
    editId.value = row.id
  }

  //会议保存
  const successModal = async (v) => {
    editShow.value = false
    emit('init')
  }
  //会议取消
  const closeModal = (v) => {
    editShow.value = false
  }


  const selectedPackageId = inject('selectedPackageId')
  const selectedPackageName = inject('selectedPackageName')

  function showMeeting(item) {
    if (selectedPackageName.value.length == 0) {
      return true
    }
    if (item.packageName === '') {
      return true
    }
    return item.packageName.split(";").filter(value => selectedPackageName.value.includes(value)).length > 0
  }
</script>


<style>
</style>
