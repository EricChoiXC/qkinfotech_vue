<template>
  <n-card>
    <div style="justify-content: center; display: flex">
      <n-form
        ref="formRef"
        :model="isoApproval"
        label-placement="left"
        label-width="150px"
        style="width: 60%"
      >
        <n-table :single-line="false">
          <tbody>
            <tr>
              <td colspan="2">
                <n-space vertical>
                  <p
                    style="
                      text-align: center;
                      font-size: 16px;
                      font-weight: bold;
                    "
                  >
                    成果产品校验流转单（SITC/WR06-A01）
                    <n-button
                      type="info"
                      @click="restart"
                      v-if="isProjectManager"
                      >重新审批</n-button
                    >
                  </p>
                  <div>填表人：{{ isoApproval.fCreatorName }}</div>
                  <div>
                    <n-space justify="space-between">
                      <div>填表时间：{{ isoApproval.fCreateTime }}</div>
                      <div>编号：{{ isoApproval.fNo }}</div>
                    </n-space>
                  </div>
                </n-space>
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                项目/投标编号
              </th>
              <td>
                {{ isoApproval.fProjectNo }}
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                项目/投标名称
              </th>
              <td>
                {{ isoApproval.fProjectName }}
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                成果产品名称
              </th>
              <td>
                {{ isoApproval.fSubject }}
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                招标文本模板
              </th>
              <td>
                {{ isoApproval.fModelName }}
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                产品成果编制人
              </th>
              <td>
                {{ isoApproval.fAchievementPreparedName }}
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                成果使用语言
              </th>
              <td>
                {{ isoApproval.fAchievementLanguage }}
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                附件
              </th>
              <td>
                <sitcAttachment :linkPackage="true" :projectId="isoApproval.fProjectId"
                                :modelId="isoApproval.fId" modelName="com.qkinfotech.core.tendering.iso.model.IsoApproval" :fkey="isoApproval.fAchievementName"
                                :disabled="true" fileType=".pdf">
                </sitcAttachment>
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                备注
              </th>
              <td>
                <div>
                  {{ isoApproval.fNotes }}
                </div>
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                自检情况
              </th>
              <td>
                <div v-if="isoApproval.fFirstCheck.message" style="width: 100%">
                  <n-space vertical>
                    <div>
                      {{ isoApproval.fFirstCheck.message }}
                    </div>
                    <div style="text-align: right">
                      签名：{{ isoApproval.fFirstCheck.handler }}<br />
                      日期：{{ isoApproval.fFirstCheck.time }}
                    </div>
                  </n-space>
                </div>
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                复检情况
              </th>
              <td>
                <div v-if="isoApproval.fReCheck.message" style="width: 100%">
                  <n-space vertical>
                    <div>
                      {{ isoApproval.fReCheck.message }}
                    </div>
                    <div style="text-align: right">
                      签名：{{ isoApproval.fReCheck.handler }}<br />
                      日期：{{ isoApproval.fReCheck.time }}
                    </div>
                  </n-space>
                </div>
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                相关部门评审意见
              </th>
              <td>
                <n-space vertical style="width: 100%">
                  <div
                    v-for="deptMessage in isoApproval.fDeptApproval"
                    style="width: 100%"
                  >
                    <n-space vertical>
                      <div>
                        {{ deptMessage.message }}
                      </div>
                      <div style="text-align: right">
                        签名：{{ deptMessage.handler }}<br />
                        日期：{{ deptMessage.time }}
                      </div>
                    </n-space>
                  </div>
                </n-space>
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                审检情况
              </th>
              <td>
                <div v-if="isoApproval.fApproval.message" style="width: 100%">
                  <n-space vertical>
                    <div>
                      {{ isoApproval.fApproval.message }}
                    </div>
                    <div style="text-align: right">
                      签名：{{ isoApproval.fApproval.handler }}<br />
                      日期：{{ isoApproval.fApproval.time }}
                    </div>
                  </n-space>
                </div>
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                最终检验情况
              </th>
              <td>
                <div
                  v-if="isoApproval.fFinalApproval.message"
                  style="width: 100%"
                >
                  <n-space vertical>
                    <div>
                      {{ isoApproval.fFinalApproval.message }}
                    </div>
                    <div style="text-align: right">
                      签名：{{ isoApproval.fFinalApproval.handler }}<br />
                      日期：{{ isoApproval.fFinalApproval.time }}
                    </div>
                  </n-space>
                </div>
              </td>
            </tr>
            <tr>
              <td>
                <n-space justify="center"> </n-space>
              </td>
            </tr>
          </tbody>
        </n-table>
      </n-form>
    </div>
  </n-card>
  <n-modal
    style="width: 90%"
    v-model:show="attachmentView"
    preset="dialog"
    title="文件预览"
  >
    <attachmentViewer :id="attachmentId" :type="attachmentType" />
  </n-modal>
</template>

<script setup>
import { ref, defineComponent, h, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import createApi from './api'
import { useMessage, useDialog } from 'naive-ui'
import moment from 'moment'
import storage from '@/utils/storage'
import baseUrl from '@/utils/baseUrl'
import attachmentViewer from '@/apps/common/attachment/attachmentViewer.vue'
import context from '@/context.js'
import sitcAttachment from '@/apps/common/attachment/SITCAttachment.vue'


const api = createApi(getCurrentInstance())
const route = useRoute()
const message = useMessage()
const dialog = useDialog()
//访问校验单
const id = route.query.fId
//发起椒盐单
const projectId = route.query.projectId
const attachmentIds = route.query.attIds
//预览附件
const attachmentView = ref(false)
const attachmentId = ref('')
const attachmentType = ref('')

//能否重新发起审批
const canRestart = ref(false)

const formRef = ref(null)

const isoApproval = reactive({
  fId: '',
  fProjectId: '',
  fProjectNo: '',
  fProjectName: '',
  fAchievementName: '',
  fModelName: '',
  fAchievementPrepared: {
    fId: '',
    fName: '',
  },
  fAchievementPreparedName: '',
  fAchievementLanguage: '',
  fAttachments: [],
  fNotes: '',
  fFirstCheck: {
    message: '',
    handler: '',
    time: '',
  },
  fReCheck: {
    message: '',
    handler: '',
    time: '',
  },
  fDeptApproval: [],
  fApproval: {
    message: '',
    handler: '',
    time: '',
  },
  fFinalApproval: {
    message: '',
    handler: '',
    time: '',
  },
  fStatus: '',
  fVersion: '',
  fCreator: {
    fId: '',
    fName: '',
  },
  fCreatorName: '',
  fCreateTime: '',
  fSubject: '',
  fNo: '',
  customerDataMap: {},
})

const isProjectManager = ref(false)

//初始化
async function init() {
  var userId = context.user()
  if (id != undefined) {
    //加载已存在单
    await api.isoApprovalLoad({ fId: id }).then(async function (res) {
      if (res.status == 200) {
        for (var key in res.data) {
          isoApproval[key] = res.data[key]
        }
        if (isoApproval.fProjectId) {
          await api.projectMainLoad({ fId: isoApproval.fProjectId })
            .then(function (res2) {
              if (res2.status == 200) {
                isProjectManager.value = (res2.data.fDeptManager.fId == userId)
              }
            })
        }
      }
    })
    canRestart.value = await hasProcessingApproval()
  }
}

function getNowTime() {
  moment().locale('zn-cn')
  return moment().format('YYYY-MM-DD HH:mm:ss')
}

//校验是否可重启iso审批
async function hasProcessingApproval() {
  //校验规则：当前项目当前类型的所有流程，没有处于正在流转状态，即可针对这版本发起重新审批
  var hasProcessing = false
  var fAchievementName = isoApproval.fAchievementName
  var query = {
    query: {
      and: [
        {"eq": {"fAchievementName": fAchievementName}},
        {
          "not": {
            "in": {
              "fStatus": ["00", "30"]
            }
          }
        },
        {"eq": {"fProjectId": isoApproval.fProjectId}}
      ]
    }
  }
  await api.isoApprovalList(query).then(function(res){
    hasProcessing = (res.data.list.length == 0)
  })
  return hasProcessing
}

init()

function restart() {
  if (hasProcessingApproval()) {
    window.open(
      baseUrl.pmUrl +
      '/view/projectManagement/implementation/project-iso-edit?restart=' +
      isoApproval.fId,
      '_blank',
    )
  } else {
    message.warning("现在已有在流转的审批单，无法发起ISO审批！")
  }
}

/**
 * 预览附件
 */
function AttachmentView(attachment) {
  attachmentId.value = attachment.fFile.fId
  attachmentType.value = attachment.fFileName.split('.').pop()
  attachmentView.value = true
}
</script>

<style></style>
