<template>
  <n-collapse :default-expanded-names="['1']">
    <n-collapse-item name="1">
      <template #header>
        <p style="font-size: 16px; font-weight: bold">ISO流转单</p>
      </template>
      <n-data-table
        :columns="columns"
        :data="data"
        :pagination="paginationReactive"
        :row-key="rowKey"
        :single-line="false"
      >
      </n-data-table>
    </n-collapse-item>
  </n-collapse>
  <!--隐藏的打印内容-->
  <div ref="printContent" style="display: none">
    <div style="justify-content: center; display: flex" id="printApprovalDiv">
      <n-table :single-line="false" :single-column="false">
        <tr>
          <td colspan="2">
            <n-space vertical>
              <p style="text-align: center; font-size: 16px; font-weight: bold">
                成果产品校验流转单（SITC/WR06-A01）
              </p>
            </n-space>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <n-space vertical>
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
          <td width="15%">项目/投标编号</td>
          <td>
            {{ isoApproval.fProjectNo }}
          </td>
        </tr>
        <tr>
          <td>项目/投标名称</td>
          <td>
            {{ isoApproval.fProjectName }}
          </td>
        </tr>
        <tr>
          <td>成果产品名称</td>
          <td>
            {{ isoApproval.fSubject }}
          </td>
        </tr>
        <tr>
          <td>招标文本模板</td>
          <td>
            {{ isoApproval.fModelName }}
          </td>
        </tr>
        <tr>
          <td>产品成果编制人</td>
          <td>
            {{ isoApproval.fAchievementPreparedName }}
          </td>
        </tr>
        <tr>
          <td>附件</td>
          <td>
            <n-table style="width: 100%" :single-line="false">
              <tr v-for="attachment in isoApproval.fAttachments">
                <td style="width: 45%">
                  <div>
                    {{ attachment.fFile.fFileName }}
                  </div>
                </td>
                <td style="width: 45%">
                  <span v-for="pack in attachment.fPackages"
                    >包件{{ pack.fPackageId.fIndex }}:{{
                      pack.fPackageId.fName
                    }}；</span
                  >
                </td>
              </tr>
            </n-table>
          </td>
        </tr>
        <tr>
          <td>备注</td>
          <td>
            {{ isoApproval.fNotes }}
          </td>
        </tr>
        <tr>
          <td>自检情况</td>
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
          <td>复检情况</td>
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
          <td>相关部门评审意见</td>
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
          <td>审检情况</td>
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
          <td>最终检验情况</td>
          <td>
            <div v-if="isoApproval.fFinalApproval.message" style="width: 100%">
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
      </n-table>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useMessage, useDialog } from 'naive-ui'
import createApi from './api'
import { useRoute, useRouter } from 'vue-router'
import moment from 'moment'
import baseUrl from '@/utils/baseUrl'
import {useMenuStore} from '@/store/menu.js'
const menuStore = useMenuStore()

const api = createApi(getCurrentInstance())
const props = defineProps({
  data: Object,
})

const message = useMessage()
const dialog = useDialog()
const route = useRoute()
const id = menuStore.currentRouteObj.urlParams.fId

const statusMap = {
  '00': '废弃',
  30: '已完成',
  fFirstCheck: '自检',
  fReCheck: '复检',
  fDeptApproval: '相关部门评审',
  fApproval: '审检',
  fFinalApproval: '最终检验',
}

const isoApproval = ref({
  fId: '',
  fProjectNo: '',
  fProjectName: '',
  fAchievementName: '',
  fModelName: '',
  fAchievementPrepared: {
    fId: '',
    fName: '',
  },
  fAchievementPreparedName: '',
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
  fDeptApproval: {
    message: '',
    handler: '',
    time: '',
  },
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
})
const printContent = ref(null)

const columns = [
  {
    title: 'ISO表单名',
    key: 'fSubject',
  },
  {
    title: 'ISO编号',
    key: 'fNo',
  },
  {
    title: '填写人',
    key: 'fCreatorName',
  },
  {
    title: '填写日期',
    key: 'fCreateTime',
  },
  {
    title: '审批状态',
    key: 'fStatus',
    render(row) {
      var str = statusMap[row.fStatus]
      if (row.fStatus != '00' && row.fStatus != '30') {
        var handlerNames = []
        for (var i=0; i<row.fHandlers.length; i++) {
          if (row.fHandlers[i].fNode == row.fStatus && row.fHandlers[i].fStatus == "0") {
            if (row.fHandlers[i].fHandlerTarget) {
              handlerNames.push(row.fHandlers[i].fHandlerTarget.fName)
            }
          }
        }
        str += "（" + handlerNames.join(";") + "）"
      }
      return str
    },
  },
  {
    title: '审阅用时',
    key: 'fCostTime',
    render(row) {
      if (row.fFinishTime) {
        return (
          moment(row.fFinishTime).diff(
            moment(row.fCreateTime),
            'hours',
            false,
          ) + '小时'
        )
      } else {
        return ''
      }
    },
  },
  {
    title: '操作',
    key: 'options',
    render(row) {
      return [
        h(
          NButton,
          {
            onClick: function () {
              window.open(
                baseUrl.pmUrl +
                  '/view/projectManagement/implementation/project-iso-view?fId=' +
                  row.fId,
                '_blank',
              )
            },
          },
          '查看',
        ),
        h(
          NButton,
          {
            onClick: function () {
              for (var key in row) {
                isoApproval.value[key] = row[key]
              }
              setTimeout(doPrint, 100)
            },
          },
          '打印',
        ),
      ]
    },
  },
]

const doPrint = () => {
  const content = printContent.value.innerHTML
  const printWindow = window.open('', '_blank')
  printWindow.document.open()
  printWindow.document.write(`
      <html>
        <title>\u200E</title>
        <head>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin: 20px auto; }
            th, td { border: 1px solid #000; padding: 8px; }
            @media print {
                @page {
                    margin: 1cm; /* 设置页边距 */
                }

                /* 隐藏页脚中的 about:blank */
                @page {
                    margin-bottom: 1cm; /* 调整页脚位置 */
                    margin-footer: 0; /* 设置页脚为空 */
                }
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${content}
        </body>
      </html>
    `)
  printWindow.document.close()
}

const data = reactive([])

//包件筛选
const selectedPackageId = inject('selectedPackageId')
const selectedPackageName = inject('selectedPackageName')
watch(
  () => selectedPackageName,
  (New, Old) => {
    list()
  },
  {
    deep: true,
  },
)

function list() {
  if (props.data.fProtocolNo === undefined) {
    return
  }
  var andQuery = []
  var eqNo = {
    eq: {
      fProjectNo: props.data.fProtocolNo,
    },
  }
  andQuery.push(eqNo)
  /*if (selectedPackageId.value.length > 0) {
    var inPackage = {
      in: {
        'fAttachments.fPackages.fPackageId.fId': selectedPackageId.value,
      },
    }
    andQuery.push(inPackage)
  }*/

  var query = {
    and: andQuery,
  }
  var param = {
    distinct: true,
    query: query,
  }
  api.isoApprovalList(param).then(function (res) {
    if (res.status == 200) {
      data.length = 0
      for (var i = 0; i < res.data.list.length; i++) {
        data.push(res.data.list[i])
      }
    }
  })
}
list()

const paginationReactive = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [8, 10, 15],
  onChange: (page) => {
    paginationReactive.page = page
  },
  onUpdatePageSize: (pageSize) => {
    paginationReactive.pageSize = pageSize
    paginationReactive.page = 1
  },
})
</script>

<style scoped></style>
