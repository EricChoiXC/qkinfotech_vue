<template>
  <n-card :bordered="false">
    <n-form
      ref="formRef"
      :model="formValue"
      :rules="rules"
      label-placement=""
      label-width="150px"
    >
      <n-grid :x-gap="12" :y-gap="8" :cols="2">
        <n-grid-item span="2">
          <n-table :single-line="false">
            <tbody>
              <tr>
                <td style="width: 20%" class="tdcenter">包件信息</td>
                <td class="tdleft">
                  <n-form-item>
                    <n-checkbox-group
                      v-model:value="cities"
                      @update:value="handleUpdateValue">
                      <!--:disabled="!(formValue.fFrom == 'oa' && !formValue.fEdited)"-->
                      <n-space item-style="display: flex;">
                        <n-checkbox value="All" label="全部" />
                        <n-checkbox
                          v-for="p in formValue.packages"
                          :value="p.value"
                          :label="'包件' + p.index + ':' + p.label"
                        />
                      </n-space>
                    </n-checkbox-group>
                  </n-form-item>
                </td>
              </tr>
              <tr>
                <td style="width: 20%" class="tdcenter">会议类型</td>
                <td class="tdleft">
                  <n-form-item path="fMeetingTypeId">
                    <n-select
                      v-model:value="formValue.fMeetingTypeId"
                      :options="options"
                      @update:value="handleUpdateType"
                    />
                  </n-form-item>
                </td>
              </tr>
              <tr>
                <td style="width: 20%" class="tdcenter">会议地点</td>
                <td class="tdleft">
                  <n-form-item path="fMeetingPlace">
                    <n-input
                      v-model:value="formValue.fMeetingPlace"
                      type="text"
                      style="width: 100%"
                    />
                  </n-form-item>
                </td>
              </tr>
              <tr>
                <td style="width: 20%" class="tdcenter">会议时间</td>
                <td class="tdleft">
                  <n-form-item path="fMeetingTime">
                    <!--  <n-date-picker
                      v-model:value="timestamp"
                      type="datetimerange"
                      clearable
                      style="width: 100%"
                    /> -->
                    <n-date-picker
                      v-model:formatted-value="timestamp"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      type="datetimerange"
                      clearable
                      style="width: 100%"
                    />
                  </n-form-item>
                </td>
              </tr>
              <tr>
                <td style="width: 20%" class="tdcenter">业主专家</td>
                <td class="tdleft">
                  <n-form-item>
                    <n-input
                      placeholder="业主专家"
                      v-model:value="formValue.fOwnerExpert"
                    ></n-input>
                  </n-form-item>
                </td>
              </tr>
              <tr>
                <td style="width: 20%" class="tdcenter">外聘专家</td>
                <td class="tdleft">
                  <n-form-item>
                    <n-space>
                      <span v-for="exp in formValue.fOutsideExpert">{{
                        exp.name
                      }}</span>
                      <n-button text @click="openSelectExpert('oa')" type="primary"
                        >选择</n-button
                      >
                      <n-button
                        text
                        @click="openRegisterExpert"
                        target="_blank"
                        type="primary"
                      >
                        专家账号录入
                      </n-button>
                      <n-button text @click="openSelectExpert('ekp')" type="primary">从ekp选择</n-button>
                      <n-button text @click="openRegisterExpertEkp" target="_blank" type="primary">ekp专家账号录入</n-button>
                    </n-space>
                  </n-form-item>
                </td>
              </tr>
              <tr>
                <td style="width: 20%" class="tdcenter">备注</td>
                <td class="tdleft">
                  <n-form-item path="fRemark">
                    <n-input
                      type="textarea"
                      v-model:value="formValue.fRemark"
                    ></n-input>
                  </n-form-item>
                </td>
              </tr>
            </tbody>
          </n-table>
        </n-grid-item>
        <n-grid-item span="2">
          <n-grid-item style="display: flex; justify-content: center">
            <n-space>
              <n-button type="primary" @click="saveData"> 确定 </n-button>
              <n-button type="error" @click="closeModal"> 关闭 </n-button>
            </n-space>
          </n-grid-item>
        </n-grid-item>
      </n-grid>
    </n-form>
  </n-card>

  <!-- 外聘专家列表modal -->
  <n-modal
    v-model:show="expertModal"
    preset="dialog"
    title="外聘专家"
    :mask-closable="false"
    style="width: 70%; height: 80%"
  >
    <n-form ref="" inline :label-width="80" :model="searchForm">
      <n-form-item label="姓名" path="name">
        <n-input v-model:value="searchForm.name" placeholder="外聘专家姓名" />
      </n-form-item>
      <n-form-item label="电话" path="mobile" v-show="curExpertKey == 'oa'">
        <n-input-number
          v-model:value="searchForm.mobile"
          placeholder="外聘专家姓名"
          :show-button="false"
        />
      </n-form-item>
      <n-form-item>
        <n-button @click="doSearch">搜索</n-button>
      </n-form-item>
    </n-form>
    <n-data-table
      :columns="expertColumns"
      :data="expertData"
      :bordered="false"
    />
    <br />
    <n-space>
      <n-button icon-placement="right" text>
        <template #icon>
          <n-icon> </n-icon>
        </template>
        已选：
      </n-button>
      <n-button
        v-for="expert in formValue.fOutsideExpert"
        icon-placement="right"
        text
        @click="removeExpert(expert)"
      >
        {{ expert.name }}
        <template #icon>
          <n-icon>
            <Close />
          </n-icon>
        </template>
      </n-button>
    </n-space>
    <br />
    <n-pagination
      v-model:page="expertPage.page"
      :page-size="expertPage.size"
      :item-count="expertPage.count"
      @update:page="loadExpertList"
      @update:page-size="loadExpertList"
    />
  </n-modal>
</template>

<script setup>
import { defineComponent, ref } from 'vue'
import createApi from './api'
import baseUrl from '@/utils/baseUrl'
import { useMessage } from 'naive-ui'
import fromAddress from '@/apps/common/address/formAddress.vue'
import { Push, Close } from '@vicons/ionicons5'
import { useRoute } from 'vue-router'
import singleLoginApi from '@/utils/singleLogin'
import storage from '@/utils/storage'
import context from '@/context.js'
import moment from 'moment'
import {useMenuStore} from '@/store/menu.js'
const menuStore = useMenuStore()
moment().locale('zn-cn')

const currentInstance = getCurrentInstance()
const api = createApi(currentInstance)
const singleLogin = singleLoginApi(currentInstance)
const props = defineProps({
  id: String,
})
const projectModel = reactive({})

const route = useRoute()
const id = menuStore.currentRouteObj.urlParams.fId
const message = useMessage()
const cities = ref([]) //包件
const formRef = ref(null)
// form数据
const formValue = reactive({
  fId: '',
  fProjectMain: {
    fId: '',
    fProtocolNo: '',
  },
  fMeetingType: {},
  fMeetingTypeId: '',
  fMeetingPlace: '',
  fMeetingStartTime: 0,
  fMeetingEndTime: 0,
  fRemark: '',
  packages: [], //包件option
  packageIds: [], //实际向后端传的值
  packageIndexs: [], //选择包件下标
  cities: cities, //所选包件显示
  citiesBak: ['All'], // 用于全选包件
  fOwnerExpert: '', //业主专家
  fOutsideExpert: [], //外聘专家
  fFrom: '',
  fEdited: false,
})

//包件选择事件
const handleUpdateValue = (value, value2) => {
  console.log(formValue.citiesBak)
  formValue.packageIds = []
  formValue.packageIndexs = []
  formValue.cities = value
  //全选 勾上全部包件
  if (value2.actionType === 'check' && value2.value === 'All') {
    formValue.cities = formValue.citiesBak
  } else if (value2.actionType === 'uncheck' && value2.value === 'All') {
    formValue.cities = []
  } else {
    if (
      value2.actionType === 'uncheck' &&
      formValue.cities.indexOf('All') >= 0
    ) {
      formValue.cities.splice(formValue.cities.indexOf('All'), 1)
    } else if (
      value2.actionType === 'check' &&
      value.length == formValue.citiesBak.length - 1
    ) {
      formValue.cities.push('All')
    }
  }
  //实际向后端传的值
  for (var i = 0; i < formValue.cities.length; i++) {
    if (formValue.cities[i] !== 'All') {
      formValue.packageIds.push({
        fId: formValue.cities[i],
      })
      for (var j = 0; j < formValue.packages.length; j++) {
        if (formValue.packages[j].value == formValue.cities[i]) {
          formValue.packageIndexs.push(formValue.packages[j].index)
        }
      }
    }
  }
}
const timestamp = ref(null) //初始会议时间
//会议类型数据
const options = reactive([])
//会议类型更新事件
const handleUpdateType = (value, option) => {
  formValue.fMeetingType = {
    fId: value,
  }
}
//获取会议类型Option数据
const getTypeOptions = async () => {
  const requestData = {
    query: {
      eq: {
        fMeetingKey: '1',
      },
    },
  }
  await api
    .masterdataMeetingTypeList(requestData)
    .then((result) => {
      const data = result.data.list
      data.map((item) => {
        options.push({
          label: item.fName,
          value: item.fId,
        })
      })
    })
    .catch((err) => {
      console.log(err)
    })
}
//获取包件
const getPackages = async () => {
  /*const requestData = {
    query: {
      eq: {
        'fMain.fProjectId.fId': formValue.fProjectMain.fId,
      },
    },
  }
  await api
    .noticePackageList(requestData)
    .then((result) => {
      const data = result.data.list
      var pushedPackId = []
      data.map((item) => {
        if (pushedPackId.indexOf(item.fPackage.fId) < 0) {
          formValue.packages.push({
            label: item.fPackage.fName,
            value: item.fPackage.fId,
            index: item.fPackage.fIndex,
          })
          formValue.citiesBak.push(item.fPackage.fId)
          pushedPackId.push(item.fPackage.fId)
        }
      })
    })
    .catch((err) => {
      console.log(err)
    })*/

  //资格预审会议包件选择不依赖于公告
  const query = {
    query: {
      eq: {
        'fMainId.fId': formValue.fProjectMain.fId,
      }
    }
  }
  await api.projectPackageList(query).then((result) => {
    const data = result.data.list
    var pushedPackId = []
    data.map((item) => {
      formValue.packages.push({
        label: item.fName,
        value: item.fId,
        index: item.fIndex,
      })
      formValue.citiesBak.push(item.fId)
      pushedPackId.push(item.fId)
    })
  })

  await api
    .meetingPackageList({
      query: {
        eq: {
          'fMeetingId.fId': formValue.fId,
        },
      },
    })
    .then(function (result) {
      const data = result.data.list
      data.map((item) => {
        formValue.cities.push(item.fPackageId.fId)
        formValue.packageIds.push({
          fId: item.fPackageId.fId,
        })
        formValue.packageIndexs.push(item.fPackageId.fIndex)
      })
      if (formValue.cities.length == formValue.citiesBak.length -1) {
        formValue.cities.push("All")
      }
    })
}

const emit = defineEmits(['onSuccess', 'onClose'])

//保存
const saveData = async () => {
  try {
    await formRef.value.validate()
  } catch (e) {
    message.error('未通过校验，请检查！')
    return
  }

  //校验资格预审会议的包件是否有资格预审公告
  if (formValue.fMeetingType.fName != '其他') {
    var checkPackRes = await api.noticePackageList({
      query: {
        and: [
          {
            eq: {
              'fMain.fProjectId.fId': formValue.fProjectMain.fId,
            },
          },
          {
            eq: {
              'fMain.fIsPrequalification': 'true',
            },
          },
        ],
      },
    })
    if (checkPackRes.status == 200) {
      var isPrePackIds = []
      for (var i = 0; i < checkPackRes.data.list.length; i++) {
        var temp = checkPackRes.data.list[i]
        if (
          formValue.cities.includes(temp.fPackage.fId) &&
          !isPrePackIds.includes(temp.fPackage.fId)
        ) {
          isPrePackIds.push(temp.fPackage.fId)
        }
      }
      /*var notIsPrePackName = []
      for (var i = 0; i < formValue.packages.length; i++) {
        if (
          formValue.cities.includes(formValue.packages[i].value) &&
          !isPrePackIds.includes(formValue.packages[i].value)
        ) {
          notIsPrePackName.push(formValue.packages[i].label)
        }
      }
      if (notIsPrePackName.length > 0) {
        message.error(notIsPrePackName + '不是资格预审公告的包件，不可选择')
        return
      }*/
    }
  }

  /* 推送oa */
  //http://www.sitcbeta.loc/j/api/sitc/jy/prj/update_prj_evaluation.jsp
  var oaForm = {
    s: context.user(),
    action: 'update',
    pmId: formValue.fId,
    startTime: moment(timestamp.value[0]).format('YYYY-MM-DD HH:mm:ss'),
    finishTime: moment(timestamp.value[1]).format('YYYY-MM-DD HH:mm:ss'),
    meetingPlace: formValue.fMeetingPlace,
    meetingType: '1',
    meetingName: '',
    owner: formValue.fOwnerExpert,
    experts: [], //formValue.fOutsideExpert,
    package: formValue.packageIndexs,
    note: formValue.fRemark,
    projectNo: formValue.fProjectMain.fProtocolNo,
  }
  for (var i=0; i<formValue.fOutsideExpert.length; i++) {
    var temp = formValue.fOutsideExpert[i]
    if (parseInt(temp.id) == temp.id) {
      oaForm.experts.push(temp)
    } else {
      oaForm.experts.push({
        id: "",
        landray_id: temp.id,
        name: temp.name,
        phone: temp.phone,
        email: temp.email,
        workUnit: temp.workUnit
      })
    }
  }
  api.oaQuestMap(oaForm).then(function (res) {
    var oaQuest = res.oaQuest
    api
      .updatePrjEvaluation(oaQuest)
      // axios
      //   .post(
      //     baseUrl.oaUrl + '/j/api/sitc/jy/prj/update_prj_evaluation.jsp',
      //     oaQuest,
      //   )
      .then(async function (res2) {
        if (res2.STATUS == 'S') {
          formValue.fMeetingStartTime = (new Date(timestamp.value[0])).getTime()
          formValue.fMeetingEndTime = (new Date(timestamp.value[1])).getTime()
          await api
            .save(formValue)
            .then((result) => {
              message.info('保存成功')
              emit('onSuccess')
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          message.error(res2.MESSAGE)
        }
      })
  })
}
//取消
const closeModal = () => {
  emit('onClose')
}

async function init() {
  await api
    .load({
      fId: props.id,
    })
    .then(function (res) {
      formValue.fId = res.data.fId
      formValue.fMeetingPlace = res.data.fMeetingPlace
      formValue.fProjectMain.fId = res.data.fMainId.fId
      formValue.fProjectMain.fProtocolNo = res.data.fMainId.fProtocolNo
      // formValue.fStartTimeNum = res.data.fStartTimeNum
      // formValue.fFinishTimeNum = res.data.fFinishTimeNum
      timestamp.value = [res.data.fMeetingStartTime, res.data.fMeetingEndTime]
      if (res.data.fMeetingType) {
        formValue.fMeetingType.fId = res.data.fMeetingType.fId
        formValue.fMeetingType.fName = res.data.fMeetingType.fName
        formValue.fMeetingTypeId = res.data.fMeetingType.fId
      }
      formValue.fOwnerExpert = res.data.fOwnerExpert
      if (res.data.fOutsideExpert) {
        formValue.fOutsideExpert = res.data.fOutsideExpert
      }
      formValue.fRemark = res.data.fRemark
    })
  api
    .meetingMaimLoad({
      fId: props.id,
    })
    .then(function (res) {
      if (res.status == 200) {
        formValue.fFrom = res.data.fFrom
        formValue.fEdited = res.data.fEdited
      }
    })
}

//初始化
onMounted(async () => {
  await init()
  getTypeOptions()
  getPackages()
})

/* 校验器 */
const rules = ref({
  fMeetingTypeId: {
    message: '请选择会议类型',
    required: true,
    trigger: 'blur',
  },
  fMeetingPlace: [
    {
      message: '请填写会议地点',
      required: true,
      trigger: ['input', 'blur'],
    },
    {
      message: '会议地点长度应小于等于200',
      trigger: ['input', 'blur'],
      validator: (rule, value) => {
        return value.length <= 200
      },
    },
  ],
  fMeetingTime: {
    message: '请选择会议时间',
    validator: (rule, value) => {
      return timestamp.value != undefined
    },
    trigger: 'blur',
  },
})

/* 外聘专家注册 */
function openRegisterExpert() {
  var url = baseUrl.oaJumpUrl + '/a/data/ex_form.asp'
  singleLogin.oaJump(url)
}

/* ekp专家白名单新建 */
function openRegisterExpertEkp() {
  var url = baseUrl.ekpUrl + '/km/expert/km_expert_design_list/index.jsp'
  singleLogin.ekpJump(url)
}

/* 选择外聘专家弹窗 */
const expertModal = ref(false)
/* 外聘专家列表 */
const expertColumns = reactive([
  {
    title: '姓名',
    key: 'name',
  },
  {
    title: '手机号',
    key: 'mobile',
    render(row) {
      return row.mobile ? row.mobile : (row.phone ? row.phone : "")
    }
  },
  {
    title: '操作',
    key: 'option',
    render(row) {
      return [
        expertIds.indexOf(row.id) < 0 &&
          h(
            NButton,
            {
              onClick: () => {
                formValue.fOutsideExpert.push(row)
                expertIds.push(row.id)
              },
            },
            '选择',
          ),
        expertIds.indexOf(row.id) >= 0 &&
          h(
            NButton,
            {
              onClick: () => {
                removeExpert(row)
              },
            },
            '取消',
          ),
      ]
    },
  },
])
const expertIds = reactive([])
/* 外聘专家列表数据 */
const expertData = reactive([])
/* 分页 */
const expertPage = reactive({
  page: 1,
  size: 8,
  count: 0,
})
/* 搜索框 */
const searchForm = reactive({
  name: '',
  mobile: '',
})

const curExpertKey = ref("oa")
/* 选择外聘专家 */
function openSelectExpert(key) {
  expertModal.value = true
  loadExpertList(key)
  curExpertKey.value = key
}

function doSearch() {
  expertPage.page = 1
  loadExpertList(curExpertKey.value)
}

/* 读取信息 */
async function loadExpertList() {
  var form = {
    s: context.user(),
    pg: expertPage.page,
    ps: expertPage.size,
    q_name: searchForm.name,
    q_mobile: parseInt(searchForm.mobile),
  }
  var oaQuest
  await api.oaQuestMap(form).then(function (res) {
    oaQuest = res.oaQuest
  })
  if (curExpertKey.value === "oa") {
    api.evaluationSelExpert(oaQuest).then(function (res) {
      expertData.length = 0
      expertPage.count = res.count
      Object.assign(expertData, res.list)
    })
  } else if (curExpertKey.value === "ekp") {
    api.evaluationSelExpertFromEkp(form).then(function(res){
      expertData.length = 0
      expertPage.count = res.page.totalrows
      Object.assign(expertData, res.page.list)
    })
  }
}

function removeExpert(row) {
  for (var i = 0; i < formValue.fOutsideExpert.length; i++) {
    if (formValue.fOutsideExpert[i].id == row.id) {
      formValue.fOutsideExpert.splice(i, 1)
      break
    }
  }
  expertIds.splice(expertIds.indexOf(row.id), 1)
}
</script>

<style scoped>
.n-layout-header {
  padding: 24px;
}

.n-layout-footer {
  padding: 24px;
}
</style>
