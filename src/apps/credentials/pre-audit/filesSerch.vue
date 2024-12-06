<template>
  <div class="white-background">
    <n-form
      ref="formRef"
      label-placement="left"
      label-width="120px"
      label-align="left"
      style="background-color: white"
    >
      <n-grid
        :x-gap="0"
        :y-gap="0"
        :cols="3"
        style="background-color: white; margin: 20px"
      >
        <n-grid-item style="margin-top: 20px">
          <n-form-item label="项目编号:" label-style="text-align-last:justify;">
            <n-input
              v-model:value="filters.fProtocolNo"
              @input="getFileList()"
              placeholder="请输入项目编号"
              style="width: 400px"
            />
          </n-form-item>
        </n-grid-item>
        <n-grid-item style="margin-top: 20px">
          <n-form-item label="项目名称:" label-style="text-align-last:justify;">
            <n-input
              v-model:value="filters.fProjectName"
              type="text"
              style="width: 400px"
              @input="getFileList()"
              placeholder="请输入项目名称"
            />
          </n-form-item>
        </n-grid-item>
        <n-grid-item style="margin-top: 20px">
          <n-form-item label="项目经理:" label-style="text-align-last:justify;">
            <!-- <n-input v-model:value="filters.fProjectManager" type="text" style="width: 400px" @input="getFileList()"
              placeholder="请输入项目经理" /> -->
            <n-input-group style="width: 400px">
              <formAddress
                :fElement="filters.fProjectManager"
                status="edit"
                @searchModal="getFileList()"
                orgType="ORG_TYPE_PERSON"
              ></formAddress>
            </n-input-group>
          </n-form-item>
        </n-grid-item>
        <n-grid-item>
          <n-form-item
            label="单位注册名称:"
            label-style="text-align-last:justify;"
          >
            <n-input
              type="text"
              style="width: 400px"
              v-model:value="filters.fCompanyName"
              @input="getFileList()"
              placeholder="请输入单位注册名称"
            />
          </n-form-item>
        </n-grid-item>
        <n-grid-item>
          <n-form-item
            label="设计师总人数:"
            label-style="text-align-last:justify;"
          >
            <n-input-group>
              <n-select
                v-model:value="filters.fDesignersTotalType"
                style="width: 100px"
                :options="selectOptions"
                @update:value="getFileList()"
              />
              <n-input
                type="number"
                style="width: 300px"
                v-model:value="filters.fDesignersTotal"
                @input="getFileList()"
                placeholder="请输入设计师总人数"
              />
            </n-input-group>
          </n-form-item>
        </n-grid-item>
        <n-grid-item>
          <n-form-item
            label="主创设计师姓名:"
            label-style="text-align-last:justify;"
          >
            <n-input
              type="text"
              style="width: 400px"
              v-model:value="filters.fName"
              @input="getFileList()"
              placeholder="请输入主创设计师姓名"
            />
          </n-form-item>
        </n-grid-item>

        <n-grid-item span="3">
          <n-button
            @click="toggleExpand"
            type="info"
            size="small"
            style="margin-left: 91%; background-color: #41709f"
          >
            {{ isExpanded ? '收起筛选' : '展开筛选' }}
          </n-button>
        </n-grid-item>

        <n-grid-item
          v-if="isExpanded"
          span="3"
          style="display: flex; align-items: center; margin-top: 20px"
        >
          <div style="flex: 1; margin-right: 20px">
            <n-form-item label="">
              <span
                style="
                  display: block;
                  width: 200px;
                  text-align-last: justify;
                  margin-right: 10px;
                "
                >设计资格或资质的种类/级别:</span
              >
              <n-input
                type="text"
                style="width: 500px"
                v-model:value="filters.fDesignQualificationTypeOrLevel"
                @input="getFileList()"
                placeholder="请输入设计资格或资质的种类/级别"
              />
            </n-form-item>
          </div>
          <div style="flex: 1">
            <n-form-item label="">
              <span
                style="
                  display: block;
                  width: 200px;
                  text-align-last: justify;
                  margin-right: 10px;
                "
                >职称/执业资格(主创设计师):</span
              >
              <n-input
                type="text"
                style="width: 500px"
                v-model:value="filters.fProfessionalQualification"
                @input="getFileList()"
                placeholder="请输入职称/执业资格(主创设计师)"
              />
            </n-form-item>
          </div>
        </n-grid-item>

        <n-grid-item
          v-if="isExpanded"
          span="3"
          style="display: flex; align-items: center"
        >
          <div style="flex: 1; margin-right: 20px">
            <n-form-item label="">
              <span
                style="
                  display: block;
                  width: 200px;
                  text-align-last: justify;
                  margin-right: 10px;
                "
                >国别（主创设计师）:</span
              >
              <n-input
                type="text"
                style="width: 500px"
                v-model:value="filters.fCountry"
                @input="getFileList()"
                placeholder="请输入国别（主创设计师）"
              />
            </n-form-item>
          </div>
          <div style="flex: 1">
            <n-form-item label="">
              <n-input-group>
                <span
                  style="
                    display: block;
                    width: 200px;
                    text-align-last: justify;
                    margin-right: 10px;
                  "
                  >请输入从业年限(主创设计师):</span
                >
                <!-- <n-input type="text" style="width: 500px" v-model:value="filters.fExperienceYears" @input="getFileList()"
                placeholder="请输入请输入从业年限（主创设计师）" /> -->
                <n-select
                  v-model:value="filters.fExperienceYearsType"
                  style="width: 100px"
                  :options="selectOptionsYear"
                  @update:value="getFileList()"
                />
                <n-input-number
                  style="width: 364px"
                  v-model:value="filters.fExperienceYears"
                  @update:value="getFileList()"
                  placeholder="请输入请输入从业年限（主创设计师）"
                  :show-button="false"
                >
                  <!-- <template #suffix>
                    年
                  </template> -->
                </n-input-number>
                <n-input-group-label>年</n-input-group-label>
              </n-input-group>
            </n-form-item>
          </div>
        </n-grid-item>

        <n-grid-item
          v-if="isExpanded"
          span="3"
          style="display: flex; align-items: center"
        >
          <div style="flex: 1; margin-right: 20px">
            <n-form-item label="">
              <span
                style="
                  display: block;
                  width: 200px;
                  text-align-last: justify;
                  margin-right: 10px;
                "
                >业主名称（主创设计师业绩）:</span
              >
              <n-input
                type="text"
                style="width: 500px"
                v-model:value="filters.fOwnerName"
                @input="getFileList()"
                placeholder="请输入业主名称（主创设计师业绩）"
              />
            </n-form-item>
          </div>
          <div style="flex: 1">
            <n-form-item label="">
              <span
                style="
                  display: block;
                  width: 200px;
                  text-align-last: justify;
                  margin-right: 10px;
                "
                >地点（主创设计师业绩）:</span
              >
              <n-input
                type="text"
                style="width: 500px"
                v-model:value="filters.fProjectPlace"
                @input="getFileList()"
                placeholder="请输入地点（主创设计师业绩）"
              />
            </n-form-item>
          </div>
          <!-- <div style="flex: 1;">
            <n-form-item label="">
              <span
                style="display: block; width: 200px;  text-align-last:justify;margin-right: 10px;">项目规模(主创设计师业绩):</span>
              <n-input type="text" style="width: 500px" v-model:value="filters.fNorm" @input="getFileList()"
                placeholder="请输入项目规模(主创设计师业绩)" />
            </n-form-item>
          </div> -->
        </n-grid-item>

        <n-grid-item
          v-if="isExpanded"
          span="3"
          style="display: flex; align-items: center"
        >
          <!-- <div style="flex: 1; margin-right: 20px;">
            <n-form-item label="">
              <span
                style="display: block; width: 200px; text-align-last:justify; margin-right: 10px;">功能(主创设计师业绩):</span>
              <n-input type="text" style="width: 500px" v-model:value="filters.fFunctionality" @input="getFileList()"
                placeholder="请输入功能(主创设计师业绩):" />
            </n-form-item>
          </div> -->
        </n-grid-item>

        <n-grid-item span="3">
          <n-divider />
        </n-grid-item>

        <n-grid-item style="margin-left: 90%; margin-bottom: 20px" span="3">
          <n-button
            @click="exportFile"
            type="info"
            style="background-color: #41709f"
            >导出</n-button
          >
          <n-button
            @click="downloadFile"
            type="info"
            style="background-color: #41709f; margin-left: 10px"
            >下载</n-button
          >
        </n-grid-item>
        <n-grid-item span="3">
          <n-data-table
            :columns="columns"
            :data="fileInfos.value"
            :bordered="false"
            :row-key="(row) => row"
            :checked-row-keys="checkedRowKeys"
            @update:checked-row-keys="handleCheck"
          />
        </n-grid-item>
      </n-grid>
    </n-form>
  </div>
  <n-modal
    style="width: 90%"
    v-model:show="attachmentView"
    preset="dialog"
    title="文件预览"
  >
    <attachmentViewer
      :id="attachmentId"
      :type="attachmentType"
    ></attachmentViewer>
  </n-modal>
</template>

<script setup>
import { reactive } from 'vue'
import { NForm, NFormItem, NInput, useDialog, useMessage } from 'naive-ui'
import createApi from './api'
import { Axis } from 'echarts'
import baseUrl from '@/utils/baseUrl'
import * as XLSX from 'xlsx'
import attachmentViewer from '@/apps/common/attachment/attachmentViewer.vue'
import formAddress from '@/apps/common/address/formAddress.vue'

const api = createApi(getCurrentInstance())
const dialog = useDialog()
const message = useMessage()

const attachmentView = ref(false)
const attachmentId = ref('')
const attachmentType = ref('')

const selectOptions = [
  {
    label: '=',
    value: '=',
  },
  {
    label: '>',
    value: '>',
  },
  {
    label: '<',
    value: '<',
  },
]

const selectOptionsYear = [
  {
    label: '=',
    value: '=',
  },
  {
    label: '>',
    value: '>',
  },
  {
    label: '<',
    value: '<',
  },
]

const filters = reactive({
  //本地数据库
  fProtocolNo: '',
  fProjectName: '',
  fProjectManager: {},

  //AppsSupplierInfo
  fCompanyName: '',
  fDesignersTotal: '',
  fDesignersTotalType: '=',
  fDesignQualificationTypeOrLevel: '',
  fCountry: '',

  //设计师名称 AppsDesignerMain
  fName: '',
  fProfessionalQualification: '',
  fExperienceYears: '',
  fExperienceYearsType: '>',

  //业主名称（主创设计师业绩） AppsDesignerAchievement
  fOwnerName: '',
  fNorm: '',
  fFunctionality: '',
  fProjectPlace: '',
})

/**分页 */
const page = reactive({
  page: 1,
  pageSize: 2,
  showSizePicker: true,
  pageSizes: [2, 10, 15],
  onChange: (newPage) => {
    page.page = newPage // 直接更新 page 对象内的 page 属性
  },
  onUpdatePageSize: (newPageSize) => {
    page.pageSize = newPageSize // 更新 pageSize
    page.page = 1 // 重置 page 到第一页
  },
})

const columns = [
  {
    type: 'selection',
    width: 100, // 可以设置宽度
  },
  {
    title: '序号',
    key: 'index',
    width: '10%',
    align: 'center',
    render(row, index) {
      return index + 1
    },
  },
  {
    title: '项目名称',
    key: 'fProjectId.fName',
    width: '40%',
    align: 'center',
  },
  {
    title: '项目编号',
    key: 'fProjectId.fProtocolNo',
    width: '10%',
    align: 'center',
  },
  {
    title: '文件名称',
    key: 'fFile.fFileName',
    width: '40%',
    align: 'center',
    render(row, index) {
      return h(
        NButton,
        {
          text: true,
          onClick: function () {
            attachmentId.value = row.fFile.fId
            attachmentType.value = row.fFileName.split('.').pop()
            attachmentView.value = true
          },
        },
        row.fFileName,
      )
    },
  },
]

const checkedRowKeys = ref([])

let fileInfos = reactive([])
const handleCheck = (keys, rows) => {
  checkedRowKeys.value = keys
}

watch(checkedRowKeys, (newValue, oldValue) => {})

// 构建查询条件
function buildQuery(filters, filterKeys) {
  const query = []
  filterKeys.forEach((key) => {
    if (filters[key] !== '') {
      if (key === 'fDesignersTotal') {
        query.push({
          eq: {
            [key]: filters[key],
          },
        })
      } else {
        query.push({
          contains: {
            [key]: filters[key],
          },
        })
      }
    }
  })
  return query.length > 0
    ? [
        {
          and: query,
        },
      ]
    : null
}

// projectQuery
function projectQuery(filters, filterKeys) {
  const query = []
  filterKeys.forEach((key) => {
    if (filters[key] !== '') {
      if (key === 'fProjectName') {
        query.push({
          contains: {
            ['fProjectId.fName']: filters[key],
          },
        })
      } else if (key === 'fProjectManager') {
        query.push({
          contains: {
            ['fProjectId.fDeptManager.fName']: filters[key],
          },
        })
      } else {
        query.push({
          contains: {
            ['fProjectId.' + key]: filters[key],
          },
        })
      }
    }
  })
  return query.length > 0
    ? [
        {
          and: query,
        },
      ]
    : null
}

// 发送请求
// async function sendRequest(url, query) {
//   if (query) {
//     const response = await axios.post(url, {
//       query,
//     })
//     return response.data // 返回响应数据
//   }
//   return null
// }

function extractCommonSupplierIds(responses) {
  // 提取所有的 fSupplierId.fId，并转换为 Set 以自动去重
  const allSupplierIdSets = responses.map(
    (response) =>
      new Set(response.data.list.map((item) => item.fSupplierId.fId.trim())),
  )
  if (allSupplierIdSets.length === 0) {
    return []
  }
  // 使用 reduce 函数来找出所有集合的交集
  let commonSupplierIds = allSupplierIdSets[0] // 从第一个集合开始
  for (let i = 1; i < allSupplierIdSets.length; i++) {
    commonSupplierIds = new Set(
      [...commonSupplierIds].filter((id) => allSupplierIdSets[i].has(id)),
    )
    if (commonSupplierIds.size === 0) {
      // 如果没有共同的 ID，则直接返回空数组
      return []
    }
  }

  // 将 Set 转换回数组
  return Array.from(commonSupplierIds)
}

/**supplierMain id-->supplierId */
function projectIdToSupplierId(data) {
  return {
    ...data,
    data: {
      ...data.data,
      list: data.list.map((item) => ({
        ...item,
        fSupplierId: {
          fId: item.fId,
        },
        fProjectId: {
          ...item.fProjectId,
        },
      })),
    },
  }
}

const controller = new AbortController()
// 查询方法
const getFileList = async () => {
  if (
    filters.fProtocolNo === '' &&
    filters.fProjectName === '' &&
    (typeof filters.fProjectManager.fId === 'undefined' ||
      filters.fProjectManager.fId === '') &&
    filters.fCompanyName === '' &&
    filters.fDesignersTotal === '' &&
    filters.fName === '' &&
    filters.fDesignQualificationTypeOrLevel === '' &&
    filters.fProfessionalQualification === '' &&
    filters.fCountry === '' &&
    filters.fOwnerName === '' &&
    filters.fNorm === '' &&
    filters.fFunctionality === '' &&
    filters.fProjectPlace === '' &&
    (filters.fExperienceYears === '' || filters.fExperienceYears === null)
  ) {
    fileInfos.value = []
    return
  }

  try {
    const SupplierFileList = await api.supplierMainGetSupplierFileList({
      fProtocolNo: filters.fProtocolNo,
      fProjectName: filters.fProjectName,
      fProjectManager: filters.fProjectManager.fId,
      fCompanyName: filters.fCompanyName,
      fDesignersTotalType: filters.fDesignersTotalType,
      fDesignersTotal: filters.fDesignersTotal,
      fName: filters.fName,
      fDesignQualificationTypeOrLevel: filters.fDesignQualificationTypeOrLevel,
      fProfessionalQualification: filters.fProfessionalQualification,
      fCountry: filters.fCountry,
      fOwnerName: filters.fOwnerName,
      fNorm: filters.fNorm,
      fFunctionality: filters.fFunctionality,
      fProjectPlace: filters.fProjectPlace,
      fExperienceYears: filters.fExperienceYears,
      fExperienceYearsType: filters.fExperienceYearsType,
    })

    fileInfos.value = []
    SupplierFileList.data.list.forEach((rst) => {
      fileInfos.value.push({
        fProjectId: {
          fProtocolNo: rst[1],
          fName: rst[0],
        },
        fFile: {
          fFileName: rst[2],
          fId: rst[3],
        },
        fFileName: rst[2],
      })
    })
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}

/**预览 */
const viewFile = async () => {
  const transformedArray = transformArray(checkedRowKeys.value)
}
/** 下载 */
const downloadFile = async () => {
  if (checkedRowKeys.value.length == 0) {
    if (fileInfos.length == 0) {
      message.error('信息为空！')
      return
    }
    dialog.warning({
      title: '提示',
      content: '未选择文件，是否全部下载？',
      positiveText: '是',
      negativeText: '否',
      onPositiveClick: () => {
        const fileIds = fileInfos.map((item) => item.fFile.fId)
        window.open(
          baseUrl.pmUrl + '/pm/file/downloadAll?fIds=' + fileIds,
          '_target',
        )
      },
      onNegativeClick: () => {
        return
      },
    })
    return
  }
  const fileIds = checkedRowKeys.value.map((item) => item.fFile.fId)
  window.open(baseUrl.pmUrl + '/pm/file/downloadAll?fIds=' + fileIds, '_target')
}

/**导出 */
const exportFile = async () => {
  if (checkedRowKeys.value.length == 0) {
    if (fileInfos.length == 0) {
      message.error('信息为空！')
      return
    }
    dialog.warning({
      title: '提示',
      content: '未选择文件，是否全部导出？',
      positiveText: '是',
      negativeText: '否',
      onPositiveClick: () => {
        doExport(fileInfos)
      },
      onNegativeClick: () => {
        return
      },
    })
    return
  }
  doExport(checkedRowKeys.value)
}

function doExport(values) {
  var data = []
  var title = ['序号', '项目名称', '项目编号', '文件名称']
  data.push(title)
  for (var i = 0; i < values.length; i++) {
    var line = []
    line.push(i + 1)
    line.push(values[i].fProjectId.fName)
    line.push(values[i].fProjectId.fProtocolNo)
    line.push(values[i].fFileName)
    data.push(line)
  }
  try {
    const sheet = XLSX.utils.aoa_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, sheet, 'Sheet1')
    XLSX.writeFile(wb, '文件搜索.xlsx')
  } catch (e) {
    message.error('导出失败，请重试！')
  }
}

// 预览参数
function transformArray(array) {
  return array.map((item) => ({
    fFileLink: `${item.fFileLink}?fId=${item.fFile.fId}`,
    fType: item.fFile.fFileName.split('.').pop(),
  }))
}

const isExpanded = ref(false)
/**展开筛选操作 */
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
.white-background {
  background-color: white;
}

/* 自定义样式以实现两端对齐 */
.n-form-item__label {
  text-align: justify;
  text-justify: inter-word;
}

/* 如果需要的话，可以为容器添加一个固定的宽度，以便两端对齐能够生效 */
.n-form-item {
  width: 100%;
}
</style>
