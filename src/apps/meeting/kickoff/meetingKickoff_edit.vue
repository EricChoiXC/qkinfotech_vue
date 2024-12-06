<template>
  <n-form ref="formRef" :model="formValue" label-placement="" label-width="" :rules="rules">
    <n-grid :cols="1">
      <n-gi v-if="openKickoff">
        <p style="font-size: 16px; font-weight: bold;">会议信息</p>
      </n-gi>
      <n-gi v-if="openKickoff">
        <n-table :single-line="false">
          <tbody>
          <tr>
            <td style="width: 20%;" class="tdcenter">包件信息</td>
            <td class="tdleft">
              <n-form-item label="">
                <n-checkbox-group v-model:value="cities" @update:value="handleUpdateValue">
                  <!--:disabled="formValue.fEdited"-->
                  <n-space item-style="display: flex;">
                    <n-checkbox value="All" label="全部"/>
                    <n-checkbox v-for="p in formValue.packages" :value="p.value"
                                :label="'包件' + p.index + ':' + p.label"/>
                  </n-space>
                </n-checkbox-group>
              </n-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 20%;" class="tdcenter">会议名称</td>
            <td class="tdleft">
              <n-form-item label="" path="fName">
                <n-input v-model:value="formValue.fName"></n-input>
              </n-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 20%;" class="tdcenter">会议时间</td>
            <td class="tdleft">
              <n-form-item label="" path="fMeetingTime">
                <n-date-picker v-model:value="timestamp" type="datetimerange" clearable style="width: 100%;"/>
              </n-form-item>
            </td>
          </tr>
          <tr>
            <td style="width: 20%;" class="tdcenter">会议地点</td>
            <td class="tdleft">
              <n-form-item label="" path="fMeetingPlace">
                <n-input v-model:value="formValue.fMeetingPlace"></n-input>
              </n-form-item>
            </td>
          </tr>
          </tbody>
        </n-table>
      </n-gi>
      <!-- <n-gi v-if="openKickoff">
        <p style="font-size: 16px; font-weight: bold;">附件上传</p>
      </n-gi> -->
<!--      <n-gi v-if="openKickoff">
        <n-table :single-line="false">
          <tbody>
          <tr>
            <td style="width: 20%;" class="tdcenter">会议方案</td>
            <td class="tdleft">
              <sitc-attachment :linkPackage="true" :projectId="id"
                               modelName="com.qkinfotech.core.tendering.model.apps.meeting.AppsMeetingKickoff"
                               :modelId="formValue.fId" fkey="meetingPlan">
              </sitc-attachment>
            </td>
          </tr>
          <tr>
            <td style="width: 20%;" class="tdcenter">会议议程</td>
            <td class="tdleft">
              <sitc-attachment :linkPackage="true" :projectId="id"
                               modelName="com.qkinfotech.core.tendering.model.apps.meeting.AppsMeetingKickoff"
                               :modelId="formValue.fId" fkey="meetingAgenda">
              </sitc-attachment>
            </td>
          </tr>
          <tr>
            <td style="width: 20%;" class="tdcenter">签到表</td>
            <td class="tdleft">
              <sitc-attachment :linkPackage="true" :projectId="id"
                               modelName="com.qkinfotech.core.tendering.model.apps.meeting.AppsMeetingKickoff"
                               :modelId="formValue.fId" fkey="meetingSign">
              </sitc-attachment>
            </td>
          </tr>
          <tr>
            <td style="width: 20%;" class="tdcenter">其他</td>
            <td class="tdleft">
              <sitc-attachment :linkPackage="true" :projectId="id"
                               modelName="com.qkinfotech.core.tendering.model.apps.meeting.AppsMeetingKickoff"
                               :modelId="formValue.fId" fkey="other">
              </sitc-attachment>
            </td>
          </tr>
          </tbody>
        </n-table>
      </n-gi> -->
      <n-gi style="display: flex;justify-content: center;">
        <n-space>
          <n-button type="primary" @click="submit">提交</n-button>
          <n-button type="error" @click="closeModal">取消</n-button>
        </n-space>
      </n-gi>
    </n-grid>
  </n-form>
</template>

<script setup>
import {useRoute, useRouter} from 'vue-router'
import {
  ref,
  defineComponent,
  inject,
  reactive
} from "vue"
import createApi from './api'
import sitcAttachment from '@/apps/common/attachment/SITCAttachment.vue'
import {
  useMessage
} from "naive-ui"
import context from '@/context.js'

import moment from 'moment'
import {useMenuStore} from '@/store/menu.js'
const menuStore = useMenuStore()

moment().locale('zn-cn')

const api = createApi(getCurrentInstance())
const props = defineProps({
  id: String
})

const route = useRoute();
const id = menuStore.currentRouteObj.urlParams.fId

const formRef = ref(null);
const message = useMessage()
const openKickoff = ref(true)
const cities = ref(['All']); //包件
const timestamp = ref(null); //初始会议时间
// form 数据
const formValue = reactive({
  fProjectMain: {
    fId: id,
    fProtocolNo: ""
  },
  fId: '',
  fName: "",
  fMeetingTypeId: '',
  fMeetingPlace: '',
  fMeetingStartTime: 0,
  fMeetingEndTime: 0,
  fRemark: '',
  packages: [], //包件option
  packageIds: [], //实际向后端传的值
  packageIndexs: [],//选择包件下标
  cities: cities, //所选包件显示
  citiesBak: ['All'], // 用于全选包件
  fFrom: "",
  fEdited: false
})
const checkProjectStarts = inject("checkProjectStarts");
const emit = defineEmits(['createMeetingKickoff', 'onClose'])
const submit = async () => {
  try {
    await formRef.value.validate()
  } catch (e) {
    message.error("未通过校验，请检查！")
    return
  }

  var oaForm = {
    s: context.user(),
    action: props.id ? "update" : "add",
    pmId: formValue.fId,
    startTime: moment(timestamp.value[0]).format("YYYY-MM-DD HH:mm:ss"),
    finishTime: moment(timestamp.value[1]).format("YYYY-MM-DD HH:mm:ss"),
    meetingPlace: formValue.fMeetingPlace,
    meetingType: "2",
    meetingName: "",
    package: formValue.packageIndexs,
    note: formValue.fRemark,
    projectNo: formValue.fProjectMain.fProtocolNo
  }
  //同步OA
  api.oaQuestMap(oaForm).then(function (res) {
    var oaQuest = res.oaQuest
    api.updatePrjEvaluation(oaQuest).then(async function (res2) {
      if (res2.STATUS == "S") {
        formValue.fInId = res2.MESSAGE
        formValue.fMeetingStartTime = timestamp.value[0]
        formValue.fMeetingEndTime = timestamp.value[1]
        await api.save(formValue).then(result => {
          message.info("保存成功")
          checkProjectStarts();
          emit('createMeetingKickoff')
        }).catch(err => {
          console.log(err)
        });
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

//包件选择事件
const handleUpdateValue = (value, value2) => {
  formValue.packageIds = [];
  formValue.packageIndexs = []
  formValue.cities = value;
  //全选 勾上全部包件
  if (value2.actionType === "check" && value2.value === "All") {
    formValue.cities = formValue.citiesBak
  } else if (value2.actionType === "uncheck" && value2.value === "All") {
    formValue.cities = []
  } else {
    if (value2.actionType === "uncheck" && formValue.cities.indexOf("All") >= 0) {
      formValue.cities.splice(formValue.cities.indexOf("All"), 1)
    } else if (value2.actionType === "check" && value.length == formValue.citiesBak.length - 1) {
      formValue.cities.push("All")
    }
  }
  //实际向后端传的值
  for (var i = 0; i < formValue.cities.length; i++) {
    if (formValue.cities[i] !== 'All') {
      formValue.packageIds.push({
        fId: formValue.cities[i]
      })
      for (var j = 0; j < formValue.packages.length; j++) {
        if (formValue.packages[j].value == formValue.cities[i]) {
          formValue.packageIndexs.push(formValue.packages[j].index)
        }
      }
    }
  }
}
//获取包件
const getPackages = async () => {
  await api.getMeetingPackages({fId: id}).then(result => {
    const data = result.data
    data.map((item) => {
      formValue.packages.push({
        label: item.fName,
        value: item.fId,
        index: item.fIndex
      });
      formValue.cities.push(item.fId)
      formValue.citiesBak.push(item.fId)
      formValue.packageIds.push({
        fId: item.fId
      })
      formValue.packageIndexs.push(item.fIndex)
    })
  }).catch(err => {
    console.log(err)
  });

  await api.packageList({query: {"eq": {"fMeetingId.fId": formValue.fId}}}).then(function (result) {
    if (result.status == 200 && result.data.list.length > 0) {
      cities.value.length = 0
      formValue.cities.length = 0
      formValue.packageIds.length = 0
      formValue.packageIndexs.length = 0
      const data = result.data.list
      data.map((item) => {
        formValue.cities.push(item.fPackageId.fId)
        formValue.packageIds.push({
          fId: item.fPackageId.fId
        })
        formValue.packageIndexs.push(item.fPackageId.fIndex)
      })
      if (formValue.cities.length == formValue.citiesBak.length -1) {
        formValue.cities.push("All")
      }
    }
  })
}

//初始化一个fId
function init() {
  if (props.id) {
    api.load({fId: props.id}).then(function (res) {
      formValue.fId = res.data.fId
      formValue.fProjectMain.fId = res.data.fMainId.fId
    })
    api.meetingMainLoad({fId: props.id}).then(function (res) {
      formValue.fMeetingPlace = res.data.fPlace
      formValue.fName = res.data.fName
      var st = new Date(res.data.fStartTime)
      var et = new Date(res.data.fFinishTime)
      timestamp.value = [st.getTime(), et.getTime()]
      formValue.fFrom = res.data.fFrom
      formValue.fEdited = res.data.fEdited
    })
  } else {
    api.packageInit({}).then(function (res) {
      formValue.fId = res.data.fId
    })
  }
  api.projectMainLoad({fId: id}).then(function (res) {
    formValue.fProjectMain.fProtocolNo = res.data.fProtocolNo
  })
}

//初始化
onMounted(() => {
  init()
  getPackages();
})


const rules = ref({
  fName: [{
    message: "请填写会议名称",
    required: true,
    trigger: ['input', 'blur']
  }, {
    message: "会议名称长度应小于等于200",
    trigger: ['input', 'blur'],
    validator: (rule, value) => {
      return value.length <= 200
    }
  }],
  fMeetingPlace: [{
    message: "请填写会议地点",
    required: true,
    trigger: ['input', 'blur']
  }, {
    message: "会议地点长度应小于等于200",
    trigger: ['input', 'blur'],
    validator: (rule, value) => {
      return value.length <= 200
    }
  }],
  fMeetingTime: {
    message: "请选择会议时间",
    validator: (rule, value) => {
      return timestamp.value != undefined
    },
    trigger: 'blur'
  }
})
</script>

<style>
</style>
