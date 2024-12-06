<template>
  <!--  <n-collapse>
    <n-collapse-item>
      <template #header>

      </template>
&lt;!&ndash;      <n-data-table&ndash;&gt;
&lt;!&ndash;        :columns="resultComfirmColumns"&ndash;&gt;
&lt;!&ndash;        :data="resultComfirmTime"&ndash;&gt;
&lt;!&ndash;        :pagination="pagination"&ndash;&gt;
&lt;!&ndash;        :row-key="rowKey"&ndash;&gt;
&lt;!&ndash;        :single-line="false"&ndash;&gt;
&lt;!&ndash;      >&ndash;&gt;
&lt;!&ndash;      </n-data-table>&ndash;&gt;
    </n-collapse-item>
  </n-collapse>-->
  <p
    style="
      display: flex;
      align-items: center;
      font-size: 16px;
      font-weight: bold;
    "
  >
    征集结果
  </p>
  <n-grid :cols="1" y-gap="10">
    <n-gi>
      <n-button
        type="primary"
        @click="collectionAdd"
        style="margin-top: 20px; margin-left: 15px"
        v-if="!finishDocumentation"
      >
        添加
      </n-button>
    </n-gi>
    <n-gi>
      <n-card>
        <n-grid :cols="1">
          <n-gi v-if="resultPackageDetailList.length > 0">
            <n-table :single-line="false">
              <tbody>
                <!-- <tr v-for="item in resultPackageDetailList" > -->
                <tr
                  v-for="item in resultPackageDetailList"
                  v-show="showResult(item)"
                >
                  <td style="width: 20%" class="tdcenter">
                    {{
                      item.appsProjectPackage
                        ? '包件' +
                          item.appsProjectPackage.fIndex +
                          ':' +
                          item.appsProjectPackage.fName
                        : '无数据'
                    }}
                  </td>
                  <td class="tdleft">
                    <!-- <n-data-table :data="result.fDetail" :columns="columns"> -->
                    <n-data-table
                      :data="item.appsCollectionResultDetail"
                      :columns="columns"
                    >
                    </n-data-table>
                  </td>
                </tr>
                <tr>
                  <td style="width: 20%" class="tdcenter">总金额</td>
                  <td class="tdleft">{{ fTotal }}万元</td>
                </tr>

                <tr>
                  <td style="width: 20%" class="tdcenter">方案效果图</td>
                  <td class="tdleft">
                    <!-- <sitc-attachment status="view" title="方案效果图" :linkPackage="true"></sitc-attachment> -->
                    <sitc-attachment
                      :linkPackage="true"
                      :projectId="props.data.fId"
                      modelName="com.qkinfotech.core.tendering.model.apps.collection.AppsCollectionResult"
                      :modelId="props.data.fId"
                      fkey="solutionEffect"
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
                  <td style="width: 20%" class="tdcenter">确认征集结果日期</td>
                  <td class="tdleft">
                    <n-data-table
                      :data="packages"
                      :columns="confirmCollectionResultDateTr"
                    >
                    </n-data-table>
                  </td>
                </tr>
              </tbody>
            </n-table>
          </n-gi>

          <n-gi>
            <p style="font-size: 16px; font-weight: bold">附件上传</p>
          </n-gi>
          <n-gi>
            <n-table :single-line="false">
              <tbody>
<!--                <tr>
                  <td style="width: 20%" class="tdcenter">征集结果通知</td>
                  <td class="tdleft">
                    <sitc-attachment
                      :linkPackage="true"
                      :projectId="props.data.fId"
                      modelName="com.qkinfotech.core.tendering.model.apps.collection.AppsCollectionResult"
                      :modelId="props.data.fId"
                      fkey="collectionResultNotice"
                      :disabled="
                        !props.data.isManager ||
                        props.data.fAuditStatus != '1' ||
                        finishDocumentation
                      "
                    >
                    </sitc-attachment>
                  </td>
                </tr> -->
                <tr>
                  <td style="width: 20%" class="tdcenter">成果文件</td>
                  <td class="tdleft">
                      <sitc-attachment
                        :linkPackage="true"
                        :projectId="props.data.fId"
                        modelName="com.qkinfotech.core.tendering.model.apps.report.AppsReport"
                        :modelId="props.data.fId"
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
                  <td style="width: 20%" class="tdcenter">
                    书面报告<span style="color: red">*</span>
                    <br/>
                    <n-button type="success" @click="openIsoApproval($props.data.fId)"
                              v-show="props.data.isManager && props.data.fAuditStatus == '1' && !finishDocumentation">
                      成果产品检验流转
                    </n-button>
                  </td>
                  <td class="tdleft">
                    <!-- <sitc-attachment status="view" title="书面报告" :files="files" :hasApproval="true"
                          :linkPackage="true"></sitc-attachment> -->
                    <sitc-attachment
                      title="书面报告"
                      modelName="com.qkinfotech.core.tendering.iso.model.IsoApproval"
                      :modelId="writtenReportIsoId"
                      fkey="书面报告"
                      :disabled="true">
                    </sitc-attachment>
                  </td>
                </tr>
                <tr>
                  <td style="width: 20%" class="tdcenter">其他</td>
                  <td class="tdleft">
                    <!-- <sitc-attachment status="view" title="其他" :linkPackage="true"></sitc-attachment> -->
                    <sitc-attachment
                      :linkPackage="true"
                      :projectId="props.data.fId"
                      modelName="com.qkinfotech.core.tendering.model.apps.collection.AppsCollectionResult"
                      :modelId="props.data.fId"
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
          </n-gi>
        </n-grid>
      </n-card>
    </n-gi>
  </n-grid>
  <!--
  <n-collapse>
    <n-collapse-item title="提交记录" name="1">
      <ul>
        <li v-for="(item, fId) in resultComfirmTime" :key="item.fId">
          <n-button type="text" :style="{ marginBottom: '10px' }" @click="changeResult(item.fId)">
            {{ item.fConfirmTime }}
          </n-button>
        </li>
      </ul>
    </n-collapse-item>
  </n-collapse> -->

  <n-modal
    v-model:show="recordModalShow"
    style="width: 60%"
    preset="dialog"
    title="征集结果详情"
    :mask-closable="false"
  >
    <div v-if="modalCompanyList.length > 0">
      <n-table :single-line="false">
        <tbody>
          <tr v-for="item in modalCompanyList">
            <td style="width: 20%" class="tdcenter">
              {{
                item.appsProjectPackage
                  ? item.appsProjectPackage.fName
                  : '无数据'
              }}
            </td>
            <td class="tdleft">
              <n-form-item label="">
                <n-data-table
                  :data="item.appsCollectionResultDetail"
                  :columns="columns"
                >
                </n-data-table>
              </n-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 20%" class="tdcenter">总金额</td>
            <td class="tdleft">
              <n-form-item label=""> {{ fTotal }}万元 </n-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 20%" class="tdcenter">方案效果图</td>
            <td class="tdleft">
              <n-form-item label="">
                <!-- <sitc-attachment status="view" title="方案效果图" :linkPackage="true"></sitc-attachment> -->
                <sitc-attachment
                  :linkPackage="true"
                  :projectId="props.data.fId"
                  modelName="com.qkinfotech.core.tendering.model.apps.collection.AppsCollectionResult"
                  :modelId="props.data.fId"
                  fkey="solutionEffect"
                  :disabled="true"
                >
                </sitc-attachment>
              </n-form-item>
            </td>
          </tr>
        </tbody>
      </n-table>
    </div>
  </n-modal>

  <n-modal
    v-model:show="collectionResultShow"
    style="width: 60%"
    preset="dialog"
    title="新建征集结果"
    :mask-closable="false"
  >
    <collectionResultEdit
      @createCollectionResult="createCollectionResult"
      @close="collectionResultShow = false"
    >
    </collectionResultEdit>
  </n-modal>
  <n-modal
    v-model:show="collectionResultDateShow"
    style="width: 20%"
    preset="dialog"
    title="确认征集结果日期"
    :mask-closable="false"
  >
    <n-space vertical>
      <n-date-picker
        v-model:formatted-value="confirmDate"
        value-format="yyyy-MM-dd"
      ></n-date-picker>
      <n-space justify="center">
        <n-button type="success" @click="saveConfirmDate">确认</n-button>
      </n-space>
    </n-space>
  </n-modal>
</template>

<script setup>
import { ref, defineComponent, onMounted, reactive, inject } from 'vue'
import formAddress from '@/apps/common/address/formAddress.vue'
import collectionResultEdit from './collectionResult_edit.vue'
import sitcAttachment from '@/apps/common/attachment/SITCAttachment.vue'
import {
  NCheckboxGroup,
  NCheckbox,
  NRadioGroup,
  NRadio,
  NSpace,
  NModal,
  useDialog,
  useMessage
} from 'naive-ui'

import createApi from './api'
import interfaceUtilApi from '@/utils/interfaceUtil'
import baseUrl from "@/utils/baseUrl";
const asassa = []
const props = defineProps(['open', 'data'])
const message = useMessage()
const currentInstance = getCurrentInstance()
const api = createApi(currentInstance)
const interfaceUtil = interfaceUtilApi(currentInstance)
//项目id
const route = useRoute()
var projectMainId = props.data.fId

watch(() => props.data.fId, (New, Old) => {
  projectMainId = props.data.fId
  if (projectMainId) {
    methods.getDetailList()
    getResultComfirmTimeList()
    getWrittenReportIsoId(projectMainId)
  }
}, {
  deep: true
});

//征集结果id
var collectionResultMainId = ''

//总金额
const fTotal = ref(0)
const bidCount = inject('bidCount')
const finishDocumentation = inject('finishDocumentation')

//征集结果 窗口
const recordModalShow = ref(false)

/**结果记录分页组件 */
const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [15, 30, 50],
  onChange: (newPage) => {
    pagination.page = newPage // 直接更新 page 对象内的 page 属性
    getResultComfirmTimeList()
  },
  onUpdatePageSize: (newPageSize) => {
    pagination.pageSize = newPageSize // 更新 pageSize
    pagination.page = 1 // 重置 page 到第一页
    getResultComfirmTimeList()
  },
})

const projectStep = inject('projectStep')

const isAddCollectionResult = computed(() => {
  return !projectStep.value.isAddCollectionResult
})
const collectionResultShow = ref(false)
const collectionAdd = () => {
  collectionResultShow.value = true
  loadPackagesConfirmDate()
}
/**resultDetail 相关列 */
const columns = [
  {
    key: 'fCompany.fName',
    title: '公司名称',
  },
  {
    key: 'fCollectionPrice',
    title: '方案征集费(万元)',
  },
  {
    key: 'fPrice',
    title: '奖金(万元)',
  },
  {
    key: 'fIndex',
    title: '评审排序',
  },
  {
    key: 'fRemark',
    title: '备注',
  },
]

/**征集结果 记录 相关列 */
const resultComfirmColumns = [
  {
    key: 'fConfirmTime',
    title: '确认时间',
  },

  {
    key: '',
    title: '操作',
    render(row, index) {
      return h(
        NButton,
        {
          type: 'info',
          size: 'small',
          onClick: () => {
            changeResult(row.fId)
            recordModalShow.value = true
          },
        },
        { default: () => '查看' },
      )
    },
  },
]

const results = reactive([])

function caculateTotal() {
  for (var i = 0; i < results.length; i++) {
    results[i].fTotal = 0
    for (var j = 0; j < results[i].fDetail.length; j++) {
      results[i].fTotal += results[i].fDetail[j].fCollectionPrice
      results[i].fTotal += results[i].fDetail[j].fPrice
    }
  }
}
caculateTotal()

const selectedCompany = ref([])

async function createCollectionResult(collection) {
  collectionResultShow.value = false
  await methods.getDetailList()
  await getResultComfirmTimeList()
  results.length = 0
  results.push(collection)
  loadPackagesConfirmDate()
}

// 辅助函数：将时间戳转换为日期格式
function formatTimestamp(timestamp) {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0') // 月份从0开始，需要加1，然后补0
  const day = date.getDate().toString().padStart(2, '0') // 补0
  const formattedDate = `${year}-${month}-${day}` // 格式化日期为 "YYYY-MM-DD"
  return formattedDate
}

const times = formatTimestamp(new Date().getTime())

// *********************
const resultPackageList = reactive([])
/**获取AppsCollectionResultPackage数据  */
const methods = {
  getDetailList: async function () {
    resultPackageList.length = 0
    /**获取AppsCollectionResultPackage数据 */
    try {
      // selectedPackageId
      const resPackageList = await api.packageList({
        query: [{ eq: { 'appsProjectPackage.fMainId.fId': projectMainId } }],
      })
      for (let i = 0; i < resPackageList.data.list.length; i++) {
        const detailResponse = await api.detailList({
          query: [
            {
              eq: {
                fId: resPackageList.data.list[i].appsCollectionResultDetail.fId,
              },
            },
          ],
        })
        if (detailResponse.data.length != 0) {
          const companyJson = await companyName(
            detailResponse.data.list[0].fCompany.fId,
          )
          const resultResponse = await api.load({
            fId: detailResponse.data.list[0].fResultId.fId,
          })
          resPackageList.data.list[i].appsCollectionResultDetail.fCompany =
            companyJson
          if (
            resultResponse.data.fMainId.fId === projectMainId &&
            resultResponse.data.fId === (await methods.getLastrstResult())
          ) {
            resultPackageList.push(resPackageList.data.list[i])
          }
        }
      }

      // 获取最新的征集结果
      // const latestResult = await methods.getLastrstResult();
      // var query = [{ "eq": { "appsCollectionResultDetail.fResultId.fId": latestResult } }];
      // await axios.post( "/pm/apps/collection/result/package/list", { query: query }).then(async (res) => {
      //   if (res.data.list) {
      //     resultPackageList.push(...res.data.list);
      //   }
      // });
      distinct()
      setCompany()
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  },

  getLastrstResult: async function () {
    var query = [{ eq: { 'fMainId.fId': projectMainId } }]
    var sort = ['fConfirmTime desc']
    const res = await api.list({
      query: query,
      sort: sort,
    })
    fTotal.value = res.data.list[0].fTotalPrice
    bidCount.value = fTotal.value
    return res.data.list[0].fId
  },
}

var latestResultId = ''
/**对包件 进行去重 */
const distinctPackageLsit = reactive([])
const distinct = () => {
  distinctPackageLsit.length = 0
  for (let i = 0; i < resultPackageList.length; i++) {
    if (
      distinctPackageLsit.includes(
        resultPackageList[i].appsProjectPackage.fName,
      )
    ) {
      continue
    } else {
      distinctPackageLsit.push(resultPackageList[i].appsProjectPackage.fName)
    }
  }
}

//表格所需的对象
const resultPackageDetailList = reactive([])
//最新的记录
const modalCompanyList = reactive([])

const setCompany = () => {
  resultPackageDetailList.length = 0

  for (let j = 0; j < distinctPackageLsit.length; j++) {
    const packageName = distinctPackageLsit[j]
    resultPackageDetailList[j] = {
      appsProjectPackage: null,
      appsCollectionResultDetail: [],
    }

    for (let i = 0; i < resultPackageList.length; i++) {
      if (resultPackageList[i].appsProjectPackage.fName === packageName) {
        if (!resultPackageDetailList[j].appsProjectPackage) {
          resultPackageDetailList[j].appsProjectPackage =
            resultPackageList[i].appsProjectPackage
        }
        resultPackageDetailList[j].appsCollectionResultDetail.push(
          resultPackageList[i].appsCollectionResultDetail,
        )
      }
    }
  }
}

/**模态窗口的list */
const setModalCompany = () => {
  modalCompanyList.length = 0

  for (let j = 0; j < distinctPackageLsit.length; j++) {
    const packageName = distinctPackageLsit[j]
    modalCompanyList[j] = {
      appsProjectPackage: null,
      appsCollectionResultDetail: [],
    }

    for (let i = 0; i < resultPackageList.length; i++) {
      if (resultPackageList[i].appsProjectPackage.fName === packageName) {
        if (!modalCompanyList[j].appsProjectPackage) {
          modalCompanyList[j].appsProjectPackage =
            resultPackageList[i].appsProjectPackage
        }
        modalCompanyList[j].appsCollectionResultDetail.push(
          resultPackageList[i].appsCollectionResultDetail,
        )
      }
    }
  }
}

/**公司名称装换 */
const companyName = async (companyId) => {
  try {
    const response = await api.orgPersonLoad({ fId: companyId })
    const company = {
      fName: response.data.fName,
      fId: companyId,
    }
    return company
  } catch (error) {
    console.error('There was an error!', error)
    throw error // 如果需要可以抛出错误
  }
}

/**关闭模态窗口 */
const emit = defineEmits(['closeEditModel'])
const closeEditModel = () => {
  console.log('关闭模态窗口')
}

/**提交记录 */
const resultComfirmTime = reactive([])
/**获取征集结果的记录*/
const getResultComfirmTimeList = async () => {
  resultComfirmTime.length = 0
  var query = [{ eq: { 'fMainId.fId': projectMainId } }]
  var sort = ['fConfirmTime desc']
  const res = await api.list({
    query: query,
    sort: sort,
  })
  for (let i = 0; i < res.data.list.length; i++) {
    var resultIdAndTime = {
      fConfirmTime: res.data.list[i].fConfirmTime,
      fId: res.data.list[i].fId,
    }
    resultComfirmTime.push(resultIdAndTime)
  }
}

/**修改所显示的征集结果*/
const changeResult = async (resultId) => {
  await api.load({ fId: resultId }).then(async (res) => {
    fTotal.value = res.data.fTotalPrice
  })

  resultPackageList.length = 0
  var query = [{ eq: { 'appsCollectionResultDetail.fResultId.fId': resultId } }]
  const resultRecord = await api.packageList({ query: query })

  var companyQuery = [{ eq: { 'fResultId.fId': resultId } }]
  const companyRecordList = await api.detailList({ query: companyQuery })

  const detailById = {}
  companyRecordList.data.list.forEach((item) => {
    detailById[item.fId] = item
  })

  resultRecord.data.list.forEach((item) => {
    const detailItem = detailById[item.appsCollectionResultDetail.fId]
    if (detailItem) {
      item.appsCollectionResultDetail.fCompany = detailItem.fCompany
    }
    resultPackageList.push(item)
  })

  distinct()
  setModalCompany()
}

/**总金额  */
onMounted(async () => {
  if (projectMainId) {
    methods.getDetailList()
    getResultComfirmTimeList()
  }
})

const selectedPackageId = inject('selectedPackageId')
const selectedPackageName = inject('selectedPackageName')
function showResult(result) {
  if (selectedPackageId.value.length == 0) {
    return true
  }
  return selectedPackageId.value.indexOf(result.appsProjectPackage.fId) >= 0
}

const baojians = inject('baojians') //当前项目包件
const packages = ref([]) //确认征集结果日期
const collectionResultDateShow = ref(false) //日期选择modal
const confirmDate = ref(undefined) //选择日期
const confirmPackId = ref('') //选择包件
//加载包件和征集确认日期
function loadPackagesConfirmDate() {
  var and = []
  and.push({
    eq: {
      'appsProjectPackage.fMainId.fId': projectMainId,
    },
  })
  if (selectedPackageId.value.length > 0) {
    and.push({
      in: {
        'appsProjectPackage.fId': selectedPackageId.value,
      },
    })
  }
  api
    .packageList({
      query: and,
    })
    .then(function (res) {
      if (res.status == 200) {
        packages.value = []
        for (var i = 0; i < res.data.list.length; i++) {
          var pack = res.data.list[i].appsProjectPackage
          var has = packages.value.filter(val => {
            return val.fId === pack.fId
          })
          if (has.length > 0){
            continue;
          }
          packages.value.push({
            fId: pack.fId,
            fName: pack.fName,
            fIndex: pack.fIndex,
            fConfirmCollectionResultDate: pack.fConfirmCollectionResultDate
              ? pack.fConfirmCollectionResultDate.substr(0, 10)
              : undefined,
          })
        }
      }
    })
}
//确认征集结果日期标题行
const confirmCollectionResultDateTr = [
  {
    key: 'fName',
    title: '包件',
    render(row) {
      return '包件' + row.fIndex + ':' + row.fName
    },
  },
  {
    key: 'fConfirmCollectionResultDate',
    title: '确认征集结果日期',
  },
]
if (props.data.isManager && props.data.fAuditStatus == '1') {
  confirmCollectionResultDateTr.push({
    key: 'option',
    title: '操作',
    render(row) {
      if (finishDocumentation.value || row.fConfirmCollectionResultDate) {
        return
      }
      return h(
        NButton,
        {
          onClick: function () {
            collectionResultDateShow.value = true
            confirmDate.value = row.fConfirmCollectionResultDate
            confirmPackId.value = row.fId
          },
        },
        '填写',
      )
    },
  })
}

loadPackagesConfirmDate()
watch(
  () => baojians,
  (New, Old) => {
    loadPackagesConfirmDate()
  },
  {
    deep: true,
  },
)
watch(
  () => selectedPackageId,
  (New, Old) => {
    loadPackagesConfirmDate()
  },
  {
    deep: true,
  },
)

//保存确认征集结果日期
async function saveConfirmDate() {
  var collectionResult = []
  await api
    .packageList({
      query: {
        eq: {
          'appsProjectPackage.fMainId.fId': projectMainId,
        },
      },
    })
    .then(async function (res) {
      if (res.status == 200) {
        for (var i = 0; i < res.data.list.length; i++) {
          var temp = res.data.list[i]
          var notes =
            '奖金：' +
            temp.appsCollectionResultDetail.fPrice +
            '（万元）；评审排序' +
            temp.appsCollectionResultDetail.fIndex
          var detail = await api.detailLoad({
            fId: temp.appsCollectionResultDetail.fId,
          })
          collectionResult.push({
            packageIndex: temp.appsProjectPackage.fIndex,
            companyId: detail.data.fCompany.fId,
            collectionPrice: temp.appsCollectionResultDetail.fCollectionPrice,
            notes: notes,
          })
        }
      }
    })

  var bidDate = []
  await api
    .projectPackageList({
      query: {
        eq: {
          'fMainId.fId': projectMainId,
        },
      },
    })
    .then(function (res) {
      if (res.status == 200) {
        for (var i = 0; i < res.data.list.length; i++) {
          if (confirmPackId.value == res.data.list[i].fId) {
            bidDate.push({
              packageIndex: res.data.list[i].fIndex,
              noticeDate: confirmDate.value,
            })
          } else {
            bidDate.push({
              packageIndex: res.data.list[i].fIndex,
              noticeDate: res.data.list[i].fConfirmCollectionResultDate
                ? res.data.list[i].fConfirmCollectionResultDate.substring(0, 10)
                : '',
            })
          }
        }
      }
    })
  interfaceUtil.collectionResultPush(
    projectMainId,
    props.data.fProtocolNo,
    collectionResult,
    bidDate,
  )
  api
    .projectPackageSave({
      fId: confirmPackId.value,
      fConfirmCollectionResultDate: confirmDate.value,
    })
    .then(function (res) {
      loadPackagesConfirmDate()
      collectionResultDateShow.value = false
    })
}

const writtenReportIsoId = ref("")
function getWrittenReportIsoId(id){
  var query = {
    query: {
      and: [
        {"eq": {"fProjectId": id}},
        {"eq": {"fStatus": "30"}},
        {"eq": {"fAchievementName": "书面报告"}}
      ]
    },
    sort: ["fFinishTime desc"]
  }
  api.isoApprovalList(query).then(function(res){
    if (res.data.list.length > 0) {
      writtenReportIsoId.value = res.data.list[0].fId
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
      '&name=书面报告', '_blank'
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
        {"eq": {"fAchievementName": "书面报告"}},
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
</script>

<style></style>
