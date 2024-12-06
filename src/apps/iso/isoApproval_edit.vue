<template>
  <div v-if="!hasRole"></div>
  <n-card v-if="hasRole">
    <div style="justify-content: center; display: flex">
      <n-form
        ref="formRef"
        :model="isoApproval"
        label-placement="left"
        label-width="150px"
        style="width: 60%"
        :rules="rules"
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
                <n-form-item label="" path="fProjectNo">
                  {{ isoApproval.fProjectNo }}
                </n-form-item>
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                项目/投标名称
              </th>
              <td>
                <n-form-item label="" path="fProjectName">
                  {{ isoApproval.fProjectName }}
                </n-form-item>
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                成果产品名称
              </th>
              <td>
                <n-form-item label="" path="fSubject">
                  <n-input
                    v-model:value="isoApproval.fSubject"
                    v-if="isoApproval.fStatus == 'fFirstCheck'"
                  ></n-input>
                  <div v-else>
                    {{ isoApproval.fSubject }}
                  </div>
                </n-form-item>
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                招标文本模板
                <br />
                <n-button
                  text
                  type="primary"
                  @click="selectModelName"
                  v-if="isoApproval.fStatus == 'fFirstCheck'"
                >选择</n-button>
              </th>
              <td>
                <n-form-item label="" path="fModelName">
                  {{ isoApproval.fModelName }}
                </n-form-item>
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                产品成果编制人
              </th>
              <td>
                <n-form-item label="" path="fAchievementPrepared">
                  {{ isoApproval.fAchievementPrepared.fName }}
                </n-form-item>
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                成果使用语言
              </th>
              <td>
                <n-form-item label="" path="fAchievementLanguage">
                  <n-select
                    v-model:value="isoApproval.fAchievementLanguage"
                    :options="achievementLanguageOptions"
                    v-if="isoApproval.fStatus == 'fFirstCheck'"
                  />
                  <div v-else>
                    {{ isoApproval.fAchievementLanguage }}
                  </div>
                </n-form-item>
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                附件
              </th>
              <td>
                <n-form-item label="" path="fAttachments">
                  <sitcAttachment :linkPackage="true" :projectId="isoApproval.fProjectId"
                    :modelId="isoApproval.fId" modelName="com.qkinfotech.core.tendering.iso.model.IsoApproval" :fkey="isoApproval.fAchievementName"
                    :disabled="isoApproval.fStatus != 'fFirstCheck'" fileType=".pdf">
                  </sitcAttachment>
                </n-form-item>
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                备注
              </th>
              <td>
                <n-form-item label="" path="fNotes">
                  <n-input
                    v-if="isoApproval.fStatus == 'fFirstCheck'"
                    v-model:value="isoApproval.fNotes"
                    type="textarea"
                  ></n-input>
                  <div v-else>
                    {{ isoApproval.fNotes }}
                  </div>
                </n-form-item>
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                自检情况
              </th>
              <td>
                <n-form-item label="" path="fFirstCheck">
                  <div v-if="isoApproval.fStatus == 'fFirstCheck'">
                    <n-radio checked>{{
                        isoApproval.fAchievementPrepared.fName
                      }}</n-radio>
                  </div>
                  <div
                    v-else-if="isoApproval.fFirstCheck.message"
                    style="width: 100%"
                  >
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
                </n-form-item>
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                复检情况
              </th>
              <td>
                <n-form-item label="" path="fReCheck">
                  <div
                    style="width: 100%"
                    v-if="isoApproval.fReCheck.message != ''"
                  >
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
                  <div v-else-if="isoApproval.fEkpId == ''">
                    <n-radio-group v-model:value="reHandlerId">
                      <n-space>
                        <n-radio
                          v-for="back in reHandlerBacks"
                          :key="back.fId"
                          :value="back.fId"
                        >{{ back.fName }}</n-radio
                        >
                      </n-space>
                    </n-radio-group>
                  </div>
                </n-form-item>
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                相关部门评审意见
              </th>
              <td>
                <n-form-item label="" path="fDeptApproval">
                  <n-space
                    vertical
                    style="width: 100%"
                    v-if="isoApproval.fDeptApproval.length > 0"
                  >
                    <div style="width: 100%">
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
                    </div>
                  </n-space>
                  <div v-else-if="isoApproval.fEkpId == ''">
                    <n-checkbox-group v-model:value="deptHandlerId">
                      <n-space>
                        <n-checkbox
                          v-for="back in deptHandlerBacks"
                          :key="back.fId"
                          :value="back.fId"
                        >{{ back.fName }}</n-checkbox
                        >
                      </n-space>
                    </n-checkbox-group>
                  </div>
                </n-form-item>
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                审检情况
              </th>
              <td>
                <n-form-item label="" path="fApproval">

                  <div
                    style="width: 100%"
                    v-if="isoApproval.fApproval.message != ''"
                  >
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
                  <div v-else-if="isoApproval.fEkpId == ''">
                    <n-radio-group
                      v-model:value="approveHandlerId"
                      name="approveHandlerId"
                    >
                      <n-space>
                        <n-radio
                          v-for="item in approves"
                          :key="item.fId"
                          :label="item.fName"
                          :value="item.fId"
                          @change="updateApproveHandler(item)"
                        ></n-radio>
                      </n-space>
                    </n-radio-group>
                    <n-radio-group v-model:value="hasApproveHandle">
                      <n-space> </n-space>
                    </n-radio-group>
                  </div>
                </n-form-item>
              </td>
            </tr>
            <tr>
              <th style="width: 30%; text-align: center">
                最终检验情况
              </th>
              <td>
                <n-form-item label="" path="fFinalApproval">
                  <div
                    style="width: 100%"
                    v-if="isoApproval.fFinalApproval.message != ''"
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
                  <div v-else-if="isoApproval.fEkpId == ''">
                    <n-switch v-model:value="hasFinalApprove"></n-switch>领导审批
                  </div>
                </n-form-item>
              </td>
            </tr>
            <tr v-if="!isoApproval.fEkpId">
              <td colspan="2">
                <n-space justify="center">
                  <n-button
                    type="success"
                    v-if="isoApproval.fStatus != 'fFirstCheck'"
                    @click="handlePass"
                    :loading="submitLoading"
                    :disabled="submitDisabled"
                    >同意</n-button
                  >
                  <n-button
                    type="error"
                    v-if="isoApproval.fStatus != 'fFirstCheck'"
                    @click="refuse"
                    :loading="submitLoading"
                    :disabled="submitDisabled"
                    >拒绝</n-button
                  >
                  <n-button
                    type="success"
                    v-if="isoApproval.fStatus == 'fFirstCheck'"
                    @click="submit"
                    :loading="submitLoading"
                    :disabled="submitDisabled"
                    >提交</n-button
                  >
                  <n-button
                    type="error"
                    v-if="isoApproval.fStatus == 'fFirstCheck'"
                    @click="cancel"
                    >取消</n-button
                  >
                </n-space>
              </td>
            </tr>
          </tbody>
        </n-table>

        <div>
          <processView
            :fProcessId="isoApproval.fEkpId"
            :afterSubmit="handlePass"
            :afterRefuse="refuse"
            ref="process"
          >
          </processView>
        </div>
      </n-form>
    </div>
  </n-card>
  <n-modal
    style="width: 60%; height: 60%"
    v-model:show="selectModelNameModal"
    preset="dialog"
    title="文本模板"
    :mask-closable="false"
    :close-on-esc="false"
  >
    <n-card>
      <n-collapse>
        <n-collapse-item v-for="temp in textTemplate" :title="temp.text">
          <n-checkbox-group v-model:value="replaceModelName">
            <n-space vertical>
              <n-checkbox v-for="child in temp.children" :value="child">
                {{ child }}
              </n-checkbox>
            </n-space>
          </n-checkbox-group>
        </n-collapse-item>
        <n-collapse-item title="其他">
          <n-checkbox-group v-model:value="replaceModelName">
            <n-checkbox value="other">其他</n-checkbox>
          </n-checkbox-group>
          <n-input
            type="textarea"
            v-model:value="otherModelNameValue"
          ></n-input>
        </n-collapse-item>
      </n-collapse>
      <n-space justify="center">
        <n-button type="primary" @click="confirmModelName">确认</n-button>
      </n-space>
    </n-card>
  </n-modal>
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
import {
  ref,
  defineComponent,
  h,
  reactive,
  computed,
  getCurrentInstance,
} from 'vue'
import { useRoute, useRouter } from 'vue-router'
import createApi from './api'
import { useMessage, useDialog } from 'naive-ui'
import moment from 'moment'
import storage from '@/utils/storage'
import processUtilApi from '@/utils/processUtil'
import processView from '@/apps/common/process/processView.vue'
import noRoleCard from '@/apps/common/page/noRoleCard.vue'
import formAddress from '@/apps/common/address/formAddress.vue'
import baseUrl from '@/utils/baseUrl'
import attachmentViewer from '@/apps/common/attachment/attachmentViewer.vue'
import interfaceUtilApi from '@/utils/interfaceUtil'
import context from '@/context.js'
import sitcAttachment from '@/apps/common/attachment/SITCAttachment.vue'


const currentInstance = getCurrentInstance()
const api = createApi(currentInstance)
const processUtil = processUtilApi(currentInstance)
const interfaceUtil = interfaceUtilApi(currentInstance)
const route = useRoute()
const message = useMessage()
const dialog = useDialog()
//访问校验单
const id = route.query.fId
//发起校验单
const projectId = route.query.projectId
const attachmentIds = route.query.attIds
//重新发起
const restartId = route.query.restart
//是否是审批人
const isHandler = ref(false)
//是否有权限访问
const hasRole = ref(true)
//语言
const achievementLanguageOptions = [
  {
    label: '仅中文',
    value: '仅中文',
  },
  {
    label: '中英文',
    value: '中英文',
  },
]
//预览附件
const attachmentView = ref(false)
const attachmentId = ref('')
const attachmentType = ref('')

//表单
const formRef = ref(null)
//规则：新建时复检和部门审批必填审批人
const haveAttachment = ref(false)
const rules = {
  fReCheck: [
    {
      validator(rule, value) {
        if (reHandlerId.value == '') {
          return new Error('请选择复检人员')
        }
        return true
      },
    },
  ],
  /*fDeptApproval: [
    {
      validator(rule, value) {
        if (deptHandlerId.value.length == 0) {
          return new Error('请选择审批部门')
        }
        return true
      },
    },
  ],*/
  fModelName: {
    required: true,
    message: '请选择文本模板',
  },
  fSubject: {
    required: true,
    message: '请输入产品成果名称',
  },
  fApproval: {
    message: '请选择审检人员',
    validator(rulw, value) {
      if (approveHandlerId.value == '') {
        return false
      }
      return true
    },
  },
  fAttachments: {
    message: '请上传需要审批的附件',
    validator(rule, value) {
      return haveAttachment.value
    }
  }
}

const process = ref(null)
const { proxy } = getCurrentInstance()

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
  fAchievementLanguage: '仅中文',
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
  fEkpId: '',
  customerDataMap: {},
  fHandlers: [],
})

const curUser = {
  fId: '',
  fName: '',
  fCode: '',
}

const reHandlerId = ref('') //复检选择人
const reHandlerBacks = ref([]) //复检待选
const deptHandlerId = ref([]) //部门选择
const deptHandlerBacks = ref([]) //部门待选
const hasApproveHandle = ref(true) //审检
const approveHandlerId = ref('') //审检人id
const approveHandlerName = ref('') //审检人name
const approves = ref([]) //审检可选人员
const hasFinalApprove = ref(false) //是否终审

//初始化
async function init() {
  var userId = context.user()
  await api.orgPersonLoad({ fId: userId }).then(function (res) {
    if (res.status == 200) {
      curUser.fId = res.data.fId
      curUser.fName = res.data.fName
      curUser.fCode = res.data.fCode
      curUser.fDeptName = res.data.fParent.fName
      curUser.fDeptId = res.data.fParent.fId
    }
  })
  if (id != undefined) {
    //2024-0930 iso加载优化：先确认是否可在edit页面访问或是否有访问权限，再从后台加载表单数据
    await api.getIsoEkpId({fId: id}).then(async function(res){
      if (res.status == 200 && res.data.fEkpId) {
        await processUtil.isHandler(res.data.fEkpId).then(async function(handlerRes){
          isHandler.value = handlerRes
          if (handlerRes == false && context.user() != res.fCreatorId && storage.get("auths").indexOf("AUTH_ADMIN") < 0) {
            await api.isoApprovalHandlerList({
              query : {
                and : [
                  {eq: {"fMain.fId" : id}},
                  {eq: {"fStatus": "1"}},
                  {eq: {"fHandlerId": context.user()}}
                ]
              }
            }).then(async function(historyRes){
              if (historyRes.status == 200 && historyRes.data.list.length > 0) {
                window.open(baseUrl.pmUrl +'/view/projectManagement/implementation/project-iso-view?fId=' + id,'_self')
              } else {
                hasRole.value = false
              }
            })
          } else {
            await api.isoApprovalLoad({fId : id}).then(async function(isoRes){
              if (isoRes.status == 200) {
                try {
                  // 2024-09-30 优化，用户有权限才加载表单数据
                  for (var key in isoRes.data) {
                    isoApproval[key] = isoRes.data[key]
                  }
                } catch (e) {
                }
              }
            })
          }
        })
      }
    })
  } else if (projectId != undefined) {
    //发起流程
    //初始化检验单id
    console.log(isoApproval.fAchievementName)
    await api.isoApprovalInit().then(function (res) {
      if (res.status == 200) {
        isoApproval.fId = res.data.fId
      }
    })
    //初始化项目字段
    await loadHandlerBak(projectId)

    //初始化附件字段
    /*var query = {
      in: {
        fId: attachmentIds.split(','),
      },
    }
    var param = {
      query: query,
    }
    api.attachmentMainList(param).then(function (res) {
      if (res.status == 200) {
        isoApproval.fAttachments.length = 0
        for (var i = 0; i < res.data.list.length; i++) {
          var temp = res.data.list[i]
          var attachment = {
            fId: temp.fId,
            fFile: {
              fId: temp.fFile.fId,
              fFileName: temp.fFile.fFileName,
            },
            fFileName: temp.fFileName,
            fPackages: [],
          }
          for (var j = 0; j < temp.fPackages.length; j++) {
            attachment.fPackages.push({
              fId: temp.fPackages[j].fId,
              fPackageId: {
                fName: temp.fPackages[j].fPackageId.fName,
                fIndex: temp.fPackages[j].fPackageId.fIndex,
              },
            })
          }
          isoApproval.fAttachments.push(attachment)
        }
      }
    })*/
    //初始化其他字段信息
    isoApproval.fCreateTime = getNowTime()
    isoApproval.fFirstCheck.time = getNowTime()
    isoApproval.fAchievementName = route.query.name
    isoApproval.fSubject = route.query.name
    isoApproval.fStatus = 'fFirstCheck'
    isoApproval.fCreator.fId = curUser.fId
    isoApproval.fCreator.fName = curUser.fName
    isoApproval.fCreatorName = curUser.fName
    isoApproval.fFirstCheck.handler = curUser.fName
    isoApproval.fAchievementPrepared.fId = curUser.fId
    isoApproval.fAchievementPrepared.fName = curUser.fName
    isoApproval.fAchievementPreparedName = curUser.fName
    isoApproval.fVersion = await loadNewVersionNo(isoApproval.fAchievementName)
  } else if (restartId != undefined) {
    //重新审批，生成新单
    await api.isoApprovalLoad({ fId: restartId }).then(async function (res) {
      if (res.status == 200) {
        for (var key in res.data) {
          isoApproval[key] = res.data[key]
        }

        //更新字段
        //创建人，时间，状态值
        isoApproval.fCreateTime = getNowTime()
        isoApproval.fFirstCheck.time = getNowTime()
        isoApproval.fStatus = 'fFirstCheck'
        isoApproval.fCreator.fId = curUser.fId
        isoApproval.fCreator.fName = curUser.fName
        isoApproval.fCreatorName = curUser.fName
        isoApproval.fFirstCheck.handler = curUser.fName
        isoApproval.fAchievementPrepared.fId = curUser.fId
        isoApproval.fAchievementPrepared.fName = curUser.fName
        isoApproval.fAchievementPreparedName = curUser.fName
        //版本号
        isoApproval.fVersion = await loadNewVersionNo(isoApproval.fAchievementName)
        //清空编号，ekpid，各个审批意见
        isoApproval.fNo = ''
        isoApproval.fEkpId = ''
        isoApproval.fFinishTime = ''
        isoApproval.fFirstCheck = {
          message: '',
          handler: '',
          time: '',
        }
        isoApproval.fReCheck = {
          message: '',
          handler: '',
          time: '',
        }
        isoApproval.fDeptApproval = []
        isoApproval.fApproval = {
          message: '',
          handler: '',
          time: '',
        }
        isoApproval.fFinalApproval = {
          message: '',
          handler: '',
          time: '',
        }

        //fId
        api.isoApprovalInit().then(async function (res) {
          if (res.status == 200) {
            // 复制附件给新fId文档，之后在放fId，保证新文档附件来自于旧文档，但是变动不影响旧文档的附件
            await api.isoCopyAttachment({
              oldFid: isoApproval.fId,
              newFid: res.data.fId,
              key: isoApproval.fAchievementName
            })
            isoApproval.fId = res.data.fId
          }
        })

        //初始化项目审批人
        await loadHandlerBak(isoApproval.fProjectId)
      }
    })
  }
}

function getNowTime() {
  moment().locale('zn-cn')
  return moment().format('YYYY-MM-DD HH:mm:ss')
}

//提交操作
const submitLoading = ref(false)
const submitDisabled = ref(false)

//提交
async function submit() {
  if (!await hasProcessingApproval()) {
    message.warning("已有在流转的审批单，无法发起ISO审批！")
    return
  }
  var query = {
    query : {
      and : [
        {"eq": {"fModelId": isoApproval.fId}},
        {"eq": {"fModelName": "com.qkinfotech.core.tendering.iso.model.IsoApproval"}},
        {"eq": {"fKey": isoApproval.fAchievementName}},
      ]
    }
  }
  var res = await api.attachmentMainList(query)
  haveAttachment.value = (res.data.list.length != 0)

  //触发校验
  formRef.value?.validate(async (error) => {
    if (!error) {
      if (isoApproval.fFirstCheck.message == '') {
        isoApproval.fFirstCheck.message = '同意'
      }
      isoApproval.fFirstCheck.handler = curUser.fName
      isoApproval.fFirstCheck.time = getNowTime()

      submitLoading.value = true
      submitDisabled.value = true

      //推送ekp流程表单报文
      var valueForm = {
        creatorId: isoApproval.fCreator.fId,
        formValues: {
          fd_version: isoApproval.fVersion,
          fd_retest: {
            Id: reHandlerId.value,
          },
          fd_pm_id: isoApproval.fId,
        },
        docSubject: isoApproval.fProjectName + isoApproval.fSubject,
        fdTemplateId: '190e850e137bfbd77b15388405bbd137',
        fdTemplateKey: 'ekpIsoApprovalTemplateId',
      }
      var formDepts = []
      await api
        .orgDeptManagerList({
          query: {
            and: [
              {
                in: {
                  fDeptId: deptHandlerId.value,
                },
              },
              {
                eq: {
                  fRoleKey: '1',
                },
              },
            ],
          },
        })
        .then(async function (res) {
          for (var i = 0; i < res.data.list.length; i++) {
            var val = {
              Id: res.data.list[i].fDeptManagerId,
            }
            await api
              .orgPersonLoad({ fId: res.data.list[i].fDeptManagerId })
              .then(function (res2) {
                val['name'] = res2.data.fParent.fName + ' ' + res2.data.fName
              })
            formDepts.push(val)
          }
        })
      valueForm.formValues['fd_relevant_departments'] = formDepts
      if (hasApproveHandle.value)
        valueForm.formValues['fd_audit'] = {
          Id: approveHandlerId.value,
        }
      if (hasFinalApprove.value)
        valueForm.formValues['fd_ultimately'] = {
          Id: '170ae6ff5c7108a6615c7f1420498d71',
        }
      //本地保存表单信息
      var submitForm = {}
      for (var key in isoApproval) {
        submitForm[key] = isoApproval[key]
      }
      submitForm.fStatus = 'fReCheck' //流程进入下一步骤
      //审批人信息
      var handlerList = []
      handlerList.push({
        fMain: {
          fId: isoApproval.fId,
        },
        fHandlerId: reHandlerId.value,
        fHandlerTarget: {
          fId: reHandlerId.value
        },
        fStatus: '0',
        fNode: 'fReCheck',
      })
      //复检
      isoApproval.fReCheck.message = '待复检（'
      for (var i = 0; i < reHandlerBacks.value.length; i++) {
        if (reHandlerBacks.value[i].fId == reHandlerId.value) {
          isoApproval.fReCheck.message += reHandlerBacks.value[i].fName
        }
      }
      isoApproval.fReCheck.message += '）'
      //相关部门
      if (formDepts.length > 0) {
        var deptMessage = {
          message: '待相关部门评审（',
          handler: '',
          time: '',
        }
        for (var i = 0; i < formDepts.length; i++) {
          handlerList.push({
            fMain: {
              fId: isoApproval.fId,
            },
            fHandlerId: formDepts[i].Id,
            fHandlerTarget: {
              fId: formDepts[i].Id
            },
            fStatus: '0',
            fNode: 'fDeptApproval',
          })
          deptMessage.message += formDepts[i].name + ','
          formDepts[i].name = undefined
        }
        /* for (var i=0; i<deptHandlerId.value.length; i++) {
          for (var j=0; j<deptHandlerBacks.value.length; j++) {
            if (deptHandlerBacks.value[j].fId == deptHandlerId.value[i]) {
              deptMessage.message += deptHandlerBacks.value[j].fName + ","
            }
          }
        } */
        deptMessage.message += '）'
        isoApproval.fDeptApproval.push(deptMessage)
      } else {
        var deptMessage = {
          message: '',
          handler: '',
          time: '',
        }
        isoApproval.fDeptApproval.push(deptMessage)
      }
      //审检
      if (hasApproveHandle.value) {
        handlerList.push({
          fMain: {
            fId: isoApproval.fId,
          },
          fHandlerId: approveHandlerId.value,
          fHandlerTarget: {
            fId: approveHandlerId.value
          },
          fStatus: '0',
          fNode: 'fApproval',
        })
        isoApproval.fApproval.message =
          '待部门评审（' + approveHandlerName.value + '）'
      }
      //终检
      if (hasFinalApprove.value) {
        handlerList.push({
          fMain: {
            fId: isoApproval.fId,
          },
          fHandlerId: '170ae6ff5c7108a6615c7f1420498d71',
          fHandlerTarget: {
            fId: '170ae6ff5c7108a6615c7f1420498d71'
          },
          fStatus: '0',
          fNode: 'fFinalApproval',
        })
        isoApproval.fFinalApproval.message = '待最终检验（杨浩）'
      }
      submitForm.fHandlers = handlerList

      //推送ekp流程
      api.webAddReview(valueForm).then(function (res) {
        if (res.result.success) {
          submitForm.fEkpId = res.result.message
          api
            .webGetReviewNo({ reviewId: res.result.message })
            .then(function (res2) {
              if (res2) {
                submitForm.fNo = res2
                //本地保存单
                api
                  .isoApprovalSave(submitForm)
                  .then(function (res) {
                    submitLoading.value = false
                    message.success('提交成功', {
                      duration: 0,
                      closable: true,
                    })
                    window.open(baseUrl.pmUrl + '/view/actionSuccess', '_self')
                  })
                  .catch(function (error) {
                    submitLoading.value = false
                    submitDisabled.value = false
                    message.error('提交失败！请重试', {
                      duration: 0,
                    })
                  })
              }
            })
        } else {
          submitLoading.value = false
          submitDisabled.value = false
          message.error('提交失败！请重试', {
            duration: 0,
          })
        }
      })
    }
  })
}

//关闭
function cancel() {
  window.close()
}

/*const statusNext = {
  fFirstCheck: 'fReCheck',
  fReCheck: 'fDeptApproval',
  fDeptApproval: 'fApproval',
  fApproval: 'fFinalApproval',
  fFinalApproval: '30',
}*/
const statusOrder = {
  "fFirstCheck": 1,
  "fReCheck": 2,
  "fDeptApproval": 3,
  "fApproval": 4,
  "fFinalApproval": 5,
  "30": 6
}

//通过审批
async function handlePass(info) {
  try {
    submitLoading.value = true
    submitDisabled.value = true
    message.info('提交中，请稍后')

    //记录提交意见
    // 判断逻辑优化：1.先将对应的fHandlers记录置为1；2.遍历fHandlers记录，判断接下来的fStatus应该是啥；
    var allFin = true
    var nextStatus = "30"
    var curStatusOrder = 6
    for (var i = 0; i < isoApproval.fHandlers.length; i++) {
      var temp = isoApproval.fHandlers[i]
      if (temp.fHandlerId == curUser.fId && temp.fNode == isoApproval.fStatus) {
        if (temp.fNode == 'fDeptApproval') {
          if (
            isoApproval[temp.fNode].length == 1 &&
            isoApproval[temp.fNode][0].handler == ''
          ) {
            isoApproval[temp.fNode].length = 0
            // isoApproval.fStatus = statusNext[isoApproval.fStatus]
          }
          isoApproval[temp.fNode].push({
            message: info == '' ? '同意' : info,
            handler: curUser.fName,
            time: getNowTime(),
          })
        } else {
          isoApproval[temp.fNode].message = info == '' ? '同意' : info
          isoApproval[temp.fNode].handler = curUser.fName
          isoApproval[temp.fNode].time = getNowTime()
          // isoApproval.fStatus = statusNext[isoApproval.fStatus]
        }
        isoApproval.fHandlers[i].fStatus = '1'
        temp.fStatus = '1'
        temp.fMain = {
          fId: isoApproval.fId,
        }
        await api.isoApprovalHandlerSave(temp)
      }
      if (temp.fStatus == '0') {
        allFin = false
        if (statusOrder[temp.fNode] < curStatusOrder) {
          nextStatus = temp.fNode
          curStatusOrder = statusOrder[temp.fNode]
        }
      }
    }
    isoApproval.fStatus = nextStatus
    if (allFin) {
      //包件，包件附件的f_iso_approval转为1
      await api.attachmentControllerFinishIsoApproval({
        id: isoApproval.fId,
      })

      //推送项目详情到内网，更新languageUse字段信息
      var projectId = isoApproval.fProjectId
      if (projectId) {
        await api
          .projectNoApplicationaProjectView(projectId)
          .then(async function (result) {
            const data = result.data
            if (!data.fAchievementLanguage) {
              if (isoApproval.fAchievementLanguage == '仅中文') {
                data.fAchievementLanguage = '1'
              } else {
                data.fAchievementLanguage = '3'
              }
            } else if (data.fAchievementLanguage == '1') {
              if (isoApproval.fAchievementLanguage != '仅中文') {
                data.fAchievementLanguage == '2'
              }
            } else if (data.fAchievementLanguage == '3') {
              if (isoApproval.fAchievementLanguage == '仅中文') {
                data.fAchievementLanguage == '2'
              }
            }

            const res = await interfaceUtil.projectMainCheck(
              'edit',
              false,
              data,
            )
            if (res.STATUS == 'E') {
              throw res.MESSAGE
            }
          })
      }
    }

    //提交表单
    var submitForm = {}
    for (var key in isoApproval) {
      if (key == 'fHandlers' || key == 'fAttachments') {
        continue
      }
      submitForm[key] = isoApproval[key]
    }
    if (submitForm.fStatus == '30') {
      submitForm.fFinishTime = getNowTime()
    }

    //ekp通过审批
    /* axios.get( "/pm/web/approveProcessNode?handler=" + curUser.fCode + "&ApplicationNo=" + isoApproval
          .fNo)
        .then(function(res) { */

    //保存单
    var saveRes
    await api
      .isoApprovalSave(submitForm)
      .then(function (res) {
        submitLoading.value = false
        message.success('提交成功', {
          duration: 0,
          closable: true,
        })
        saveRes = true
      })
      .catch(function (error) {
        console.log(error)
        submitLoading.value = false
        submitDisabled.value = false
        message.error('提交失败！请重试', {
          duration: 0,
        })
        saveRes = false
      })
    return saveRes
  } catch (e) {
    console.log(e)
    return false
  }
}

//拒绝，返回起草人
async function refuse(info) {
  submitLoading.value = true
  submitDisabled.value = true
  isoApproval[isoApproval.fStatus].message = info
  if (isoApproval[isoApproval.fStatus].message == '') {
    message.error('请输入拒绝理由！')
    submitLoading.value = false
    submitDisabled.value = false
    return
  }
  isoApproval[isoApproval.fStatus].handler = curUser.fName
  isoApproval[isoApproval.fStatus].time = getNowTime()

  var submitForm = {}
  for (var key in isoApproval) {
    if (key == 'fHandlers' || key == 'fAttachments') {
      continue
    }
    submitForm[key] = isoApproval[key]
  }
  submitForm.fStatus = '00'
  var refuseRes
  await api
    .isoApprovalSave(submitForm)
    .then(function (res) {
      submitLoading.value = false
      if (res.status == 200) {
        refuseRes = true
        message.success('提交成功', {
          duration: 0,
          closable: true,
        })
      } else {
        refuseRes = false
        submitLoading.value = false
        submitDisabled.value = false
        message.error('提交失败！请重试', {
          duration: 0,
        })
      }
    })
    .catch(function (error) {
      refuseRes = false
      submitLoading.value = false
      submitDisabled.value = false
      message.error('提交失败！请重试', {
        duration: 0,
      })
    })
  return refuseRes
}

//删除审批附件
function delAttachment(attachment) {
  if (isoApproval.fAttachments.length == 1) {
    message.warning('至少需要审核一个附件！')
  } else {
    var id = attachment.fId
    for (var i = 0; i < isoApproval.fAttachments.length; i++) {
      if (isoApproval.fAttachments[i].fId == id) {
        isoApproval.fAttachments.splice(i, 1)
      }
    }
  }
}

//选择文本模板
const selectModelNameModal = ref(false)
const textTemplate = ref([])
const replaceModelName = ref([])
const otherModelNameValue = ref('')

function selectModelName() {
  selectModelNameModal.value = true
  textTemplate.value.length = 0
  replaceModelName.value.length = 0
  otherModelNameValue.value = ''
  var query = {
    eq: {
      fKey: 'IsoApproval',
    },
  }
  api
    .masterTextTemplateList({
      query: query,
    })
    .then(function (res) {
      if (res.status == 200) {
        textTemplate.value = res.data.list[0].fContent
      }
    })
}

function confirmModelName() {
  var returnModelName = ''
  for (var i = 0; i < replaceModelName.value.length; i++) {
    if (replaceModelName.value[i] == 'other') {
      returnModelName += otherModelNameValue.value + '；'
    } else {
      returnModelName += replaceModelName.value[i] + '；'
    }
  }
  isoApproval.fModelName = returnModelName
  selectModelNameModal.value = false
}

/**
 * 预览附件
 */
function AttachmentView(attachment) {
  attachmentId.value = attachment.fFile.fId
  attachmentType.value = attachment.fFileName.split('.').pop()
  attachmentView.value = true
}

function updateApproveHandler(item) {
  approveHandlerId.value = item.fId
  approveHandlerName.value = item.fName
}

/**
 * 获取流程预选审批人
 */
async function loadHandlerBak(projectId) {
  var projectMain = {}
  await api.projectMainLoad({fId: projectId}).then(function(res){
    isoApproval.fProjectId = res.data.fId
    isoApproval.fProjectNo = res.data.fProtocolNo
    isoApproval.fProjectName = res.data.fName
    projectMain = res.data
  })
  //1.审检：部门经理->部门副经理->专员；从高到低获取第一个非当前人
  var query = {
    query: {
      eq: {
        "fDeptId": projectMain.fDept.fId
      }
    },
    sort: ["fRoleKey asc"]
  }
  await api.orgDeptManagerList(query).then(async function(res){
    if (res.status == 200 && res.data.list.length > 0){
      for (var i=0; i<res.data.list.length; i++) {
        var temp = res.data.list[i]
        if (temp.fDeptManagerId != curUser.fId) {
          approves.value.length = 0
          approveHandlerId.value = temp.fDeptManagerId
          await api.orgPersonLoad({
            fId: temp.fDeptManagerId
          }).then(function(res2){
            approveHandlerName.value = res2.data.fName
            approves.value.push(res2.data)
          })
          break
        }
      }
    }
  })

  //2.复检：项目组成员中，除去组长，自己，审检人；无剩余人员则获取全部项目部门成员
  reHandlerBacks.value.length = 0
  query = {
    query: {
      eq: {
        "fMainId.fId": projectId
      }
    }
  }
  await api.projectMembersList(query).then(function(res){
    var list = res.data.list
    for (var i=0; i<list.length; i++) {
      var temp = list[i]
      if (temp.fPersonId.fId != curUser.fId && temp.fPersonId.fId != approveHandlerId.value) {
        reHandlerBacks.value.push(temp.fPersonId)
      }
    }
  })
  if (reHandlerBacks.value.length == 0) {
    query = {
      query: {
        eq: {
          "fParent.fId": projectMain.fDept.fId
        }
      }
    }
    await api.orgPersonList(query).then(function(res){
      var list = res.data.list
      for (var j = 0; j < list.length; j++) {
        var temp = list[j]
        if (temp.fId != curUser.fId && temp.fId != approveHandlerId.value) {
          reHandlerBacks.value.push(temp)
        }
      }
    })
  }

  //3.相关部门：除去项目部门、发起人部门、信息管理部，财务管理部，行政管理部,经理室
  query = {
    query: [
      {eq: {"fParent.fId": "170ae6ff4ee87c85c90e0b04b05bbe0b"}},
      {
        not: {
          in: {
            "fName": ["经理室", "信息管理部", "财务管理部", "行政管理部", projectMain.fDept.fName, curUser.fDeptName]
          }
        }
      }
    ]
  }
  await api.orgDeptList(query).then(function(res){
    if (res.status == 200) {
      deptHandlerBacks.value.length = 0
      for (var i = 0; i < res.data.list.length; i++) {
        deptHandlerBacks.value.push(res.data.list[i])
      }
    }
  })
}

async function loadNewVersionNo(fAchievementName) {
  var query = {
    query: {
      and :[
        {eq: {"fAchievementName": fAchievementName}},
        {eq: {"fProjectId": isoApproval.fProjectId}}
      ]
    }
  }
  var nextVersion = 1
  await api.isoApprovalList(query).then(function(res){
    if (res.status == 200) {
      nextVersion = res.data.total
    }
  })
  return nextVersion
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
</script>

<style></style>
