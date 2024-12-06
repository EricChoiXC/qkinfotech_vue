<template>
  <div
    v-if="hasNoPreMeetingPack"
    style="color: red; font-size: 16px; font-weight: bold"
  >
    请检查是否有资格预审会议！
  </div>
  <n-card :bordered="false">
    <n-form ref="formRef" label-placement="left" label-width="150px">
      <n-grid :x-gap="12" :y-gap="8" :cols="2">
        <n-grid-item span="2">
          <div style="text-align: center; width: 100%; margin: auto">
            <n-data-table
              :columns="columns"
              :data="uniqueCompany"
              :pagination="page"
              :row-key="(row) => row.fId"
              @update:checked-row-keys="handleCheck"
            >
            </n-data-table>
          </div>
        </n-grid-item>
        <n-grid-item style="display: flex; justify-content: center" span="2">
          <n-space>
            <n-button type="primary" @click="handleSubmit"> 确定</n-button>
            <n-button type="error" @click="close"> 关闭</n-button>
          </n-space>
        </n-grid-item>
      </n-grid>
    </n-form>
  </n-card>
</template>

<script setup>
import { ref, h, reactive, onMounted, computed, inject } from 'vue'
import { NDataTable, NCheckbox, useMessage } from 'naive-ui'
import createApi from './api'
import interfaceUtilApi from '@/utils/interfaceUtil'
import { useMenuStore } from '@/store/menu'

const emit = defineEmits(['closeResultAdd'])
const currentInstance = getCurrentInstance()
const api = createApi(currentInstance)
const interfaceUtil = interfaceUtilApi(currentInstance)
const message = useMessage()
const menuStore = useMenuStore()
const isAllSelected = ref(false)
const packageIdArray = ref([])
const hasNoPreMeetingPack = ref(false)

const finalizationPack = ref({})

const packageCheckboxGroup = ref({})

const columns = ref([
  {
    title: '公司名称',
    key: 'fApplyName',
    width: '100px',
  },
  /* {
    title: '全选',
    key: 'selectAll',
    width: '60px',
    render: (row) => h(NCheckbox, {
      modelValue: isAllSelected.value,
      'on-update:checked': (newChecked) => {
        handleAllPackageSelection(newChecked, row)
      }
    }),
  }, */
  {
    title: '所选包件',
    key: 'selectedPackages',
    width: '400px',
    render: (row) => {
      for (let i = 0; i < row.fPackageCode.length; i++) {
        packageIdArray.value.push(row.fPackageCode[i])
      }
      const checkboxGroup = ref(null)
      packageCheckboxGroup.value[row.fApplyId] = checkboxGroup
      return h(
        NCheckboxGroup,
        {
          'on-update:value': (newValue) => {
            handlePackageSelection(row, newValue)
          },
          'default-value': finalizationPack.value[row.fApplyId]
            ? finalizationPack.value[row.fApplyId]
            : [],
          ref: checkboxGroup,
          name: 'checkboxGroup_' + row.fApplyId,
        },
        {
          default: () => {
            return data.packageOptions.map((option) => {
              const isDisabled = row.fPackageCode.includes(option.fId)
              return h(NCheckbox, {
                value: option.fId,
                label: '包件' + option.fIndex + ':' + option.fName,
                disabled: !isDisabled,
              })
            })
          },
        },
      )
    },
  },
])

const handleAllPackageSelection = (newChecked, row) => {
  try {
    if (newChecked) {
      var cbGroup = document.getElementsByName('checkboxGroup_' + row.fApplyId)
      if (cbGroup.length > 0) {
        var cbs = cbGroup[0].children
        for (var i = 0; i < cbs.length; i++) {
          if (cbs[i].ariaChecked == 'false') {
            cbs[i].click()
          }
        }
      }
    }
  } catch (e) {}
}

//最后入围结果组成json
const selectedPackages = reactive({})
const handlePackageSelection = (row, newValue) => {
  // packageIdArray.value = newValue;
  // // 确保selectedPackages是一个对象
  if (!selectedPackages.hasOwnProperty(row.fApplyId)) {
    // 如果selectedPackages中没有这个rowId，先创建一个空数组
    selectedPackages[row.fApplyId] = []
  }
  // 更新selectedPackages中特定rowId的值
  selectedPackages[row.fApplyId] = newValue
}
//提交方法
const handleSubmit = async () => {
  var projectNo = ''
  await api.projectMainLoad({ fId: fProjectId }).then(function (res) {
    if (res.status == 200) {
      projectNo = res.data.fProtocolNo
    }
  })
  var packageIndexMap = {}
  var updatePackages = {}
  var packages = []
  await api
    .projectPackageList({
      query: { eq: { 'fMainId.fId': fProjectId } },
    })
    .then(function (res) {
      if (res.status == 200) {
        for (var i = 0; i < res.data.list.length; i++) {
          packageIndexMap[res.data.list[i].fId] = res.data.list[i].fIndex
          updatePackages[res.data.list[i].fIndex] = []
          packages.push(res.data.list[i].fIndex)
        }
      }
    })

  for (var key in selectedPackages) {
    var temp = selectedPackages[key]
    for (var i = 0; i < temp.length; i++) {
      updatePackages[packageIndexMap[temp[i]]].push(key)
    }
  }

  selectedPackages.fProjectId = fProjectId
  //取开始时间最晚的资格预审会议
  var meetingPlace = "";
  var startTime ="";
  var finishTime = "";
  await api
    .preAuditMeetingList({
      sort : ['fMeetingStartTime desc'],
      query: { eq: { 'fMainId.fId': fProjectId } },
    })
    .then(function (res) {
      if (res.status == 200 && res.data.list.length!==0) {
          meetingPlace = res.data.list[0].fMeetingPlace
          startTime = res.data.list[0].fMeetingStartTime
          finishTime = res.data.list[0].fMeetingEndTime
      }
    })

  var pushOaResult = await interfaceUtil.compititionResultPush(
    fProjectId,
    projectNo,
    packages,
    updatePackages,
    meetingPlace,
    startTime,
    finishTime
  )
  if (pushOaResult.STATUS != 'S') {
    message.error(pushOaResult.MESSAGE)
    return
  }

  await api.projectShortlistCompanySave(selectedPackages).then(function (res) {
    checkProjectNomination()
    close()
  })
}

//检测入围结果显示项目启动会按钮
const checkProjectNomination = inject('checkProjectNomination')

//关闭方法
function close() {
  emit('closeResultAdd')
}

const route = useRoute()
const fProjectId = menuStore.currentRouteObj.urlParams.fId
const data = reactive({
  companyBidList: [],
  companyList: [],
  packageOptions: [],
  fCompanyPackages: [],
  uniqueCompany: [],
  packageIdArray: [],
})

// 计算属性，用于生成带有合并后的fPackageId信息的去重fCompany列表
const uniqueCompany = computed(() => {
  const groupedByCompany = {}
  data.companyBidList.forEach((item) => {
    const companyId = item.fId
    if (!groupedByCompany[companyId]) {
      groupedByCompany[companyId] = {
        ...item,
        fPackageIds: [item.fPackageId],
      }
    } else {
      groupedByCompany[companyId].fPackageIds.push(item.fPackageId)
    }
  })
  return Object.values(groupedByCompany)
})

const handleCheck = (rowKeys) => {
  // 更新选中行的 keys
  checkedRowKeysRef.value = rowKeys
}

const findList = {
  companyBid: async () => {
    //查询该项目下的全部的购买标书公司
    await api
      .noticeCompanyBidList({
        query: [
          {
            eq: {
              'fMain.fProjectId.fId': fProjectId,
            },
          },
        ],
      })
      .then(async (res) => {
        //一家公司购买不同公告的不同标书 会有多个记录，需要合并为一条
        const uniqueDataMap = new Map()
        for (const item of res.data.list) {
          //2024-09-10 增加逻辑：有非资格预审公告包件可见：只有资格预审公告的包件，还需要有资格预审会议才可见；无公告不可见
          var noPrePacksList = await api.noticePackageList({
            query: {
              and: [
                { eq: { 'fMain.fProjectId.fId': fProjectId } },
                { eq: { 'fMain.fIsPrequalification': 'false' } },
              ],
            },
          })
          //非资格预审公告包件
          var noPrePacks = noPrePacksList.data.list.map(
            (val) => val.fPackage.fId,
          )
          var onlyPrePacksList = await api.noticePackageList({
            query: {
              and: [
                { eq: { 'fMain.fProjectId.fId': fProjectId } },
                { eq: { 'fMain.fIsPrequalification': 'true' } },
              ],
            },
          })
          //资格预审公告包件（移除了非资格预审公告包件）
          var onlyPrePacks = onlyPrePacksList.data.list
            .map((val) => {
              if (noPrePacks.includes(val.fPackage.fId)) {
                return null
              }
              return val.fPackage.fId
            })
            .filter((val) => val != undefined)
          //所有资格预审会议和包件（只限制了只有资格预审公告包件）
          var preMeetingList = await api.preAuditMeetingList({
            query: {
              and: [
                { contains: { 'fMeetingType.fName': '资格预审' } },
                { eq: { 'fMainId.fId': fProjectId } },
              ],
            },
          })
          var preMeeting = preMeetingList.data.list.map((val) => val.fId)
          var hasPreMeetingPacksList = await api.meetingPackageList({
            query: {
              and: [
                { eq: { 'fMeetingId.fModelName': 'AppsPreAuditMeeting' } },
                { in: { 'fPackageId.fId': onlyPrePacks } },
                { in: { 'fMeetingId.fId': preMeeting } },
              ],
            },
          })
          var hasPreMeetingPacks = hasPreMeetingPacksList.data.list.map(
            (val) => val.fPackageId.fId,
          )
          //未满足条件包件移除fPackageCode
          var fPackageCodes = item.fPackageCode.split(';')
          for (var i = 0; i < fPackageCodes.length; i++) {
            var code = fPackageCodes[i]
            if (
              !hasPreMeetingPacks.includes(code) &&
              !noPrePacks.includes(code)
            ) {
              item.fPackageCode = item.fPackageCode.replace(code, '')
              item.fPackageCode = item.fPackageCode.replace(';;', '')
              hasNoPreMeetingPack.value = true
            }
          }

          if (!uniqueDataMap.has(item.fApplyId)) {
            finalizationPack.value[item.fApplyId] = []
            // 如果fApplyId不存在，直接添加到Map中
            uniqueDataMap.set(item.fApplyId, {
              ...item,
              fPackageCode: new Set(item.fPackageCode.split(';')),
            })
          } else {
            // 如果fApplyId存在，合并fPackageCode
            const existingItem = uniqueDataMap.get(item.fApplyId)
            const newCodes = new Set([
              ...existingItem.fPackageCode,
              ...item.fPackageCode.split(';'),
            ])
            uniqueDataMap.set(item.fApplyId, {
              ...existingItem,
              fPackageCode: newCodes,
            })
          }
        }
        // 将Map转换回数组
        const uniqueDataArray = Array.from(uniqueDataMap.values()).map(
          (item) => {
            return {
              ...item,
              fPackageCode: Array.from(item.fPackageCode).join(';'), // 将Set转换回字符串
            }
          },
        )
        data.companyBidList = uniqueDataArray
      })
  },
  companyList: async () => {
    //入围结果 初始化
    const res = await api
      .projectShortlistCompanyList(fProjectId)
      .then((res) => {
        // data.companyList = res.data;
        if (res.status == 200) {
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].fCompanyId) {
              finalizationPack.value[res.data[i].fCompanyId.fId].push(
                res.data[i].fPackageId.fId,
              )
              handlePackageSelection(
                { fApplyId: res.data[i].fCompanyId.fId },
                finalizationPack.value[res.data[i].fCompanyId.fId],
              )
            }
          }
        }
      })
  },
  packageOptions: async () => {
    //包件选项
    var query = []
    query.push({
      eq: {
        'fMainId.fId': fProjectId,
      },
    })
    await api
      .projectPackageList({
        query: query,
      })
      .then((res) => {
        data.packageOptions = res.data.list
        data.packageOptions.forEach((item) => {
          item.isLocked = true
        })
      })
  },
}

onMounted(async () => {
  await findList.companyBid()
  await findList.companyList()
  await findList.packageOptions()
})

const meetingData = inject('meetingData')
watch(
  () => meetingData,
  async (val) => {
    await findList.companyBid()
    await findList.companyList()
    await findList.packageOptions()
  },
  {
    deep: true,
  },
)
</script>
