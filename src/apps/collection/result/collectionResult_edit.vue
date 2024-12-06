<template>
  <n-form
    ref="formRef"
    :model="approvalModel"
    label-placement="left"
    label-width="150px"
  >
    <n-grid :cols="1" y-gap="10">
      <n-gi>
        <p style="font-size: 16px; font-weight: bold">征集结果</p>
      </n-gi>
      <n-gi>
        <n-table :single-line="false">
          <tbody>
            <tr>
              <td style="width: 20%" class="tdcenter" colspan="2">
                <n-form-item>
                  <n-space
                    vertical
                    style="position: relative; bottom: 65px; right: 5px"
                  >
                    <n-button type="info" @click="addDetail">添加单位</n-button>
                    <n-button type="info" @click="importCompanyDetailAndPackage"
                      >数据导入</n-button
                    >
                  </n-space>
                  <div style="width: 100%; height: 200px; overflow: auto">
                    <n-data-table v-model:data="resultData" :columns="columns">
                    </n-data-table>
                  </div>
                </n-form-item>
              </td>
            </tr>
            <tr>
              <td style="width: 20%" class="tdcenter">总金额</td>
              <td class="tdleft">
                <n-form-item label=""> {{ fTotal }}万元 </n-form-item>
              </td>
            </tr>
          </tbody>
        </n-table>
      </n-gi>
      <n-gi style="display: flex; justify-content: center">
        <n-space>
          <n-button type="primary" @click="submit">提交</n-button>
          <n-button type="error" @click="closeResult">取消</n-button>
        </n-space>
      </n-gi>
    </n-grid>
  </n-form>

  <!-- 添加模态窗口组件 -->
  <n-modal
    v-model:show="showModal"
    style="width: 70%; height: 100%"
    preset="card"
  >
    <template #header>
      <span>选择包件</span>
    </template>
    <template #default>
      <n-form
        ref=""
        inline
        :label-width="80"
        :model="formpackageValueValue"
        label-placement="left"
      >
        <n-form-item label="包件名称:" path="name">
          <n-input
            v-model:value="packageValue.name"
            placeholder="包件名称查询"
            @input="methods.projectPackageList"
          />
        </n-form-item>
        <n-form-item>
          <n-button
            attr-type="button"
            @click="methods.projectPackageList"
            type="primary"
          >
            搜索
          </n-button>
        </n-form-item>
      </n-form>

      <!-- <n-radio-group v-model:value="selectedPackages" @update:value="handlePackageSelection">
        <n-space>
          <n-radio v-for="pkg in packageList" :key="pkg.fId" :value="pkg.fId" :label="pkg.fName" />
        </n-space>
      </n-radio-group> -->

      <n-data-table
        :columns="packageColumns"
        :data="packageList"
        :bordered="false"
        :pagination="packagePagination"
      />
    </template>
  </n-modal>

  <!-- 添加模态窗口组件 -->
  <n-modal
    v-model:show="companyShowModal"
    style="width: 70%; height: 100%"
    preset="card"
    :mask-closable="false"
    @close="onModalClose"
  >
    <template #header>
      <span>选择公司</span>
    </template>
    <template #default>
      <n-form
        ref=""
        inline
        :label-width="80"
        :model="formValue"
        label-placement="left"
      >
        <n-form-item label="公司名称:" path="name" class="inline-form-item">
          <n-input
            v-model:value="formValue.name"
            placeholder="请输入公司名称 "
            @input="methods.companyList"
          />
        </n-form-item>
        <n-form-item>
          <n-button
            attr-type="button"
            @click="methods.companyList"
            type="primary"
          >
            搜索
          </n-button>
        </n-form-item>
      </n-form>
      <n-data-table
        :columns="companyColumns"
        :data="companyIdfNameList"
        :bordered="false"
        :pagination="pagination"
      />
    </template>
  </n-modal>

  <!-- 上传导入文件弹窗-->
  <n-modal
    v-model:show="importFileModal"
    style="width: 60%; height: 80%"
    preset="dialog"
    title="导入"
    :on-after-leave="onCloseImportModal"
  >
    <input
      type="file"
      style="display: none"
      accept=".xls, .xlsx"
      ref="importFile"
      @change="handleFile"
    />
    <n-space vertical>
      <div>
        <n-space>
          <div v-if="file.name">
            <n-alert type="success">
              {{ file.name }}
            </n-alert>
          </div>
          <div v-else>
            <n-alert type="warning"> 未上传导入附件！ </n-alert>
          </div>
        </n-space>
      </div>
      <div>
        <n-space>
          <n-button size="large" type="info" @click="downloadFile"
            >下载导入模板</n-button
          >
          <n-button size="large" type="info" @click="selectFile"
            >上传导入文件</n-button
          >
          <n-button
            size="large"
            type="primary"
            @click="doImport"
            :disabled="!file.name"
            >提交</n-button
          >
        </n-space>
      </div>
      <div>
        <n-alert
          :type="importResultAlertType"
          v-if="importResultMessage"
          class="alert-box"
        >
          {{ importResultMessage }}
        </n-alert>
      </div>
    </n-space>
  </n-modal>
</template>

<script setup>
import { ref, defineComponent, reactive, getCurrentInstance } from 'vue'
import { useMessage } from 'naive-ui'
import createApi from './api'
import {
  NCheckboxGroup,
  NCheckbox,
  NRadioGroup,
  NRadio,
  NSpace,
  NModal,
  useDialog,
} from 'naive-ui'
import interfaceUtilApi from '@/utils/interfaceUtil'
import {useMenuStore} from '@/store/menu.js'
const menuStore = useMenuStore()

const currentInstance = getCurrentInstance()
const api = createApi(currentInstance)
const interfaceUtil = interfaceUtilApi(currentInstance)

const message = useMessage()

//公司模态框
const formValue = reactive({
  name: '',
})
//已有公司列表
const existCompanyList = reactive([])

//包件输入模态框
const packageValue = reactive({
  name: '',
})

/** 模态窗口管理 */
const showModal = ref(false)
const companyShowModal = ref(false)
const selectedPackages = ref([])

const importFileModal = ref(false) //导入modal
const importFile = ref() //上传的导入文件
const file = reactive({}) //文件信息
const importResultAlertType = ref('success')
const importResultMessage = ref('') //导入结果信息

const handlePackageSelection = (value, action) => {
  selectedPackages.value = value
}

const optionVals = ref([])
const baojians = inject('baojians') //当前项目包件
// 初始化选项数组
function initOptionValues() {
  optionVals.value = []
  for (let i = 1; i <= baojians.value.length; i++) {
    optionVals.value.push({
      label: i.toString(),
      value: i,
    })
  }
}

const dialog = useDialog()

const confirmPackageSelection = async (value) => {
  console.log('选中的值：', value)
  selectedPackages.value = value
  // 更新相关的数据或状态
  if (currentRowIndex.value !== undefined) {
    if (resultData[currentRowIndex.value]) {
      // 检查是否已经有相同的包件被选中
      const currentCompany = resultData[currentRowIndex.value].fCompany.fId
      const currentPackage = selectedPackages.value // 单选包件
      const isPackageAlreadySelected = resultData.some((item) => {
        return (
          item.fCompany.fId === currentCompany &&
          item.fSelectedPackages === currentPackage
        )
      })

      if (isPackageAlreadySelected) {
        resultData[currentRowIndex.value].fCollectionPrice = 0
        resultData[currentRowIndex.value].fPrice = 0
        resultData[currentRowIndex.value].fOrder = ''
        alert('该公司已选择该包件，请选择其他包件。')
        return
      } else {
        resultData[currentRowIndex.value].fSelectedPackages = currentPackage
        resultData[currentRowIndex.value].fSelectedPackageName =
          await packageName(currentPackage)
        //设置选中包件行的评审排序数据集
        resultData[currentRowIndex.value].fOrderOptions =
          await loadingPackageOption(currentPackage)
        // 清空 selectedPackages 以便下次使用
        selectedPackages.value = ''
      }
    } else {
      console.error('Invalid index:', currentRowIndex.value)
    }
    currentRowIndex.value = null
    showModal.value = false
  }
}

//项目id
const route = useRoute()
var projectMainId = menuStore.currentRouteObj.urlParams.fId

//公告id
var appsNoticeMain = ''

const columns = [
  {
    key: 'fCompany',
    title: '公司名称',
    render(row, index) {
      return [
        h(NInput, {
          disabled: true,
          value: row.fCompany?.fName,
          placeholder: '请选择',
          style: {
            width: '60%',
          },
        }),
        h(
          NButton,
          {
            onClick: () => {
              companyShowModal.value = true
              // 传递当前索引到模态框，以便在确认时使用
              currentRowIndex.value = index
            },
          },
          '选择',
        ),
      ]
    },
  },
  {
    key: 'fCollectionPrice',
    title: '方案征集费（万元）',
    width: '30px',
    render(row, index) {
      return h(NInputNumber, {
        showButton: false,
        value: row.fCollectionPrice,
        onUpdateValue(v) {
          if (parseFloat(v).toString() == 'NaN') {
            v = 0
          }
          resultData[index].fCollectionPrice = v
          caculateTotal()
        },
      })
    },
  },
  {
    key: 'fPrice',
    title: '奖金（万元）',
    width: '30px',

    render(row, index) {
      return h(NInputNumber, {
        showButton: false,
        value: row.fPrice,
        onUpdateValue(v) {
          if (parseFloat(v).toString() == 'NaN') {
            v = 0
          }
          resultData[index].fPrice = v
          caculateTotal()
        },
      })
    },
  },
  {
    key: 'fOrder',
    title: '评审排序',
    render(row, index) {
      return h(NSelect, {
        value: row.fOrder,
        options: row.fOrderOptions,
        onUpdateValue(v) {
          resultData[index].fOrder = v
        },
      })
    },
  },
  {
    key: 'fRemark',
    title: '备注',
    render(row) {
      return h(NInput, {
        value: row.fRemark,
        placeholder: '请输入备注',
        onUpdateValue(v) {
          row.fRemark = v
        }
      })
    },
  },

  {
    key: 'fSelectedPackageName.fName',
    title: '所选包件',
    render(row) {
      if (row.fSelectedPackageName) {
        return (
          '包件' +
          row.fSelectedPackageName.fIndex +
          ':' +
          row.fSelectedPackageName.fName
        )
      } else {
        return ''
      }
    },
  },
  {
    key: 'fSelectedPackages',
    title: '',
    width: '30px',
    render(row, index) {
      return h(
        NButton,
        {
          onClick: () => {
            currentRowCompanyId.value = row.fCompany.fId
            methods.projectPackageList()
            showModal.value = true
            // 传递当前索引到模态框，以便在确认时使用
            currentRowIndex.value = index
            // 如果这一行已经有包件选择，则预填充 selectedPackages
            selectedPackages.value = row.fSelectedPackages || []
          },
        },
        {
          default: () => '选择包件',
        },
      )
    },
  },

  {
    key: 'actions',
    title: '',
    render(row, index) {
      return h(
        NButton,
        {
          type: 'error',
          size: 'small',
          onClick: () => {
            // 删除当前行
            deleteRow(index)
          },
        },
        {
          default: () => '删除',
        },
      )
    },
  },
]
const companyColumns = [
  {
    title: '公司名称',
    key: 'fName',
  },
  {
    title: '选择',
    width: 120,
    key: 'options',
    render(row) {
      return [
        h(
          NButton,
          {
            onClick: () => {
              confirmCompanySelection(row.fId)
            },
          },
          '选择',
        ),
      ]
    },
  },
]

const packageColumns = [
  {
    title: '包件名称',
    key: 'fName',
    render(row) {
      return '包件' + row.fIndex + ':' + row.fName
    },
  },
  {
    title: '选择',
    width: 120,
    key: 'options',
    render(row) {
      return [
        h(
          NButton,
          {
            onClick: () => {
              confirmPackageSelection(row.fId)
            },
          },
          '选择',
        ),
      ]
    },
  },
]

/**公司分页组件 */
const pagination = reactive({
  page: 1,
  pageSize: 15,
  showSizePicker: true,
  pageSizes: [15, 30, 50],
  onChange: (newPage) => {
    pagination.page = newPage // 直接更新 page 对象内的 page 属性
    methods.companyList()
  },
  onUpdatePageSize: (newPageSize) => {
    pagination.pageSize = newPageSize // 更新 pageSize
    pagination.page = 1 // 重置 page 到第一页
    methods.companyList()
  },
})

/**包件分页组件 */
const packagePagination = reactive({
  page: 1,
  pageSize: 15,
  showSizePicker: true,
  pageSizes: [15, 30, 50],
  onChange: (newPage) => {
    packagePagination.page = newPage // 直接更新 page 对象内的 page 属性
    methods.projectPackageList()
  },
  onUpdatePageSize: (newPageSize) => {
    packagePagination.pageSize = newPageSize // 更新 pageSize
    packagePagination.page = 1 // 重置 page 到第一页
    methods.projectPackageList()
  },
})

const fTotal = ref(0)
const fDetail = ref([])

/**当前行rowID */
const currentRowCompanyId = ref('')

const openReport = ref(true)
// const optionVals = ref([]);

const currentRowIndex = ref(null)

const selectedCompanyId = ref(null) // 保存用户选择的公司 ID

/**公司细节列表数据 */
const resultData = reactive([])

/**公司列表数据*/
const companyIdfNameList = reactive([])

/**包件列表*/
const packageList = reactive([])

/**resultId */
var resultId = ''

function caculateTotal() {
  fTotal.value = 0 // 初始化 fTotal 为0

  for (const row of resultData) {
    // 使用 for...of 循环遍历数组
    fTotal.value += row.fCollectionPrice || 0 // 累加 fCollectionPrice
    fTotal.value += row.fPrice || 0 // 累加 fPrice
  }
}

caculateTotal()

// const selectedCompany = reactive([]);

const emit = defineEmits(['createCollectionResult', 'close'])

function addDetail() {
  // 检查是否有未选择的包件的公司
  const unselectedPackages = resultData.filter(
    (item) =>
      item.fSelectedPackages == undefined || item.fSelectedPackages == '',
  )

  if (unselectedPackages.length > 0) {
    // 显示提示
    alert('你有未填写的包件，请先完成填写再新增行。')
    return // 如果有未选择的包件，则不再继续执行
  }

  // 打开模态窗口
  companyShowModal.value = true
  // 在打开模态窗口之前，先添加一行空白数据
  currentRowIndex.value = resultData.length
  optionVals.value.push({
    label: optionVals.value.length + 1 + '',
    value: optionVals.value.length + 1 + '',
  })
  // showModal.value=true
  // currentRowCompanyId.value=
}

//数据导入
const importCompanyDetailAndPackage = () => {
  importFileModal.value = true
}

/**征集结果id */
var resultMainId = ''

/**init 征集结果 */
/**add 征集结果 */
const initResultFunction = async () => {
  //20240820 一个项目只有一个征集结果，再次新增时读取已有的结果，保存也只保存在这一条征集结果上
  var query = {
    eq: {
      'fMainId.fId': projectMainId,
    },
  }
  await api
    .list({
      query: query,
    })
    .then(async function (res) {
      if (res.status == 200 && res.data.list.length > 0) {
        //已有征集结果，读取征集结果记录
        resultMainId = res.data.list[0].fId
        fTotal.value = parseFloat(res.data.list[0].fTotalPrice)
        var query2 = {
          eq: {
            'fResultId.fId': resultMainId,
          },
        }
        api
          .detailList({
            query: query2,
          })
          .then(async function (res2) {
            if (res2.status == 200) {
              for (var i = 0; i < res2.data.list.length; i++) {
                var query3 = {
                  eq: {
                    'appsCollectionResultDetail.fId': res2.data.list[i].fId,
                  },
                }
                await api
                  .packageList({
                    query: query3,
                  })
                  .then(async function (res3) {
                    if (res3.status == 200) {
                      resultData.push({
                        fId: res2.data.list[i].fId,
                        fOrder: res2.data.list[i].fIndex,
                        fRemark: res2.data.list[i].fRemark,
                        fCollectionPrice: parseFloat(
                          res2.data.list[i].fCollectionPrice,
                        ),
                        fPrice: parseFloat(res2.data.list[i].fPrice),
                        fCompany: {
                          fId: res2.data.list[i].fCompany.fId,
                          fName: res2.data.list[i].fCompany.fName,
                        },
                        fSelectedPackages:
                          res3.data.list[0].appsProjectPackage.fId,
                        fSelectedPackageName: {
                          fId: res3.data.list[0].appsProjectPackage.fId,
                          fName: res3.data.list[0].appsProjectPackage.fName,
                          fIndex: res3.data.list[0].appsProjectPackage.fIndex,
                        },
                        fOrderOptions: await loadingPackageOption(
                          res3.data.list[0].appsProjectPackage.fId,
                        ),
                      })
                    }
                  })
              }
            }
          })
      } else {
        const ress = await api.init()
        resultMainId = ress.data.fId
      }
    })
}

/** 是否有未选中的公司 */
const isCompanyEmpty = function () {
  for (var i = 0; i < resultData.length; i++) {
    if (resultData[i].fCompany === '') {
      return i // 返回未选择公司的行号
    }
  }
  return -1 // 如果所有公司都被选择了，返回 -1 表示没有未选择的公司
}

/** 是否有未填写完整 的信息  */
const isFillCompletely = function () {
  for (var i = 0; i < resultData.length; i++) {
    if (
      resultData[i].fCollectionPrice === 0 ||
      resultData[i].fOrder === '' ||
      resultData[i].fPrice === 0
    ) {
      return i // 返回未选择公司的行号
    }
  }
  return -1 // 如果所有公司都被选择了，返回 -1 表示没有未选择的公司
}

/** 是否有未选择包件的公司  */
const isCompanyWithoutPackage = function () {
  for (var i = 0; i < resultData.length; i++) {
    if (resultData[i].fSelectedPackages.length == 0) {
      return i // 返回未选择公司的行号
    }
  }
  return -1 // 如果所有公司都被选择了，返回 -1 表示没有未选择的公司
}
const submit = async () => {
  const result = {
    fId: resultMainId,
    fMainId: projectMainId,
    fTotalPrice: fTotal.value,
    fConfirmTime: new Date().getTime(),
  }

  /*if(result.fTotalPrice==0||result.fConfirmTime==''){
    alert("请检查是否有未填写的信息")
    return;
  }*/

  /**检查是否有公司未填写 */
  const firstEmptyIndex = isCompanyEmpty()
  if (firstEmptyIndex >= 0) {
    alert('第' + (firstEmptyIndex + 1) + '行公司未选')
    return
  }

  /**检查是否有信息未填写完整 */
  /* const uncompletelyIndex = isFillCompletely();
  if(uncompletelyIndex>=0){
    alert("第" + (uncompletelyIndex + 1) + "行信息未填写完整");
    return;
  } */

  /**检查是否有公司没选择包件 */
  const firstPackageIndex = isCompanyWithoutPackage()
  if (firstPackageIndex >= 0) {
    alert('第' + (firstPackageIndex + 1) + '行包件未选择')
    return
  }

  //推送征集结果 -- start
  var projectNo = ''
  await api.projectMainLoad({ fId: projectMainId }).then(function (res) {
    if (res.status == 200) {
      projectNo = res.data.fProtocolNo
    }
  })
  var collectionResult = []
  for (var i = 0; i < resultData.length; i++) {
    var packageIndex = ''
    await api
      .projectPackageLoad({ fId: resultData[i].fSelectedPackages })
      .then(function (res) {
        packageIndex = res.data.fIndex
      })
    var notes =
      '奖金：' +
      resultData[i].fPrice +
      '（万元）；评审排序：' +
      resultData[i].fOrder
    collectionResult.push({
      companyId: resultData[i].fCompany.fId,
      packageIndex: packageIndex,
      collectionPrice: resultData[i].fCollectionPrice,
      notes: notes,
    })
  }
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
          bidDate.push({
            packageIndex: res.data.list[i].fIndex,
            noticeDate: res.data.list[i].fConfirmCollectionResultDate
              ? res.data.list[i].fConfirmCollectionResultDate.substring(0, 10)
              : '',
          })
        }
      }
    })
  var pushResult = await interfaceUtil.collectionResultPush(
    projectMainId,
    projectNo,
    collectionResult,
    bidDate,
  )

  if (pushResult.STATUS != 'S') {
    message.error(pushResult.MESSAGE)
    return
  }

  //推送征集结果 -- end

  await api.save(result)
  /* 删除旧结果 */
  await api.deleteOldDetail({
    fResultId: resultMainId,
  })
  /**添加 征集结果细节 */
  for (var i = 0; i < resultData.length; i++) {
    /**init 方法 获取result/detailId */
    if (resultData[i].fId == '' || resultData[i].fId == undefined) {
      const resultDetailId = await api.detailInit()
      resultData[i].fId = resultDetailId.data.fId
    }
    resultData[i].fResultId = resultId
    if (resultData[i].fCompany != null) {
      resultData[i].fResultId = resultMainId
      resultData[i].fIndex = resultData[i].fOrder
      await api
        .detailSave(resultData[i])
        .then((res) => {})
        .catch((err) => {
          console.log('err', err)
        })
    }

    await api
      .packageAdd(resultData[i])
      .then((res) => {})
      .catch((err) => {
        console.log('err', err)
      })
  }
  var resultInfo = {
    fDetail: resultData,
    fTotal: fTotal,
    fCreateTime: Date.now(),
  }
  emit('createCollectionResult', resultInfo)
  resultData.length = 0
}

/**取消按钮 */
const closeResult = () => {
  emit('close')
}

const handleCompanySelection = (value, action) => {
  selectedCompanyId.value = value
}

/**公司模态窗口确认 */
function confirmCompanySelection(value) {
  selectedCompanyId.value = value
  // 当用户点击“确定”按钮时触发
  if (selectedCompanyId.value !== null) {
    if (currentRowIndex.value !== undefined) {
      if (currentRowIndex.value >= resultData.length) {
        resultData.push({
          fId: '',
          fCompany: '',
          fOrder: '',
          fCollectionPrice: 0,
          fPrice: 0,
          fRemark: '',
          fSelectedPackages: [], // 初始化包件ID为空数组
        })
      }

      resultData[currentRowIndex.value].fSelectedPackages = ''
      resultData[currentRowIndex.value].fSelectedPackageName = ''
      const selectedCompanyObj = companyIdfNameList.find(
        (company) => company.fId === selectedCompanyId.value,
      )
      if (selectedCompanyObj) {
        // 确保 currentRowIndex 对应的索引存在于 resultData 中
        if (
          currentRowIndex.value >= 0 &&
          currentRowIndex.value < resultData.length
        ) {
          resultData[currentRowIndex.value].fCompany = selectedCompanyObj
        } else {
          console.error('Invalid index:', currentRowIndex.value)
        }
        selectedCompanyId.value = null // 清空 selectedCompanyId 以便下次使用
      } else {
        console.warn('Selected company not found in the list.')
      }
    }
    companyShowModal.value = false // 关闭模态窗口
    currentRowIndex.value = null
  }
}

/**公司模态窗口的 关闭 */
const onModalClose = () => {}

const loadingPackageOptions = (packageId) => {
  return loadingPackageOption(packageId)
}

/** 根据包件id和项目id查询关联的公司列表  */
const loadingPackageOption = async (packageId) => {
  const options = []
  const query = []
  query.push({
    eq: {
      'fProjectId.fId': projectMainId,
    },
  })
  query.push({
    eq: {
      'fPackageId.fId': packageId,
    },
  })
  let res = await api.finaliaztionResultPackageList({
    query: query,
  })
  if (res.status === 200 && res.data.list.length > 0) {
    for (let i = 1; i <= res.data.list.length; i++) {
      options.push({
        label: i.toString(),
        value: i,
      })
    }
  }
  //   .then(async function (res) {
  //   if (res.status === 200 && res.data.list.length > 0) {
  //     for (let i = 1; i <= res.data.list.length; i++) {
  //       options.push({
  //         label: i.toString(),
  //         value: i
  //       });
  //     }
  //   }
  // })
  return options
}

/**result Id */
const methods = {
  /**公司对应包件列表 */
  async projectPackageList() {
    /** 搜索该公司包件 */
    packageList.length = 0
    var query = {
      and: [
        {
          eq: {
            'fCompanyId.fId': currentRowCompanyId.value,
          },
        },
        {
          eq: {
            'fProjectId.Id': projectMainId,
          },
        },
      ],
    }
    const res = await api.finaliaztionResultPackageList({
      query: query,
    })

    let packageData = res.data.list.map((item) => ({
      fId: item.fPackageId.fId,
      fName: item.fPackageId.fName,
      fIndex: item.fPackageId.fIndex,
    }))
    packageList.push(...packageData)

    //** 搜索公司名称 过滤 */
    if (packageValue.name !== '') {
      const filteredList = packageList.filter((item) =>
        item.fName.includes(packageValue.name),
      )
      packageList.length = 0
      packageList.push(...filteredList)
    }
  },

  /**公司列表 */
  async companyList() {
    companyIdfNameList.length = 0 // Clear the list
    const query = [
      {
        eq: {
          'fProjectId.Id': projectMainId,
        },
      },
    ]
    var initCompanylist = []

    const ruweiRes = await api.finaliaztionResultPackageList({
      query: query,
    })

    for (let i = 0; i < ruweiRes.data.list.length; i++) {
      initCompanylist.push(
        await companyName(ruweiRes.data.list[i].fCompanyId.fId),
      )
    }

    await quchong(initCompanylist)
    companyIdfNameList.push(...initCompanylist)
    //** 搜索公司名称 过滤 */
    if (formValue.name !== '') {
      const filteredList = companyIdfNameList.filter((item) =>
        item.fName.includes(formValue.name),
      )
      companyIdfNameList.length = 0
      companyIdfNameList.push(...filteredList)
    }
  },
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

/**包件名称转换 */
const packageName = async (packageId) => {
  try {
    const response = await api.projectPackageLoad({ fId: packageId })
    const packageJson = {
      fName: response.data.fName,
      fId: packageId,
      fIndex: response.data.fIndex,
    }
    return packageJson
  } catch (error) {
    console.error('There was an error!', error)
    throw error // 如果需要可以抛出错误
  }
}

//去重
function quchong(tempArr) {
  let newArr = []
  for (let i = 0; i < tempArr.length; i++) {
    if (newArr.indexOf(tempArr[i].fId) == -1) {
      newArr.push(tempArr[i].fId)
    } else {
      tempArr.splice(i, 1)
      i--
    }
  }
  return tempArr
}

// 删除行的函数
const deleteRow = (index) => {
  // 显示确认对话框
  dialog.warning({
    content: '确定要删除这条记录吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      // 删除行
      resultData.splice(index, 1)
      // 重新计算总和等操作
      caculateTotal()
    },
  })
}

/* 导入数据方法 -- start */
/**
 * 下载导入模板文件
 */
function downloadFile() {
  api
    .detailImportFileDownload(null, { responseType: 'blob' })
    // originAxios({
    //   method: 'post',
    //   responseType: 'blob',
    //   url: baseUrl.pmUrl + '/pm/appsCollectionResult/detailImportFileDownload',
    // })
    .then(function (response) {
      message.info('已导出模板')
      const blob = new Blob([response], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      // 创建一个 <a> 元素，用于保存文件
      const a = document.createElement('a')
      a.href = window.URL.createObjectURL(blob)
      a.download = '征集结果模板.xlsx' // 设置下载的文件名，替换为实际的文件名

      // 将 <a> 元素添加到页面中，并模拟点击下载
      document.body.appendChild(a)
      setTimeout(() => {
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(a.href)
      }, 100)
    })
    .catch(function (response) {
      message.error('导出失败：' + response)
    })
}

/**
 * 选择文件
 */
function selectFile() {
  importFile.value.click()
}

/**
 * 完成文件提交
 */
function handleFile(e) {
  if (e.target.files.length == 1) {
    file.file = e.target.files[0]
    file.name = e.target.files[0].name
    file.type = e.target.files[0].type
    file.size = e.target.files[0].size
  }
}

/**
 * 执行导入
 */
function doImport() {
  //导入提醒 会覆盖当前数据
  dialog.info({
    content: '导入后会覆盖当前已输入的数据，是否继续导入？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      resultData.length = 0
      const formData = {}
      formData.file = file.file
      formData.projectId = projectMainId
      api
        .detailImport(formData, {
          headers: {
            'Content-Type': 'multipart/form-data', // 设置请求头
            ProjectId: projectMainId,
            maxLength: baojians.value.length, //最大包件数
          },
        })
        .then(function (response) {
          message.info('上传完成')
          if (response.result) {
            importResultAlertType.value = 'success'
            importResultMessage.value = '上传成功！'
          } else {
            importResultAlertType.value = 'error'
            importResultMessage.value = response.message
          }
          importSuccessLine(response.successLine)
        })
        .catch(function (response) {
          message.error('上传失败')
          message.error(response)
          importResultAlertType.value = 'error'
          importResultMessage.value = response
        })
    },
  })
}

/**
 * 关闭上传窗口后的调用，方便上传数据后刷新列表页面
 */
function onCloseImportModal() {}

/**
 * 导入成功记录
 */
function importSuccessLine(successLine) {
  fTotal.value = 0
  for (var i = 0; i < successLine.length; i++) {
    var line = successLine[i]
    resultData.push({
      fId: '',
      fCompany: {
        fId: line.companyId,
        fName: line['公司名称'],
      },
      fOrder: line['评审排序'],
      fCollectionPrice: parseInt(line['方案征集费']),
      fPrice: parseInt(line['奖金']),
      fSelectedPackages: line['packageId'],
      fRemark: line['备注'],
      fSelectedPackageName: {
        fId: line['packageId'],
        fName: line['所选包件'],
        fIndex: line['packageIndex']
      },
    })
    fTotal.value += parseInt(line['方案征集费']) + parseInt(line['奖金'])
  }
}

/* 导入数据方法 -- end */

onMounted(async () => {
  // methods.getList();
  methods.projectPackageList()
  methods.companyList()
  initOptionValues()
  initResultFunction()
  // caculateTotal()
})
</script>

<style>
.alert-box {
  white-space: pre-wrap;
}
</style>
