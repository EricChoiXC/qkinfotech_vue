<!-- 流程审批页面 -->
<!--
  fProcessId : ekp流程id
  afterSubmit ： 提交同意后，调用的方法
  beforeSubmit ： 提交同意前，调用的方法；用于校验处理；需要返回t/f
  afterRefuse ： 提交驳回后，调用的方法
  beforeRefuse ： 提交驳回前，调用的方法；用于校验处理；需要返回t/f
 -->
<template>
  <n-card v-if="$props.fProcessId">
    <n-tabs type="line" animated>
      <n-tab-pane name="流程处理" tab="流程处理">
        <n-table :single-line="false">
          <tbody>
            <tr>
              <td colspan="2">
                <iframe
                  id="approvalDetailFrame"
                  :src="approvalDetailSrc"
                  scrolling="no"
                  style="width: 100%"
                >
                </iframe>
              </td>
            </tr>
            <tr v-if="isHandler">
              <td style="width: 15%">
                <span>操作</span>
              </td>
              <td>
                <n-space>
                  <n-button
                    type="primary"
                    @click="submitProcess"
                    :loading="onSubmit"
                    :disabled="finishSubmit"
                    >同意</n-button
                  >
                  <n-button
                    type="error"
                    @click="refuseProcess"
                    :loading="onSubmit"
                    :disabled="finishSubmit"
                    >拒绝</n-button
                  >
                </n-space>
              </td>
            </tr>
            <tr v-if="isHandler">
              <td style="width: 15%">
                <span>处理意见</span>
              </td>
              <td>
                <n-input
                  type="textarea"
                  style="width: 60%"
                  v-model:value="handleInfo"
                ></n-input>
              </td>
            </tr>
          </tbody>
        </n-table>
      </n-tab-pane>
      <n-tab-pane name="流程图" tab="流程图">
        <iframe
          id="processFlowFrame"
          :src="processFlowSrc"
          width="100%"
          height="100%"
          scrolling="no"
          frameborder="0"
        >
        </iframe>
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>

<script>
import { defineComponent, ref, reactive, watch } from 'vue'
import createApi from './api'
import { useMessage } from 'naive-ui'
import attachment from '@/apps/common/attachment/attachment.vue'
import storage from '@/utils/storage'
import processUtilApi from '@/utils/processUtil'
import { useRoute, useRouter } from 'vue-router'
import baseUrl from '@/utils/baseUrl'
import chromeContext from '@/context.js'
import singleLoginApi from '@/utils/singleLogin'

export default defineComponent({
  props: {
    /* 流程ekpId */
    fProcessId: String,
    beforeSubmit: {
      type: Function,
      default: null,
    },
    beforeRefuse: {
      type: Function,
      default: null,
    },
    afterSubmit: {
      type: Function,
      default: null,
    },
    afterRefuse: {
      type: Function,
      default: null,
    },
  },
  emits: ['afterSubmit', 'afterRefuse', 'beforeSubmit', 'beforeRefuse'],
  setup(props, context) {
    const currentInstance = getCurrentInstance()
    const api = createApi(currentInstance)
    const singleLogin = singleLoginApi(currentInstance)
    const processUtil = processUtilApi(currentInstance)
    const ekpUrl = baseUrl.ekpUrl //TODO
    const route = useRoute()
    const showApprovalDetail = ref(true)
    const showApprovalRange = ref('all')

    /* iframe窗口 */
    const approvalDetailSrc = ref('')
    const processFlowSrc = ref('')
    const processStatusSrc = ref('')
    const processTableSrc = ref('')
    const processLogSrc = ref('')
    if (props.fProcessId) {
      reload()
    }

    /* 审批操作，弃用  */
    const approvalOperation = ref('handle_pass')
    /* 审批意见 */
    const handleInfo = ref('')
    /* 紧急程度，未使用 */
    const notifyInportance = ref('1')
    const notifyOperations = reactive(['1'])
    const message = useMessage()

    /* 提交中，加载条 */
    const onSubmit = ref(false)
    /* 已完成提交，禁用按钮 */
    const finishSubmit = ref(false)
    /* 是否当前处理人 */
    const isHandler = ref(false)

    /* 通过审批 */
    async function submitProcess() {
      //提交前校验
      if (props.beforeSubmit && typeof props.beforeSubmit === 'function') {
        var validate = await props.beforeSubmit()
        if (!validate) {
          return
        }
      }

      onSubmit.value = true
      finishSubmit.value = true

      /* 默认意见 */
      if (handleInfo.value == '') {
        handleInfo.value = '同意'
      }
      /* 提交流程 */
      api
        .approveProcess({
          reviewId: props.fProcessId,
          formParam: {
            handler: {
              Id: chromeContext.user(),
            },
            operationType: 'handler_pass',
            auditNote: handleInfo.value,
          },
        })
        .then(async function (response) {
          if (response.result.success) {
            if (props.afterSubmit && typeof props.afterSubmit === 'function') {
              var afterSubmitRes = await props.afterSubmit(handleInfo.value)
              if (!afterSubmitRes) {
                message.error('提交失败，请检查')
                return
              }
            }
            onSubmit.value = false
            window.open(baseUrl.pmUrl + '/view/actionSuccess', '_self')
          } else {
            message.error(response.result.message, {
              closable: true,
              duration: 0,
            })
          }
        })
        .catch(function (response) {
          message.error('提交出错，请重试 : ' + response, {
            closable: true,
            duration: 0,
          })
          onSubmit.value = false
          finishSubmit.value = false
        })
    }

    /* 驳回，直接废弃ekp流程 */
    function refuseProcess() {
      onSubmit.value = true
      finishSubmit.value = true
      if (handleInfo.value == '') {
        message.error('请填写拒绝意见')
        onSubmit.value = false
        finishSubmit.value = false
        return
      }
      api
        .approveProcess({
          reviewId: props.fProcessId,
          formParam: {
            handler: {
              Id: '1183b0b84ee4f581bba001c47a78b2d9',
            },
            operationType: 'admin_abandon',
            auditNote: handleInfo.value,
          },
        })
        .then(async function (response) {
          if (response.result.success) {
            if (props.afterRefuse && typeof props.afterRefuse === 'function') {
              var afterRefuseRes = await props.afterRefuse(handleInfo.value)
              if (!afterRefuseRes) {
                message.error('提交失败，请检查')
                return
              }
            }
            onSubmit.value = false
            window.open(baseUrl.pmUrl + '/view/actionSuccess', '_self')
          } else {
            message.error(response.result.message, {
              closable: true,
              duration: 0,
            })
          }
        })
        .catch(function (response) {
          message.error('提交出错，请重试 : ' + response, {
            closable: true,
            duration: 0,
          })
          onSubmit.value = false
          finishSubmit.value = false
        })
    }

    window.addEventListener('message', (e) => {
      if (e.data.frameId && e.data.height) {
        document.getElementById(e.data.frameId).height = e.data.height + 'px'
      }
    })

    /* 重新加载iframe */
    async function reload() {
      if (props.fProcessId == '' || props.fProcessId == undefined) return
      approvalDetailSrc.value = await parseEkpUrl(
        ekpUrl +
          '/sys/lbpmservice/support/lbpm_audit_note/lbpmAuditNote.do?method=listNote&fdModelId=' +
          props.fProcessId +
          '&fdModelName=com.landray.kmss.km.review.model.KmReviewMain&formBeanName=kmReviewMainForm&showPersonal=true&approveType=&filterType=dept',
      )
      processFlowSrc.value = await parseEkpUrl(
        ekpUrl +
          '/km/review/km_review_main/kmReviewMain.do?method=viewQkinfo&forward=viewSysWfBusinessForm&fdId=' +
          props.fProcessId +
          '&flow=01',
      )

      processStatusSrc.value =
        ekpUrl +
        '/sys/lbpmservice/support/lbpm_process_status/pm_index.jsp?fdModelId=' +
        props.fProcessId +
        '&fdModelName=com.landray.kmss.km.review.model.KmReviewMain'
      processTableSrc.value =
        ekpUrl +
        '/km/review/km_review_main/kmReviewMain.do?method=viewQkinfo&forward=viewSysLbpmTable&fdId=' +
        props.fProcessId +
        '&flow=01'
      processLogSrc.value =
        ekpUrl +
        '/sys/lbpmservice/support/lbpm_audit_note_ui/lbpmAuditNote_flowLog_qkinfo_index.jsp?fdModelId=' +
        props.fProcessId +
        '&fdModelName=com.landray.kmss.km.review.model.KmReviewMain&formName=kmReviewMainForm'
      if (props.fProcessId !== undefined || props.fProcessId !== '') {
        processUtil.isHandler(props.fProcessId).then((result) => {
          isHandler.value = result
        })
      }
    }

    reload()

    watch(
      () => props.fProcessId,
      async (newVal, oldVal) => {
        if (props.fProcessId == '' || props.fProcessId == undefined) return
        approvalDetailSrc.value = await parseEkpUrl(
          ekpUrl +
            '/sys/lbpmservice/support/lbpm_audit_note/lbpmAuditNote.do?method=listNote&fdModelId=' +
            props.fProcessId +
            '&fdModelName=com.landray.kmss.km.review.model.KmReviewMain&formBeanName=kmReviewMainForm&showPersonal=true&approveType=&filterType=dept',
        )
        processFlowSrc.value = await parseEkpUrl(
          ekpUrl +
            '/km/review/km_review_main/kmReviewMain.do?method=viewQkinfo&forward=viewSysWfBusinessForm&fdId=' +
            props.fProcessId +
            '&flow=01',
        )

        processStatusSrc.value =
          ekpUrl +
          '/sys/lbpmservice/support/lbpm_process_status/pm_index.jsp?fdModelId=' +
          props.fProcessId +
          '&fdModelName=com.landray.kmss.km.review.model.KmReviewMain'
        processTableSrc.value =
          ekpUrl +
          '/km/review/km_review_main/kmReviewMain.do?method=viewQkinfo&forward=viewSysLbpmTable&fdId=' +
          props.fProcessId +
          '&flow=01'
        processLogSrc.value =
          ekpUrl +
          '/sys/lbpmservice/support/lbpm_audit_note_ui/lbpmAuditNote_flowLog_qkinfo_index.jsp?fdModelId=' +
          props.fProcessId +
          '&fdModelName=com.landray.kmss.km.review.model.KmReviewMain&formName=kmReviewMainForm'

        processUtil.isHandler(newVal).then((result) => {
          isHandler.value = result
        })
      },
      {
        deep: true,
      },
    )

    async function parseEkpUrl(url) {
      return await singleLogin.ekpLocalQuestLink(url)
    }

    return {
      showApprovalDetail,
      showApprovalRange,
      approvalDetailSrc,
      processStatusSrc,
      processFlowSrc,
      approvalOperation,
      notifyInportance,
      processTableSrc,
      processLogSrc,
      notifyOperations,
      submitProcess,
      refuseProcess,
      message,
      reload,
      handleInfo,
      onSubmit,
      finishSubmit,
      route,
      isHandler,
      parseEkpUrl,
    }
  },
})
</script>

<style></style>
