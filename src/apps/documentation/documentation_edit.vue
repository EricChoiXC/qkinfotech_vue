<template>
  <div :disabled="!props.open">
    <n-grid :cols="2">
      <n-gi :span="2">
        <p style="font-size: 16px; font-weight: bold">归档信息</p>
      </n-gi>
      <n-gi :span="2">
        <p style="font-size: 16px; font-weight: bold">履约奖信息</p>
      </n-gi>
      <n-gi :span="2">
        <n-table :single-line="false">
          <tbody>
            <tr>
              <td style="width: 20%" class="tdcenter">项目类别</td>
              <td style="width: 30%" class="tdleft">{{ form.projectType }}</td>
              <td style="width: 20%" class="tdcenter">中标金额</td>
              <td style="width: 30%" class="tdleft">
                {{ form.bidCount }}
              </td>
            </tr>
            <tr>
              <td class="tdcenter">包件信息</td>
              <td class="tdleft">
                <span v-for="pack in form.packages">{{ pack.name }}；</span>
              </td>
              <td class="tdcenter">投标人数量</td>
              <td class="tdleft">
                <n-input placeholder="" :value="form.fTenderNum" disabled></n-input>
              </td>
            </tr>
            <tr>
              <td class="tdcenter">项目重要性</td>
              <td class="tdleft">
                <n-input placeholder="" :value="form.projectImportance" disabled></n-input>
              </td>
              <td class="tdcenter">公司电子采购平台、进场招标</td>
              <td class="tdleft">
                <!--                  <n-radio-group :value="form.fIsCompanyProcurement" :disabled="!editLvYue">
                    <n-space>
                      <n-radio :key="true" :value="true">是</n-radio>
                      <n-radio :key="false" :value="false">否</n-radio>
                    </n-space>
                  </n-radio-group>-->
                <n-input placeholder="" :value="form.fIsCompanyProcurement" disabled></n-input>
              </td>
            </tr>
            <tr>
              <td class="tdcenter">使用语言</td>
              <td class="tdleft">
                <!--                  <n-select :value="form.fLanguage" :options="languages" :disabled="!editLvYue"></n-select>-->
                <n-input placeholder="" :value="form.fLanguage" disabled></n-input>
              </td>
              <td class="tdcenter">有无资格预审</td>
              <td class="tdleft">
                <!--                  <n-select :value="form.hasPre" :options="TorF" :disabled="!editLvYue"></n-select>-->
                <n-input placeholder="" :value="form.hasPre" disabled></n-input>
              </td>
              <!--              <td class="tdcenter">翻译成果校对</td>
              <td class="tdleft">
                <n-form-item label="">
                  <n-input  placeholder="" :value="form.fTranslateResult" disabled></n-input>
              </td>-->
            </tr>
            <tr>
              <td class="tdcenter">履约奖</td>
              <td class="tdleft">
                <n-input placeholder="" :value="form.fPerpormancePrice" disabled></n-input>
              </td>
              <td class="tdcenter">履约发奖日期</td>
              <td class="tdleft">
                <n-input placeholder="" value-format="yyyy-MM-dd" :value="form.fPerpormanceTime"
                  :disabled="!editLvYue"></n-input>
              </td>
            </tr>
            <tr>
              <td class="tdcenter">开拓奖</td>
              <td class="tdleft">
                <n-input placeholder="" :value="form.fDevelopPrice" disabled></n-input>
              </td>
              <td class="tdcenter">开拓发奖日期</td>
              <td class="tdleft">
                <n-input placeholder="" value-format="yyyy-MM-dd" :value="form.fDevelopTime"
                  :disabled="!editLvYue"></n-input>
              </td>
            </tr>
          </tbody>
        </n-table>
      </n-gi>
      <n-gi :span="2">
        <p style="font-size: 16px; font-weight: bold">归档履约信息</p>
      </n-gi>
      <n-gi :span="2">
        <n-table :single-line="false">
          <tbody>
            <tr>
              <td style="width: 20%" class="tdcenter">项目登记日期</td>
              <td style="width: 30%" class="tdleft">
                <n-input placeholder="" value-format="yyyy-MM-dd HH:mm:ss" type="datetime"
                  :value="form.fProjectRegisterTime" disabled></n-input>
              </td>
              <td style="width: 20%" class="tdcenter">基本结束日期</td>
              <td style="width: 30%" class="tdleft">
                <n-space>
                  <n-input placeholder="" style="width: 300px" :value="form.fBaseFinishTime" disabled></n-input>
                  周期{{ form.circleTime }}天
                  <n-button text type="info" v-show="showFinishApply()" @click="finishApply">项目终止申请</n-button>
                  <n-button text type="info" v-show="showValidateBaseFinishTime()"
                    @click="validateBaseFinishTime">填写基本结束日期</n-button>
                </n-space>
              </td>
            </tr>
            <tr>
              <td class="tdcenter">实际代理费</td>
              <td class="tdleft" colspan="3">
                <n-space vertical style="width: 100%">
                  <n-input placeholder="" :value="form.fAgencyFee" disabled></n-input>
                  <n-button text type="info" @click="balanceInfoEdit" :disabled="!props.open"
                    v-show="showBalanceInfoEdit">结算信息修改</n-button>
                </n-space>
              </td>
            </tr>
            <tr>
              <td class="tdcenter">限制结束日期</td>
              <td class="tdleft">
                <n-space>
                  <n-input placeholder="" style="width: 300px" :value="form.fLimitFinishTime"
                    :disabled="!editGuiDang"></n-input>
                  <span>(申请延期{{ form.delayCount }}次)</span>
                  <n-button text type="info" v-show="showApplyDelay()" @click="applyDelay">申请延期</n-button>
                </n-space>
              </td>
              <td class="tdcenter">达标日期</td>
              <td class="tdleft">
                <n-space>
                  <n-input placeholder="" v-model:value="form.fQuelifyTime" :disabled="!editGuiDang" />
                  <!-- <n-button text type="info" v-show="showQualifyCheck()" @click="qualifyCheck">达标检查</n-button> -->
                </n-space>
              </td>
            </tr>
            <tr>
              <!-- <td class="tdcenter">归档截图</td>
              <td class="tdleft">
                <n-button text type="info" @click="handlePreview" :disabled="!previewDocumentState">查看</n-button>
              </td> -->
              <td class="tdcenter">归档申请</td>
              <td class="tdleft" colspan="3">
                <n-space>
                  {{ form.fDocumentationNo }}
                  <n-button text type="info" @click="showRecords">方案征集项目电子归档</n-button>
                  <!--   <n-button
                    text
                    type="info"
                    :disabled="!documentState"
                    v-show="showDocumentation()"
                    @click="handleApplyFile"
                    >申请</n-button
                  >
                  <n-button
                    text
                    type="info"
                    v-show="showCancelDocumentation()"
                    @click="cancelApplyFile"
                    >取消申请</n-button
                  >
                  <n-button
                    text
                    type="info"
                    v-show="showConfirmDocumentation()"
                    @click="confirmDocumentation"
                    >确认归档</n-button
                  > -->
                  <n-button text type="info" v-show="showEditImportanceFile()"
                    @click="editImportanceFile">公司重点项目资料</n-button>
                </n-space>
              </td>
            </tr>
            <tr>
              <td class="tdcenter">协议归档编号</td>
              <td class="tdleft">
                {{ form.fProtocolDocumentationNo }}（<n-button text type="info"
                  @click="uploadAgreementDocumentation">协议信息</n-button>）
              </td>
              <td class="tdcenter">协议归档日期</td>
              <td class="tdleft">
                <n-input placeholder="" value-format="yyyy-MM-dd" v-model:value="form.fProtocolDocumentationTime"
                  clearable :disabled="!editGuiDang" />
              </td>
            </tr>
            <tr>
              <td class="tdcenter">履约评价表编号</td>
              <td class="tdleft">
                {{ form.fEvaluationNo }}（<n-button text type="info" @click="uploadPerformanceEvaluate">履约信息</n-button>）
              </td>
              <td class="tdcenter">履约上交日期</td>
              <td class="tdleft">
                <n-input placeholder="" value-format="yyyy-MM-dd" v-model:value="form.fEvaluationTime" clearable
                  :disabled="!editGuiDang" />
              </td>
            </tr>
            <tr>
              <td class="tdcenter">归档编号</td>
              <td class="tdleft">
                <n-input placeholder="" :value="form.fDocumentationNo" :disabled="!editGuiDang"></n-input>
              </td>
              <td class="tdcenter">归档日期</td>
              <td class="tdleft">
                <n-input placeholder="" value-format="yyyy-MM-dd" v-model:value="form.fDocumentationTime" clearable
                  :disabled="!editGuiDang" />
              </td>
            </tr>
            <tr>
              <td class="tdcenter">财务结算日期</td>
              <td class="tdleft">
                <n-space>
                  <n-input placeholder="" v-model:value="form.fFinanceBalanceTime" :disabled="!editGuiDang" />
                </n-space>
              </td>
              <td class="tdcenter">费用结算日期</td>
              <td class="tdleft">
                <n-input placeholder="" v-model:value="form.fFeeBalanceTime" :disabled="!editGuiDang" />
                <n-button text type="info" v-show="showBalanceDetailView()" @click="balanceDetailView">项目费用统计</n-button>
              </td>
            </tr>
          </tbody>
        </n-table>
        <n-modal v-model:show="previewDoc.viewAttachment" style="width: 85%; height: 85%" preset="dialog"
          :mask-closable="false">
          <attachmentViewer :id="previewDoc.attachmentId" :type="previewDoc.attachmentType"></attachmentViewer>
        </n-modal>
        <n-modal v-model:show="createElectronDocumentLoading" :mask-closable="false" :close-on-esc="false">
          <n-card style="width: 30%" title="生成归档截图中，请勿关闭本页面">
            <n-progress type="line" :percentage="createElectronDocumentPercent">
            </n-progress>
            <span>{{ createElectronDocumentMessage }}</span>
          </n-card>
        </n-modal>
      </n-gi>
    </n-grid>
  </div>

  <n-modal v-model:show="recordsModal" style="width: 70%" preset="dialog" title="方案征集项目电子归档" :mask-closable="false">
    <n-table :single-line="false">
      <tbody>
        <tr>
          <th colspan="2" style="text-align:center;font-size:larger;font-weight: bold;">
            电子归档上传
          </th>
        </tr>
        <tr>
          <td style="text-align:center;width:30%">项目编号</td>
          <td>{{props.data.fProtocolNo}}</td>
        </tr>
        <tr>
          <td style="text-align:center">项目名称</td>
          <td>{{props.data.fName}}</td>
        </tr>
        <tr>
          <td style="text-align:center">项目经理</td>
          <td>{{props.data.fDeptManager.fName}}</td>
        </tr>
        <tr>
          <th colspan="2" style="text-align:center;font-size:larger;font-weight: bold;">
            方案征集项目电子归档
          </th>
        </tr>
        <tr>
          <td style="text-align:center">项目文件归档说明表</td>
          <td>
            <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain"
              :modelId="props.data.fId" fkey="documentDescribe" :disabled="true" />
            <n-alert title="" type="info" closable>
              备注：系统自动生成
            </n-alert>
          </td>
        </tr>
        <tr>
          <td style="text-align:center">项目信息表</td>
          <td>
            <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain"
              :modelId="props.data.fId" fkey="electronDocument" :disabled="true" />
            <n-alert title="" type="info" closable>
              备注：系统自动生成
            </n-alert>
          </td>
        </tr>
        <tr>
          <td style="text-align:center">代理协议*</td>
          <td>
            <n-button text type="info" @click="viewAgreement">协议查看</n-button>
            <n-alert title="" type="info" closable>
              备注：开拓人负责在协议页面上传，项目经理无需重复上传
            </n-alert>
          </td>
        </tr>
        <tr>
          <td style="text-align:center">项目前期资料</td>
          <td>
            <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain"
              :modelId="props.data.fId" fkey="earlyInfomation" :disabled="filesDisabled" />
          </td>
        </tr>
        <tr>
          <td style="text-align:center">工作计划</td>
          <td>
            <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain"
              :modelId="props.data.fId" fkey="workPlan" :disabled="filesDisabled" />
          </td>
        </tr>
        <tr>
          <td style="text-align:center">资格预审资料(若有)</td>
          <td>
            <n-table>
        <tr>
          <td>资格预审公告</td>
          <td>
            <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.notice.AppsNoticeMain"
              :modelId="props.data.fId" fkey="preReport" :disabled="filesDisabled" />
          </td>
        </tr>
        <tr>
          <td>资格预审结果公告</td>
          <td>
            <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.notice.AppsNoticeMain"
              :modelId="props.data.fId" fkey="noticeFinishMain" :disabled="filesDisabled" />
          </td>
        </tr>
        <tr>
          <td>资格预审报告</td>
          <td>
            <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.notice.AppsNoticeMain"
              :modelId="props.data.fId" fkey="preReport" :disabled="filesDisabled" />
          </td>
        </tr>
    </n-table>
    </td>
    </tr>
    <tr>
      <td style="text-align:center">方案征集邀请书(若有)</td>
      <td>
        <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain"
          :modelId="props.data.fId" fkey="invitationLetter" :disabled="filesDisabled" />
      </td>
    </tr>
    <tr>
      <td style="text-align:center">方案征集合同及附件*</td>
      <td>
        <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain"
          :modelId="props.data.fId" fkey="collectionFile" :disabled="filesDisabled" />
      </td>
    </tr>
    <tr>
      <td style="text-align:center">澄清问题、补充文件及附件(若有)</td>
      <td>
        <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain"
          :modelId="props.data.fId" fkey="supplementFile" :disabled="filesDisabled" />
      </td>
    </tr>
    <tr>
      <td style="text-align:center">书面情况报告*</td>
      <td>
        <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.collection.AppsCollectionResult"
          :modelId="props.data.fId" fkey="writtenReport" :disabled="filesDisabled" />
      </td>
    </tr>
    <tr>
      <td style="text-align:center">评审结果公告(若有)</td>
      <td>
        <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain"
          :modelId="props.data.fId" fkey="originalNotice" :disabled="filesDisabled" />
      </td>
    </tr>
    <tr>
      <td style="text-align:center">评审结果通知(若有)</td>
      <td>
        <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain"
          :modelId="props.data.fId" fkey="reviewResults" :disabled="filesDisabled" />
      </td>
    </tr>
    <tr>
      <td style="text-align:center">最终设计成果*</td>
      <td>
        <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.report.AppsReport"
          :modelId="props.data.fId" fkey="resultFile" :disabled="filesDisabled" />
      </td>
    </tr>
    <tr>
      <td style="text-align:center">其他文件</td>
      <td>
        <n-table>
    <tr>
      <td style="text-align:center">项目其他文件</td>
      <td>
        <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain"
          :modelId="props.data.fId" fkey="other" :disabled="filesDisabled" />
      </td>
    </tr>
    <tr>
      <td style="text-align:center">资格预审其他文件</td>
      <td>
        <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.notice.AppsNoticeMain"
          :modelId="props.data.fId" fkey="noticeOtherFile" :disabled="filesDisabled" />
      </td>
    </tr>
    <tr>
      <td style="text-align:center">征集结果其他文件</td>
      <td>
        <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.collection.AppsCollectionResult"
          :modelId="props.data.fId" fkey="other" :disabled="filesDisabled" />
      </td>
    </tr>
    <tr>
      <td style="text-align:center">其他</td>
      <td>
        <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain"
          :modelId="props.data.fId" fkey="documnetationFile" :disabled="filesDisabled" />
      </td>
    </tr>
    </n-table>
    </td>
    </tr>
    <tr>
      <td colspan="2">
        <n-space justify="center">
          <n-button type="primary" @click="handleValidateClick">
            申请
          </n-button>
          <n-button type="error" @click="closeRecords">
            关闭
          </n-button>
        </n-space>
      </td>
    </tr>
    </tbody>
    </n-table>
  </n-modal>

</template>

<script setup>
  import {
    ref,
    defineComponent,
    compile,
    getCurrentInstance
  } from 'vue'
  import formAddress from '@/apps/common/address/formAddress.vue'
  import attachment from '@/apps/common/attachment/attachment.vue'
  import {
    useMessage,
    useDialog
  } from 'naive-ui'
  import {
    useRoute,
    useRouter
  } from 'vue-router'
  import interfaceUtilApi from '@/utils/interfaceUtil'
  import attachmentViewer from '@/apps/common/attachment/attachmentViewer.vue'
  import createApi from './api'
  import loadTemplateApi from '@/utils/pdfProjectModel'
  import loadDocumentaionTemplateApi from '@/utils/pdfDocumentaionModel'
  import baseUrl from '@/utils/baseUrl'
  import singleLoginApi from '@/utils/singleLogin'
  import sitcAttachment from '@/apps/common/attachment/SITCAttachment.vue'

  const currentInstance = getCurrentInstance()
  const api = createApi(currentInstance)
  const singleLogin = singleLoginApi(currentInstance)
  const loadTemplate = loadTemplateApi(currentInstance)
  const loadDocumentaionTemplate = loadDocumentaionTemplateApi(currentInstance)
  const interfaceUtil = interfaceUtilApi(currentInstance)
  const message = useMessage()
  const route = useRoute()

  const props = defineProps(['open', 'data'])
  const editLvYue = ref(false)
  const editGuiDang = ref(false)

  const finishDocumentation = inject('finishDocumentation')
  const isAdmin = inject('isAdmin')

  var id = props.data.fId
  const form = ref({
    //没在appsProjectDocumentation的字段
    projectType: '16方案征集',
    bidCount: 0,
    packages: inject('baojians'),
    hasPre: '',
    projectImportance: '',
    delayCount: 0,
    circleTime: '0',

    fTenderNum: 0,
    fIsCompanyProcurement: '',
    fLanguage: '',
    fTranslateResult: '',
    fPerpormancePrice: '',
    fPerpormanceTime: '',
    fDevelopPrice: '',
    fDevelopTime: '',
    fProjectRegisterTime: '2000-01-01 00:00:00',
    fProjectId: {
      fId: id,
    },
    fBaseFinishTime: '',
    fAgencyFee: '',
    fLimitFinishTime: '2000-01-01',
    fQuelifyTime: '2000-01-01',
    fProtocolDocumentationNo: '',
    fProtocolDocumentationTime: '',
    fEvaluationNo: '',
    fEvaluationTime: '2000-01-01',
    fDocumentationNo: '',
    fDocumentationTime: '2000-01-01',
    fFinanceBalanceTime: '2000-01-01',
    fFeeBalanceTime: '2000-01-01',
    fDocumentationStatus: '0',
  })

  const packages = inject('baojians')
  const bidCount = inject('bidCount')

  const languages = ref([{
      label: '招标文件(含技术部分)、评标报告、合同商务部分及来往函件均用中英文',
      value: '1',
    },
    {
      label: '招标文件商务部分、评标报告、合同商务部分及来往函件均用中英文',
      value: '2',
    },
    {
      label: '招标文件商务部分、评标报告、合同商务部分中有二份用中英文',
      value: '3',
    },
    {
      label: '招标文件商务部分、评标报告、合同商务部分中有一份用中英文',
      value: '4',
    },
    {
      label: '招标文件、评标报告、合同文件均用中文',
      value: '5',
    },
    {
      label: '无文件或合同',
      value: '6',
    },
  ])

  const TorF = ref([{
      label: '进场的工程总承包或工程施工项目有资格预审',
      value: '1',
    },
    {
      label: '一般项目有资格预审',
      value: '2',
    },
    {
      label: '无资格预审',
      value: '3',
    },
  ])

  /** 预览电子归档文件 */
  const previewDoc = ref({
    viewAttachment: false,
    attachmentId: null,
    attachmentType: 'pdf',
  })
  /** 电子归档文件预览状态 */
  const previewDocumentState = computed(() => {
    return (
      previewDoc.value.attachmentId !== null ||
      previewDoc.value.attachmentId !== undefined
    )
  })
  /** 可申请归档状态 */
  const documentState = computed(() => {
    return props.open && form.value.fBaseFinishTime
  })
  const loadElectronDocument = async () => {
    let attachment = await getElectronFileAttach(
      props.data.fId,
      'com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain',
      'electronDocument',
    )
    if (attachment) {
      previewDoc.value = {
        attachmentId: attachment.fFile.fId,
        attachmentType: 'pdf',
      }
    }
  }
  const handlePreview = async () => {
    if (previewDoc.value.attachmentId) {
      previewDoc.value.viewAttachment = true
    } else {
      await loadElectronDocument()
      if (previewDoc.value.attachmentId) {
        previewDoc.value.viewAttachment = true
      }
    }
  }
  const dialog = useDialog()

  /**
   * 校验基本结束日期
   * @returns {Promise<void>}
   */
  async function validateBaseFinishTime() {
    //基本结束日期内部校验
    const res = await api.projectNoApplicationaCheckTime({
      fId: props.data.fId,
    })
    if (res.data.status) {
      //调用oa接口
      dialog.success({
        title: '校验完成',
        content: '校验基本结束日期完成，基本结束日期为：' +
          res.data.endTime +
          '，是否确认？',
        positiveText: '确认',
        negativeText: '取消',
        onPositiveClick: async function() {
          var result = await interfaceUtil.baseFinishTimeValidate(
            props.data.fId,
            props.data.fProtocolNo,
            res.data.endTime,
          )
          if (result.STATUS != 'S') {
            message.error(result.MESSAGE, {
              closable: true,
              duration: 0,
            })
          } else {
            form.value.fBaseFinishTime = res.data.endTime
            form.value.fLimitFinishTime = result.limitDate
            api.save({
              fId: form.value.fId,
              fBaseFinishTime: form.value.fBaseFinishTime,
              fLimitFinishTime: form.value.fLimitFinishTime,
            })
            api.mainSave({
              fId: form.value.fId,
              fBaseFinishTime: form.value.fBaseFinishTime,
              fLimitFinishTime: form.value.fLimitFinishTime
            })
          }
        },
      })
    } else {
      const array = res.data.msg.split('\n')
      dialog.warning({
        title: '警告',
        content: () => array.map((item, index) => h('div', null, item)),
        positiveText: '确定',
      })
    }
    finishDocumentation.value = form.value.fBaseFinishTime != ''
  }

  function loadBidCount() {
    api
      .noticeCompanyBidList({
        query: {
          eq: {
            'fMain.fProjectId.fId': props.data.fId,
          },
        },
      })
      .then(function(res) {
        if (res.status == 200) {
          form.value.fTenderNum = 0
          var pushed = []
          for (var i = 0; i < res.data.list.length; i++) {
            if (!pushed.includes(res.data.list[i].fApplyId)) {
              pushed.push(res.data.list[i].fApplyId)
              form.value.fTenderNum++
            }
          }
        }
      })
  }

  //从AppsProjectMain读取信息：基本结束日期，限制结束日期，达标日期，创建时间
  function loadProjectInfo() {
    if (props.data.fId) {
      api.projectMainLoad({
        fId: props.data.fId
      }).then(function(res) {
        /*if (res.data.fBaseFinishTime) {
            form.value.fBaseFinishTime = res.data.fBaseFinishTime
          }
          if (res.data.fLimitFinishTime) {
            form.value.fLimitFinishTime = res.data.fLimitFinishTime
          }
          if (res.data.fQualifyTime) {
            form.value.fQualifyTime = res.data.fQualifyTime
          }*/
        if (res.data.fCreateTime) {
          form.value.fProjectRegisterTime = res.data.fCreateTime
        }
        if (res.data.fProjectImportance) {
          form.value.projectImportance = res.data.fProjectImportance.fName
        }
      })
      finishDocumentation.value = form.value.fBaseFinishTime != ''
    }
  }

  /**
   * 读取归档信息：1.从本地获取归档信息；2.从oa更新归档信息并保存
   */
  async function loadDocumentation() {
    if (props.data.fId) {
      api
        .list({
          query: {
            eq: {
              'fProjectId.fId': props.data.fId,
            },
          },
        })
        .then(function(res) {
          if (res.status == 200 && res.data.list.length > 0) {
            var data = res.data.list[0]
            for (var key in data) {
              if (typeof form.value[key] != 'undefined') {
                form.value[key] = data[key]
              }
            }
            finishDocumentation.value = form.value.fBaseFinishTime != ''
          }
        })
    }

    var oaVal = await interfaceUtil.loadDocumentation(props.data.fProtocolNo)
    if (oaVal.STATUS == 'S') {
      form.value.fId = form.value.fProjectId.fId
      form.value.projectType = oaVal['项目类别']
      form.value.bidCount = oaVal['中标金额']
      form.value.fTenderNum = oaVal['投标人数量']
      oaVal['项目重要性'] ?
        (form.value.projectImportance = oaVal['项目重要性']) :
        ''
      form.value.fIsCompanyProcurement = oaVal['公司电子采购平台、进场招标']
      form.value.fLanguage = oaVal['所用语言']
      form.value.fTranslateResult //翻译成果
      form.value.hasPre = oaVal['操作程序']
      form.value.fPerpormancePrice = oaVal['履约奖']
      form.value.fPerpormanceTime = oaVal['履约发奖日期']
      form.value.fDevelopPrice = oaVal['开拓奖']
      form.value.fDevelopTime = oaVal['开拓发奖日期']
      form.value.fBaseFinishTime //基本结束日期
      form.value.fAgencyFee = oaVal['实际代理费']
      form.value.fLimitFinishTime = oaVal['限制结束日期']
      form.value.delayCount = oaVal['申请延期次数']
      form.value.fQuelifyTime = oaVal['达标日期']
      form.value.fProtocolDocumentationNo = oaVal['协议归档编号']
      form.value.fProtocolDocumentationTime = oaVal['协议归档日期']
      form.value.fEvaluationNo = oaVal['履约编号']
      form.value.fEvaluationTime = oaVal['履约上交日期']
      //form.value.fDocumentationNo = oaVal["归档编号"]
      //form.value.fDocumentationNo = "TEST"
      form.value.fDocumentationTime = oaVal['归档日期']
      form.value.fFinanceBalanceTime = oaVal['财务结算日期']
      form.value.fFeeBalanceTime = oaVal['费用结算日期']
      finishDocumentation.value = form.value.fBaseFinishTime != ''

      api.save(form.value)
      api.mainSave({
        fId: form.value.fId,
        fBaseFinishTime: form.value.fBaseFinishTime,
        fLimitFinishTime: form.value.fLimitFinishTime,
        fQuelifyTime: form.value.fQuelifyTime
      })
    }
  }
  if (props.data.fId) {
    loadProjectInfo()
    loadDocumentation()
    loadBidCount()
  }

  watch(
    () => props.data.fId,
    (New, Old) => {
      if (props.data.fId) {
        loadProjectInfo()
        loadDocumentation()
        loadBidCount()
      }
    }, {
      deep: true,
    },
  )
  const getElectronFileAttach = async (fModelId, fModelName, fKey) => {
    var param = []
    var eq = []
    eq.push({
      eq: {
        fModelName: fModelName,
      },
    })
    eq.push({
      eq: {
        fModelId: fModelId,
      },
    })
    eq.push({
      eq: {
        fKey: fKey,
      },
    })
    param.push({
      and: eq,
    })
    let response = await api.attachmentMainList({
      query: param,
      distinct: true,
    })
    return response.data.list && response.data.list.length > 0 ?
      response.data.list[0] :
      null
  }

  //发起归档申请
  const createElectronDocumentLoading = ref(false) //创建快照中
  const createElectronDocumentMessage = ref('')
  const createElectronDocumentPercent = ref(0)
  // const handleApplyFile = async () => {
  //   //2024-09-03 蔡咏钦 在快照生成之前，先进行内网归档校验，成功了才生成快照
  //   try {
  //     var validateResult = await interfaceUtil.fileCheck(
  //       props.data.fId,
  //       props.data.fProtocolNo,
  //       'apply',
  //     )
  //     if (validateResult.STATUS !== 'S') {
  //       message.error(validateResult.MESSAGE, {
  //         closable: true,
  //         duration: 0,
  //       })
  //       return
  //     } else {
  //       //form.value.fBaseFinishTime = validateResult["fDate"]
  //       //form.value.fDocumentationNo = validateResult["fId"]
  //       form.value.fDocumentationStatus = '1'
  //       await api.save({
  //         fId: form.value.fId,
  //         //fBaseFinishTime: form.value.fBaseFinishTime,
  //         //fDocumentationNo: form.value.fDocumentationNo,
  //         fDocumentationStatus: form.value.fDocumentationStatus,
  //       })
  //       //归档后，所有附件添加标记
  //       createElectronDocumentLoading.value = true
  //       createElectronDocumentMessage.value = '正在确认项目附件信息'
  //       createElectronDocumentPercent.value = 0
  //       await api.attachmentControllerAttmentDocument({
  //         id: props.data.fId,
  //       })
  //       finishDocumentation.value = form.value.fBaseFinishTime != ''
  //     }

  //     createElectronDocumentLoading.value = true
  //     createElectronDocumentMessage.value = '正在读取项目资料'
  //     createElectronDocumentPercent.value = 30
  //     let html = await loadTemplate.loadTemplate(props.data.fId)
  //     createElectronDocumentMessage.value = '正在转换PDF格式文件'
  //     createElectronDocumentPercent.value = 60
  //     await api.supplierPdfHtmlConvertPdf({
  //       html: html,
  //       fId: props.data.fId,
  //     })
  //     createElectronDocumentMessage.value = '正在保存快照文件'
  //     createElectronDocumentPercent.value = 90
  //     loadElectronDocument()
  //     createElectronDocumentMessage.value = ''
  //     createElectronDocumentPercent.value = 100
  //     createElectronDocumentLoading.value = false

  //   } catch (e) {
  //     message.error(
  //       '生成快照失败！' +
  //       (e.MESSAGE ? JSON.stringify(e.MESSAGE) : JSON.stringify(e)), {
  //         closable: true,
  //         duration: 0,
  //       },
  //     )
  //     createElectronDocumentMessage.value = ''
  //     createElectronDocumentPercent.value = 100
  //     createElectronDocumentLoading.value = false
  //   }
  // }

  //取消归档申请
  async function cancelApplyFile() {
    form.value.fDocumentationStatus = '0'
    await api.save({
      fId: form.value.fId,
      fDocumentationStatus: form.value.fDocumentationStatus,
    })
    finishDocumentation.value = form.value.fBaseFinishTime != ''
  }

  //确认归档
  async function confirmDocumentation() {
    var validateResult = await interfaceUtil.fileCheck(
      props.data.fId,
      props.data.fProtocolNo,
      'confirm',
    )
    if (validateResult.STATUS !== 'S') {
      message.error(validateResult.MESSAGE, {
        closable: true,
        duration: 0,
      })
      return
    } else {
      form.value.fBaseFinishTime = validateResult['fDate']
      form.value.fDocumentationNo = validateResult['fId']
      form.value.fDocumentationStatus = '2'
      await api.save({
        fId: form.value.fId,
        fBaseFinishTime: form.value.fBaseFinishTime,
        fDocumentationNo: form.value.fDocumentationNo,
        fDocumentationStatus: form.value.fDocumentationStatus,
      })
      finishDocumentation.value = form.value.fBaseFinishTime != ''
    }
  }

  onMounted(() => {
    // const res = api.list({
    //   query: {
    //     eq: {
    //       'fProjectId.fId': props.data.fId,
    //     }
    //   }
    // })
    // console.log(res)
  })


  /**
   * 申请延期，跳转申请延期地质
   */
  function applyDelay() {
    var url =
      baseUrl.oaJumpUrl +
      '/j/sitc/prj/limit_date_ex_new.jsp?proj_id=' +
      props.data.fProtocolNo
    singleLogin.oaJump(url)
  }

  /**
   * 终止申请
   */
  function finishApply() {
    var url =
      baseUrl.oaJumpUrl +
      '/j/sitc/prj/prj_termination_app_s2.jsp?proj_id=' +
      props.data.fProtocolNo
    singleLogin.oaJump(url)
  }

  /**
   * 费用结算明细查看
   */
  function balanceDetailView() {
    var url =
      baseUrl.oaJumpUrl +
      '/j/sitc/adm/fee_by_id.jsp?proj_id=' +
      props.data.fProtocolNo
    singleLogin.oaJump(url)
  }

  //上传协议归档
  function uploadAgreementDocumentation() {
    var url =
      baseUrl.oaJumpUrl +
      '/j/sitc/agr/agr_info.jsp?id=' +
      props.data.fProtocolNumber
    singleLogin.oaJump(url)
  }

  //上传履约评价表编号
  function uploadPerformanceEvaluate() {
    var url =
      baseUrl.oaJumpUrl +
      '/j/sitc/prj/prj_eva_info.jsp?proj_id=' +
      props.data.fProtocolNo
    singleLogin.oaJump(url)
  }

  function editImportanceFile() {
    var url =
      baseUrl.oaJumpUrl +
      '/j/sitc/prj/typical/prj_typical_edit.jsp?mtype=87&ttype=30&tid=' +
      props.data.fProtocolNo
    singleLogin.oaJump(url)
  }

  //结算信息修改
  function balanceInfoEdit() {
    var url =
      baseUrl.ekpUrl +
      '/sitc/project/sitc_project_agreement_info/sitcProjectAgreementInfo.do?method=checkAgreementInfo' +
      '&fdAgreementCode' +
      props.data.fProtocolNumber +
      '&fdProjectCode=' +
      props.data.fProtocolNo +
      '&docSubject=' +
      encodeURIComponent(props.data.fName) +
      '&prjType=16'
    singleLogin.ekpJump(url)
  }

  /**
   * 达标检查
   */
  async function qualifyCheck() {
    var result = await interfaceUtil.qualifyCheck(props.data.fProtocolNo)
    if (result.STATUS !== 'S') {
      message.error(result.MESSAGE, {
        closable: true,
        duration: 0,
      })
    }
  }

  function showFinishApply() {
    return (
      props.data.fAuditStatus === '1' &&
      props.data.isManager &&
      !form.value.fBaseFinishTime
    )
  }

  function showValidateBaseFinishTime() {
    return (
      props.data.fAuditStatus === '1' &&
      (form.value.fBaseFinishTime === '' ||
        form.value.fBaseFinishTime === undefined) &&
      props.data.isManager
    )
  }

  function showApplyDelay() {
    return (
      props.data.fAuditStatus === '1' &&
      form.value.fBaseFinishTime &&
      props.data.isManager
    )
  }

  function showQualifyCheck() {
    return props.data.fAuditStatus === '1' && props.data.isManager
  }

  function showDocumentation() {
    return (
      props.data.fAuditStatus === '1' &&
      form.value.fBaseFinishTime &&
      (form.value.fDocumentationNo === '' ||
        form.value.fDocumentationNo === undefined) &&
      props.data.isManager &&
      form.value.fDocumentationStatus === '0'
    )
  }

  function showBalanceDetailView() {
    return props.data.isManager
  }

  function showBalanceInfoEdit() {
    return props.data.fAuditStatus === '1' && props.data.isManager
  }

  function showEditImportanceFile() {
    return (
      props.data.fAuditStatus === '1' &&
      props.data.isManager &&
      form.value.projectImportance.includes('公司重点')
    )
  }

  function showCancelDocumentation() {
    return (
      props.data.fAuditStatus === '1' &&
      props.data.isManager &&
      form.value.fDocumentationStatus === '1'
    )
  }

  function showConfirmDocumentation() {
    return (
      props.data.fAuditStatus === '1' &&
      isAdmin.value &&
      form.value.fDocumentationStatus === '1'
    )
  }

  //======电子归档======
  const recordsModal = ref(false);
  const showRecords = () => {
    recordsModal.value = true
  }
  const closeRecords = () => {
    recordsModal.value = false
  }
  //oa协议查看链接
  const viewAgreement = () => {
    // */j/sitc/agr/agr_info.jsp?id=193141
    var url = baseUrl.oaJumpUrl + '/j/sitc/adm/car_order/new.jsp?id=' + props.data.fProtocolNumber
    singleLogin.oaJump(url)
  }

  //电子归档 提交申请 校验
  const handleValidateClick = async () => {
    //归档附件上传是否完整
    const res = await api.projectNoApplicationaCheckFiles({
      fId: props.data.fId,
    })
    if (res.data.status) {
      //调用oa接口
      dialog.success({
        title: '校验完成',
        content: '归档校验通过,是否申请？',
        positiveText: '确认',
        negativeText: '取消',
        onPositiveClick: async function() {
          //在快照生成之前，先进行内网归档校验，成功了才生成快照
          try {
            var validateResult = await interfaceUtil.fileCheck(
              props.data.fId,
              props.data.fProtocolNo,
              'apply',
            )
            //归档接口返回
            if (validateResult.STATUS !== 'S') {
              message.error(validateResult.MESSAGE, {
                closable: true,
                duration: 0,
              })
              return
            } else {
              //状态保存
              form.value.fDocumentationStatus = '2'
              await api.save({
                fId: form.value.fId,
                fDocumentationStatus: form.value.fDocumentationStatus,
              })
              //归档后，所有附件添加标记
              createElectronDocumentLoading.value = true
              createElectronDocumentMessage.value = '正在确认项目附件信息'
              createElectronDocumentPercent.value = 0
              await api.attachmentControllerAttmentDocument({
                id: props.data.fId,
              })
              finishDocumentation.value = form.value.fBaseFinishTime != ''
            }

            createElectronDocumentLoading.value = true
            createElectronDocumentMessage.value = '正在读取项目资料'
            createElectronDocumentPercent.value = 15
            //生成项目快照
            let html = await loadTemplate.loadTemplate(props.data.fId,form)
            createElectronDocumentMessage.value = '正在转换项目资料PDF格式文件'
            createElectronDocumentPercent.value = 30
            await api.supplierPdfHtmlConvertPdf({
              html: html,
              fId: props.data.fId,
              fkey: "electronDocument"
            })
            createElectronDocumentMessage.value = '正在保存项目资料快照文件'
            createElectronDocumentPercent.value = 45

            //生成电子归档快照
            createElectronDocumentMessage.value = '正在读取电子归档'
            createElectronDocumentPercent.value = 60
            let html2 = await loadDocumentaionTemplate.loadTemplate(props.data.fId)
            createElectronDocumentMessage.value = '正在转换电子归档PDF格式文件'
            createElectronDocumentPercent.value = 75
            await api.supplierPdfHtmlConvertPdf({
              html: html2,
              fId: props.data.fId,
              fkey: "documentDescribe"
            })
            createElectronDocumentMessage.value = '正在保存电子归档快照文件'
            createElectronDocumentPercent.value = 90

            createElectronDocumentMessage.value = ''
            createElectronDocumentPercent.value = 100
            createElectronDocumentLoading.value = false
            recordsModal.value = false
          } catch (e) {
            message.error(
              '生成快照失败！' +
              (e.MESSAGE ? JSON.stringify(e.MESSAGE) : JSON.stringify(e)), {
                closable: true,
                duration: 0,
              },
            )
            createElectronDocumentMessage.value = ''
            createElectronDocumentPercent.value = 100
            createElectronDocumentLoading.value = false
            recordsModal.value = false
          }
        },
      })
    } else {
      const array = res.data.msg.split('\n')
      dialog.warning({
        title: '警告',
        content: () => array.map((item, index) => h('div', null, item)),
        positiveText: '确定',
      })
    }

  }
  //附件是否可以编辑
  const filesDisabled = computed(() => {
    return form.value.fDocumentationStatus === '2';
  });
</script>

<style>
  .tdcenter {
    text-align: center;
  }

  .tdleft {
    text-align: left;
  }
</style>
