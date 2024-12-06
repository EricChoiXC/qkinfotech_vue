<template>
  <!-- 遍历 projectPackages 数组 -->
  <!--  <n-tabs type="line" animated v-for="item in data.projectPackages">
    <n-tab-pane :key="item.fId" :name="item.fName" :tab="item.fName">
      <n-list>
        <n-list-item>
          <n-thing title="" content-style="margin-top: 10px;">
            <div v-for="companyName in companiesByPackageId[item.fId]" :key="companyName">
              {{ companyName }}<br>
            </div>
          </n-thing>
        </n-list-item>
      </n-list>
    </n-tab-pane>
    <template #suffix>
      <n-button @click="changeResult(item)">修改</n-button>
    </template>
  </n-tabs> -->

  <n-table :single-line="false">
    <tr v-for="item in data.projectPackages" v-show="showTr(item)">
      <td style="width: 20%">
        包件{{ item.fIndex }}:{{ item.fName }}<br />
        <n-button
          @click="changeResult(item)"
          style="margin-top: 10px"
          v-if="props.isManager"
          >修改</n-button
        >
      </td>
      <td style="width: 80%">
        <!-- <div v-if="companiesByPackageId"  v-for="companyName in companiesByPackageId[item.fId]" :key="companyName"> -->
        <!-- <div v-for="cp in data.companyPackages" v-if="cp.fPackageId && cp.fPackageId.fId == item.fId"> -->
        <div v-for="cp in data.companyPackages">
          <div v-if="cp.fPackageId && cp.fPackageId.fId == item.fId">
            {{ cp.fCompanyId.fName }}；
          </div>
        </div>
      </td>
    </tr>
  </n-table>

  <n-modal
    style="width: 60%"
    v-model:show="editShow"
    preset="dialog"
    :mask-closable="false"
  >
    <template #header>
      <span>编辑入围结果&nbsp;&nbsp;</span>
      <span
        v-if="hasNoPreMeetingPack"
        style="color: red; font-size: 16px; font-weight: bold"
        >请检查是否有资格预审会议！</span
      >
    </template>
    <n-grid :y-gap="20" :cols="1">
      <n-gi>
        <n-transfer
          :show-selected="false"
          ref="transfer"
          v-model:value="selectedValues"
          virtual-scroll
          :options="bidCompany"
          source-filterable
        />
      </n-gi>
      <n-gi>
        <n-space justify="center">
          <n-button type="success" @click="submitSelectedValues">确认</n-button>
        </n-space>
      </n-gi>
    </n-grid>
  </n-modal>
</template>
<script setup>
import createApi from './api'
import { onMounted, reactive, defineExpose, inject, ref } from 'vue'
import { useMessage } from 'naive-ui'
import interfaceUtilApi from '@/utils/interfaceUtil'
import {useMenuStore} from '@/store/menu.js'
const menuStore = useMenuStore()

const currentInstance = getCurrentInstance()
const api = createApi(currentInstance)
const interfaceUtil = interfaceUtilApi(currentInstance)
const message = useMessage()
const props = defineProps({
  isManager: Boolean,
})

const hasNoPreMeetingPack = ref(false)
const route = useRoute()
const fProjectId = menuStore.currentRouteObj.urlParams.fId
const data = reactive([
  {
    projectPackages: [],
    companyPackages: [],
    companyBidList: [],
  },
])

const companiesByPackageId = computed(() => {
  const map = {}
  if (!data.companyPackages) {
    return
  }
  data.companyPackages.forEach((company) => {
    var name = company.fCompanyId.fName
    if (!map[company.fPackageId.fId]) {
      map[company.fPackageId.fId] = []
    }
    map[company.fPackageId.fId].push(name)
  })
  return map
})

// 存储当前选中的公司ID
const selectedValues = ref([])

// 创建所有公司的选项列表
const bidCompany = ref([])

//当前修改的入围结果包件
const editPackageId = ref('')

// 当点击修改按钮时，设置 selectedValues
async function changeResult(item) {
  editPackageId.value = item.fId
  bidCompany.value.length = 0
  selectedValues.value.length = 0
  await List.allCompanyPackage(fProjectId)
  data.companyBidList.map((a) => {
    if (a.fPackageCode.includes(item.fId)) {
      bidCompany.value.push({
        value: a.fApplyId,
        label: a.fApplyName,
      })
    }
  })
  const seenFIds = new Map()
  bidCompany.value = bidCompany.value.filter((item) => {
    if (!seenFIds.has(item.value)) {
      seenFIds.set(item.value, true)
      return true
    }
    return false
  })
  editShow.value = true
  if (companiesByPackageId.value[item.fId]) {
    selectedValues.value = companiesByPackageId.value[item.fId]
      .map((companyName) => {
        // 这里需要找到对应的公司ID
        const company = data.companyPackages.find(
          (c) => c.fCompanyId.fName === companyName,
        )
        return company ? company.fCompanyId.fId : null
      })
      .filter((id) => id !== null)
  }
  console.log(bidCompany.value)
}
const editShow = ref(false)
const companyOptions = reactive([])
const List = {
  //项目所有包件
  allProjectPackage: async (id) => {
    var query = []
    query.push({
      eq: {
        'fMainId.fId': id,
      },
    })
    await api
      .projectPackageList({
        query: query,
      })
      .then((res) => {
        data.projectPackages = res.data.list
      })
    //2024-09-10 增加逻辑：有非资格预审公告包件可见：只有资格预审公告的包件，还需要有资格预审会议才可见；无公告不可见
    var noPrePacksList = await api.noticePackageList({
      query: {
        and: [
          { eq: { 'fMain.fProjectId.fId': id } },
          { eq: { 'fMain.fIsPrequalification': 'false' } },
        ],
      },
    })
    //非资格预审公告包件
    var noPrePacks = noPrePacksList.data.list.map((val) => val.fPackage.fId)
    var onlyPrePacksList = await api.noticePackageList({
      query: {
        and: [
          { eq: { 'fMain.fProjectId.fId': id } },
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
          { eq: { 'fMeetingType.fName': '资格预审会' } },
          { eq: { 'fMainId.fId': id } },
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
    //增加show标记
    for (var i = 0; i < data.projectPackages.length; i++) {
      if (
        noPrePacks.includes(data.projectPackages[i].fId) ||
        hasPreMeetingPacks.includes(data.projectPackages[i].fId)
      ) {
        data.projectPackages[i].show = true
      } else {
        data.projectPackages[i].show = false
        hasNoPreMeetingPack.value = true
      }
    }
  },
  //包件公司
  allCompanyPackage: async (id) => {
    var query = []
    query.push({
      eq: {
        'fProjectId.fId': id,
      },
    })
    await api
      .finaliaztionResultPackageList({
        query: query,
      })
      .then((res) => {
        data.companyPackages = res.data.list
      })
  },
  companyBid: async (id) => {
    await api
      .noticeCompanyBidList({
        query: { eq: { 'fMain.fProjectId.fId': id } },
      })
      .then((res) => {
        data.companyBidList = res.data.list
      })
  },
}

watch(
  () => menuStore.currentRouteObj.urlParams.fId,
  (New, Old) => {
    if (menuStore.currentRouteObj.urlParams.fId) {
      List.allProjectPackage(menuStore.currentRouteObj.urlParams.fId)
      List.allCompanyPackage(menuStore.currentRouteObj.urlParams.fId)
      List.companyBid(menuStore.currentRouteObj.urlParams.fId)
    }
  },
  {
    deep: true,
  },
)

const meetingData = inject('meetingData')
watch(
  () => meetingData,
  (val) => {
    if (menuStore.currentRouteObj.urlParams.fId) {
      List.allProjectPackage(menuStore.currentRouteObj.urlParams.fId)
      List.allCompanyPackage(menuStore.currentRouteObj.urlParams.fId)
      List.companyBid(menuStore.currentRouteObj.urlParams.fId)
    }
  },
  {
    deep: true,
  },
)

onMounted(() => {
  if (fProjectId !== undefined) {
    List.allProjectPackage(fProjectId)
    List.allCompanyPackage(fProjectId)
    List.companyBid(fProjectId)
  }
})

//检测入围结果显示项目启动会按钮
const checkProjectNomination = inject('checkProjectNomination')

async function submitSelectedValues() {
  var projectNo = ''
  await api.projectMainLoad({ fId: fProjectId }).then(function (res) {
    projectNo = res.data.fProtocolNo
  })
  var packageIndex = ''
  await api
    .projectPackageLoad({ fId: editPackageId.value })
    .then(function (res) {
      packageIndex = res.data.fIndex
    })

  var packages = []
  await api
    .projectPackageList({
      query: { eq: { 'fMainId.fId': fProjectId } },
    })
    .then(function (res) {
      if (res.status == 200) {
        for (var i = 0; i < res.data.list.length; i++) {
          packages.push(res.data.list[i].fIndex)
        }
      }
    })
  var updatePackages = {}
  updatePackages[packageIndex] = selectedValues.value

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
  api
    .projectShortlistUpdatePackageFinalization({
      projId: menuStore.currentRouteObj.urlParams.fId,
      packId: editPackageId.value,
      compIds: selectedValues.value,
    })
    .then(function (res) {
      editShow.value = false
      List.allProjectPackage(menuStore.currentRouteObj.urlParams.fId)
      List.allCompanyPackage(menuStore.currentRouteObj.urlParams.fId)
      List.companyBid(menuStore.currentRouteObj.urlParams.fId)
      checkProjectNomination()
    })
    .catch(function (error) {
      message.error('更新入围结果出错')
    })
}

//包件过滤
const selectedPackageId = inject('selectedPackageId')
const selectedPackageName = inject('selectedPackageName')
function showTr(item) {
  if (item.show == false) {
    return false
  }
  if (selectedPackageId.value.length == 0) {
    return true
  }
  return selectedPackageId.value.indexOf(item.fId) >= 0
}

defineExpose({
  List,
})
</script>

<style></style>
