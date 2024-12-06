<template>
  <n-form
    ref="formRef"
    :model="formValue"
    label-placement="left"
    label-width="150px"
    :rules="rules"
  >
    <n-grid :cols="1">
      <n-gi v-if="openReport">
        <p style="font-size: 16px; font-weight: bold">会议信息</p>
      </n-gi>
      <n-gi v-if="openReport">
        <n-table :single-line="false">
          <tbody>
            <tr>
              <td style="width: 20%" class="tdcenter">包件信息</td>
              <td class="tdleft">
                <n-form-item>
                  <n-checkbox-group
                    v-model:value="cities"
                    @update:value="handleUpdateValue"
                  >
                      <!--:disabled="formValue.fEdited"-->
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
                    :options="options"
                    @update:value="handleUpdateType"
                    v-model:value="formValue.fMeetingTypeId"
                  ></n-select>
                </n-form-item>
              </td>
            </tr>
            <tr>
              <td style="width: 20%" class="tdcenter">会议名称</td>
              <td class="tdleft">
                <n-form-item path="fName">
                  <n-input v-model:value="formValue.fName"></n-input>
                </n-form-item>
              </td>
            </tr>
            <tr>
              <td style="width: 20%" class="tdcenter">会议时间</td>
              <td class="tdleft">
                <n-form-item path="fMeetingTime">
                  <!-- <n-date-picker type="datetimerange" v-model:formatted-value="formValue.fCreateTime"
                    value-format="yyyy-MM-dd HH:mm:ss"></n-date-picker> -->
                  <n-date-picker
                    v-model:value="timestamp"
                    type="datetimerange"
                    clearable
                    style="width: 100%"
                  />
                </n-form-item>
              </td>
            </tr>
            <tr>
              <td style="width: 20%" class="tdcenter">会议地点</td>
              <td class="tdleft">
                <n-form-item path="fMeetingPlace">
                  <n-input v-model:value="formValue.fMeetingPlace"></n-input>
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
      </n-gi>
      <!-- <n-gi>
        <p style="font-size: 16px; font-weight: bold">附件上传</p>
      </n-gi> -->
<!--      <n-gi v-if="openReport">
        <n-table :single-line="false">
          <tbody>
            <tr>
              <td style="width: 20%" class="tdcenter">会议方案</td>
              <td class="tdleft">
                <n-form-item>
                  <sitc-attachment
                    :linkPackage="true"
                    :projectId="id"
                    modelName="com.qkinfotech.core.tendering.model.apps.report.AppsReport"
                    :modelId="formValue.fId"
                    fkey="meetingPlan"
                  >
                  </sitc-attachment>
                </n-form-item>
              </td>
            </tr>
            <tr>
              <td style="width: 20%" class="tdcenter">会议议程</td>
              <td class="tdleft">
                <n-form-item>
                  <sitc-attachment
                    :linkPackage="true"
                    :projectId="id"
                    modelName="com.qkinfotech.core.tendering.model.apps.report.AppsReport"
                    :modelId="formValue.fId"
                    fkey="meetingAgenda"
                  >
                  </sitc-attachment>
                </n-form-item>
              </td>
            </tr>
            <tr>
              <td style="width: 20%" class="tdcenter">其他</td>
              <td class="tdleft">
                <n-form-item>
                  <sitc-attachment
                    :linkPackage="true"
                    :projectId="id"
                    modelName="com.qkinfotech.core.tendering.model.apps.report.AppsReport"
                    :modelId="formValue.fId"
                    fkey="other"
                  >
                  </sitc-attachment>
                </n-form-item>
              </td>
            </tr>
          </tbody>
        </n-table>
      </n-gi> -->
      <n-gi>
        <n-space style="display: flex; justify-content: center">
          <n-button type="primary" @click="submit">提交</n-button>
          <n-button type="error" @click="closeModal">取消</n-button>
        </n-space>
      </n-gi>
    </n-grid>
  </n-form>

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
import { ref, defineComponent, reactive } from 'vue'
import { useMessage } from 'naive-ui'
import baseUrl from '@/utils/baseUrl'
import fromAddress from '@/apps/common/address/formAddress.vue'
import sitcAttachment from '@/apps/common/attachment/SITCAttachment.vue'
import { useRoute, useRouter } from 'vue-router'
import singleLoginApi from '@/utils/singleLogin'
import storage from '@/utils/storage'
import context from '@/context.js'

import moment from 'moment'
import createApi from './api'
import {useMenuStore} from '@/store/menu.js'
const menuStore = useMenuStore()

moment().locale('zn-cn')

const currentInstance = getCurrentInstance()
const api = createApi(currentInstance)
const singleLogin = singleLoginApi(currentInstance)
const props = defineProps({
  data: Object,
  id: String,
})

const route = useRoute()
const id = menuStore.currentRouteObj.urlParams.fId

const projectModel = reactive({})

const message = useMessage()
const cities = ref(['All']) //包件
const formRef = ref(null)

const formValue = reactive({
  fId: props.id,
  fProjectMain: {
    fId: props.data ? props.data.fId : '',
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
  fName: '',
  fOutsideExpert: [],
  fFrom: '',
  fEdited: false,
})
const openReport = ref(true)

//包件选择事件
const handleUpdateValue = (value, value2) => {
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
    fName: option.label,
  }
}

//获取会议类型Option数据
const getTypeOptions = async () => {
  const requestData = {
    query: {
      eq: {
        fMeetingKey: '2',
      },
    },
  }
  await api
    .meetingTypeList(requestData)
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
  /*const kickoffQuery = {
      "eq" : {"fMainId.fId" : props.data.fId}
    }
    axios.post( "/pm/apps/meeting/kickoff/list", {query: kickoffQuery})
      .then(async function(res){*/
  /*var kickoffIds = []
        var data = res.data.list
        data.map((item) => {
          kickoffIds.push(item.fId)
        })
        const packageQuery = {
          "in" : {"fMeetingId.fId" : kickoffIds}
        }
        await axios.post( "/pm/meeting/package/list", {query : packageQuery})
          .then(function(res2){
            var data2 = res2.data.list
            var inputedIds = []
            data2.map((item) => {
              if (inputedIds.indexOf(item.fPackageId.fId) < 0) {
                formValue.packages.push({
                  label: item.fPackageId.fName,
                  value: item.fPackageId.fId,
                  index: item.fPackageId.fIndex
                });
                inputedIds.push(item.fPackageId.fId)
                formValue.cities.push(item.fPackageId.fId)
                formValue.citiesBak.push(item.fPackageId.fId)
                formValue.packageIds.push({
                  fId: item.fPackageId.fId
                })
                formValue.packageIndexs.push(item.fPackageId.fIndex)
              }
            })
          })*/

  await api
    .finaliaztionResultPackageList({
      query: {
        eq: {
          'fProjectId.fId': formValue.fProjectMain.fId,
        },
      },
    })
    .then(function (res2) {
      var data2 = res2.data.list
      var inputedIds = []
      data2.map((item) => {
        if (inputedIds.indexOf(item.fPackageId.fId) < 0) {
          formValue.packages.push({
            label: item.fPackageId.fName,
            value: item.fPackageId.fId,
            index: item.fPackageId.fIndex,
          })
          inputedIds.push(item.fPackageId.fId)
          formValue.cities.push(item.fPackageId.fId)
          formValue.citiesBak.push(item.fPackageId.fId)
          formValue.packageIds.push({
            fId: item.fPackageId.fId,
          })
          formValue.packageIndexs.push(item.fPackageId.fIndex)
        }
      })
    })

  await api
    .meetingPackageList({ query: { eq: { 'fMeetingId.fId': formValue.fId } } })
    .then(function (result) {
      if (result.status == 200 && result.data.list.length > 0) {
        cities.value.length = 0
        formValue.cities.length = 0
        formValue.packageIds.length = 0
        formValue.packageIndexs.length = 0
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
      }
    })
  /*})*/
}

const emit = defineEmits(['createReport', 'onClose'])
//保存
const submit = async () => {
  try {
    await formRef.value.validate()
  } catch (e) {
    message.error('未通过校验，请检查！')
    return
  }
  var oaForm = {
    s: context.user(),
    action: props.id ? 'update' : 'add',
    pmId: formValue.fId,
    startTime: moment(timestamp.value[0]).format('YYYY-MM-DD HH:mm:ss'),
    finishTime: moment(timestamp.value[1]).format('YYYY-MM-DD HH:mm:ss'),
    meetingPlace: formValue.fMeetingPlace,
    meetingName: '',
    owner: formValue.fOwnerExpert,
    experts: [], //formValue.fOutsideExpert,
    package: formValue.packageIndexs,
    note: formValue.fRemark,
    projectNo: props.data.fProtocolNo,
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
  if (formValue.fMeetingType.fName.indexOf('中期') >= 0) {
    oaForm.meetingType = '3'
  } else if (formValue.fMeetingType.fName.indexOf('终期') >= 0) {
    oaForm.meetingType = '4'
  } else {
    oaForm.meetingType = '5'
  }
  //同步OA
  api.oaQuestMap(oaForm).then(function (res) {
    var oaQuest = res.oaQuest
    api.updatePrjEvaluation(oaQuest).then(async function (res2) {
      if (res2.STATUS == 'S') {
        formValue.fMeetingStartTime = timestamp.value[0]
        formValue.fMeetingEndTime = timestamp.value[1]
        await api
          .reportSave(formValue)
          .then((result) => {
            message.info('保存成功')
            emit('createReport')
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

//初始化一个fId
function init() {
  if (props.id) {
    api.reportLoad({ fId: props.id }).then(function (res) {
      formValue.fId = res.data.fId
      formValue.fProjectMain.fId = res.data.fMainId.fId
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
    api.meetingMainLoad({ fId: props.id }).then(function (res) {
      formValue.fMeetingPlace = res.data.fPlace
      formValue.fName = res.data.fName
      var st = new Date(res.data.fStartTime)
      var et = new Date(res.data.fFinishTime)
      timestamp.value = [st.getTime(), et.getTime()]
      formValue.fFrom = res.data.fFrom
      formValue.fEdited = res.data.fEdited
    })
  } else {
    api.projectPackageInit({}).then(function (res) {
      formValue.fId = res.data.fId
    })
  }
}

//初始化
onMounted(() => {
  init()
  getTypeOptions()
  getPackages()
})

const rules = ref({
  fMeetingTypeId: {
    message: '请选择会议类型',
    required: true,
    trigger: 'blur',
  },
  fName: [
    {
      message: '请填写会议名称',
      required: true,
      trigger: ['input', 'blur'],
    },
    {
      message: '会议名称长度应小于等于200',
      trigger: ['input', 'blur'],
      validator: (rule, value) => {
        return value.length <= 200
      },
    },
  ],
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
  var url = baseUrl.oaUrl + '/j/api/sitc/jy/prj/evaluation_sel_expert.jsp'
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

<style></style>
