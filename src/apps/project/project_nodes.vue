<template>
  <div style="
      width: 100%;
      padding: 0 5%;
      position: absolute;
      top: 0;
      background-color: #f5f7f9;
      z-index: 100;
    ">
    <table style="width: 100%; margin-top: 15px" cellspacing="0" cellpadding="0" border="0">
      <tr>
        <td align="center" v-for="(item, index) in steps" :class="item.active ? 'active step-cell' : 'step-cell'"
          style="position: relative">
          <span class="step-line"></span>
          <a v-if="item.open" href="javascript:void(0)" class="step-click-node"
            @click="scrollToStep(index)">{{ index + 1 }}</a>
          <a v-if="!item.open" href="javascript:void(0)" class="step-node">{{
              index + 1
            }}</a>
        </td>
      </tr>
      <tr>
        <td align="center" v-for="(item, index) in steps" :class="item.active ? 'active' : ''"
          style="position: relative">
          <a href="javascript:void(0)" @click="scrollToStep(index)"><span class="step-label">{{ item.name }}</span></a>
        </td>
      </tr>
    </table>
    <br />
    <n-form label-placement="left">
      <n-form-item label="包件过滤">
        <n-checkbox-group v-model:value="screenTitle" @update:value="updateSelect">
          <n-checkbox value="all" label="全选"></n-checkbox>
          <n-checkbox v-for="baojian in baojians" :value="baojian.value" :label="baojian.name">
          </n-checkbox>
        </n-checkbox-group>
      </n-form-item>
    </n-form>
    <!-- <XSelector field="fBaojian" label="包件" :value="value" :options="options"></XSelector> -->
  </div>
  <div class="step-container" ref="stepContainer">
    <n-space vertical>
      <n-card id="step1">
        <project-register :data="projectModel"></project-register>
      </n-card>
      <n-card id="step2" v-if="(projectModel.isProjectMember || isAdmin)">
        <preAuditUsePage :data="projectModel"></preAuditUsePage>
      </n-card>
      <n-card v-if="(projectModel.isProjectMember || isAdmin)">
        <isoApprovalProjectList :data="projectModel"></isoApprovalProjectList>
      </n-card>
      <n-card id="step3" v-if="(projectModel.isProjectMember || isAdmin)">
        <collection-files :data="projectModel"></collection-files>
      </n-card>
      <n-card id="step4" v-if="(projectModel.isProjectMember || isAdmin)">
        <meeting-kickoff @handleNodes="handleNodes" :data="projectModel"
          :isProjectNomination="isProjectNomination"></meeting-kickoff>
      </n-card>
      <n-card id="step5" v-if="steps[4].open && (projectModel.isProjectMember || isAdmin)">
        <report :open="openNodes" :data="projectModel" :isProjectStart="isProjectStart"
          @handleNodes="handleLaseTwoNodes"></report>
      </n-card>
      <n-card id="step6" v-if="steps[5].open && (projectModel.isProjectMember || isAdmin)">
        <collection-result :open="openLastTwoNodes" :data="projectModel"></collection-result>
      </n-card>
      <n-card id="step7" v-if="steps[6].open && (projectModel.isProjectMember || isAdmin)">
        <documentation :open="openLastTwoNodes" :data="projectModel"></documentation>
      </n-card>
    </n-space>
  </div>
</template>

<script setup>
  import {
    ref,
    createApp,
    getCurrentInstance,
    provide
  } from 'vue'
  import {
    useRoute,
    useRouter
  } from 'vue-router'
  import preAuditUsePage from '../credentials/pre-audit/pre_audit_usePage.vue'
  import projectRegister from './application/projectRegister.vue'
  import collectionFiles from '../collection/files/collectionFiles_edit.vue'
  import meetingKickoff from '../meeting/kickoff/meetingKickoff_page.vue'
  import report from '../report/report_page.vue'
  import collectionResult from '../collection/result/collectionResult_page.vue'
  import documentation from '../documentation/documentation_edit.vue'
  import isoApprovalProjectList from '@/apps/iso/isoApproval_projectList.vue'
  import storage from '@/utils/storage'
  import context from '@/context.js'

  import {
    format
  } from 'date-fns'
  import {
    useMenuStore
  } from '@/store/menu.js'
  import {
    useAuthStore
  } from "@/store/authStore";

  import createApi from './api'
  import request from "@/utils/request1";
  import layout from "@/layout/layout";

  const api = createApi(getCurrentInstance())
  const menuStore = useMenuStore()

  const steps = reactive([{
      name: '项目登记',
      href: 'step1',
      active: true,
      open: true,
    },
    {
      name: '资格预审',
      href: 'step2',
      active: false,
      open: true,
    },
    {
      name: '征集文件',
      href: 'step3',
      active: false,
      open: true,
    },
    {
      name: '项目启动会',
      href: 'step4',
      active: false,
      open: true,
    },
    {
      name: '汇报评审',
      href: 'step5',
      active: false,
      open: false,
    },
    {
      name: '征集结果',
      href: 'step6',
      active: false,
      open: false,
    },
    {
      name: '归档信息',
      href: 'step7',
      active: false,
      open: false,
    },
  ])
  const stepContainer = ref()

  const route = useRoute()
  if (route.query.fId && route.query.fId != menuStore.currentRouteObj.urlParams.fId) {
    menuStore.currentRouteObj.urlParams.fId = route.query.fId
    var mainContentList = storage.get("mainContentList")
    for (var i = 0; i < mainContentList.length; i++) {
      if (mainContentList[i].tabKey == "project-view") {
        mainContentList[i].urlParams.fId = route.query.fId
      }
    }
    storage.set("mainContentList", mainContentList)
  }

  function handleScroll(event) {
    var index = 1
    while (document.getElementById('step' + index) != null) {
      let item = document.getElementById('step' + index)
      if (
        stepContainer.value.parentNode.parentNode
        .scrollTop >=
        item.offsetTop - 136
      ) {
        let nextItem = document.getElementById('step' + (index + 1))
        if (nextItem != null) {
          if (
            stepContainer.value.parentNode.parentNode
            .scrollTop >=
            nextItem.offsetTop - 136
          ) {
            steps[index - 1].active = false
          } else {
            steps[index - 1].active = true
          }
        } else {
          steps[index - 1].active = true
        }
      } else {
        steps[index - 1].active = false
      }
      index++
    }
  }

  // 项目基本信息初始化数据
  const projectModel = reactive({
    fProjectCategory: {},
    selectedTags: [],
    selectedTypes: [],
    selectedNatures: [],
    isAdmin: false,
    fScales: [],
    fTypes: []
  })
  const projectStep = ref({
    isAddCollectionResult: false
  })
  provide('projectStep', projectStep)
  const projectInfo = async () => {
    let id = menuStore.currentRouteObj.urlParams.fId;
    await api.projectNoApplicationaProjectView(id).then(result => {
        const data = result.data;
        projectModel.fId = data.fId
        projectModel.fName = data.fName
        //项目简称
        projectModel.fSimpleName = data.fSimpleName
        //项目英文名称
        projectModel.fEngName = data.fEngName
        //开拓信息
        projectModel.fDevelopInfo = data.fDevelopInfo
        //协议编号
        projectModel.fProtocolNumber = data.fProtocolNumber
        //项目编号
        projectModel.fProjectNo = data.fProtocolNo
        //项目预算
        projectModel.fProjectBudget = data.fProjectBudget
        //计划用汇（美元）
        projectModel.fPlanForeignExchange = data.fPlanForeignExchange
        //涉密项目
        projectModel.fIsClassified = data.fIsClassified;
        //项目性质
        projectModel.fProjectNatureName = data.appsNatureNameArray
        projectModel.selectedNature = data.selectedNature
        projectModel.selectedNatures = data.oaNatureNameArray
        projectModel.fNotes = data.fNotes
        projectModel.fProjectNatureOther = data.fProjectNatureOther
        //项目重要性
        projectModel.projectImportance = data.projectImportance
        projectModel.selectedImportance = data.fProjectImportance
        //资金来源
        projectModel.capitalSource = data.capitalSource
        projectModel.fCapitalSource = data.fCapitalSource
        projectModel.fCapitalSourceOther = data.fCapitalSourceOther
        //项目城市、国家
        projectModel.fCity = data.fCity
        projectModel.fCountry = data.fCountry
        projectModel.selectedImportance = data.fProjectImportance
        //项目执行地
        var placeName = ""
        if (data.fExecutionCountry) {
          placeName += data.fExecutionCountry.fName
        }
        if (data.fExecutionCity) {
          placeName += " " + data.fExecutionCity.fName
        }
        projectModel.fExecutionPlace = placeName
        //项目标签
        projectModel.fProjectTag = data.appsTagNameArray
        projectModel.selectedTag = data.selectedTag
        const tagsIds = data.selectedTag.map(str => ({
          fId: str
        }));
        projectModel.selectedTags = projectModel.selectedTags.concat(tagsIds);
        projectModel.fTagOther = data.fTagOther
        //项目类型
        projectModel.selectedType = data.selectedType
        const typesIds = data.selectedType.map(str => ({
          fId: str
        }));
        projectModel.selectedTypes = projectModel.selectedTypes.concat(typesIds);
        projectModel.fTypes = data.fTypes
        projectModel.oaNatureNameArray = data.oaNatureNameArray
        projectModel.fTypeOther = data.fTypeOther
        //类别
        projectModel.fProjectCategory = data.fProjectCategory
        //项目模式
        projectModel.fProjectMode = data.fProjectMode
        //项目模式
        projectModel.projectMode = data.projectMode
        //项目地点
        projectModel.fProjectPlace = data.fProjectPlace
        //项目规模
        projectModel.fProjectScale = data.fProjectScale
        projectModel.fScales = data.fScales
        //项目规模
        projectModel.typeScales = data.typeScales
        //预期收入
        projectModel.fPlanIncome = data.fPlanIncome
        projectModel.fScale = data.fProjectScale
        //业主
        projectModel.fOwner = data.fOwner
        //部门
        projectModel.fDept = data.fDept;
        //项目经理
        projectModel.fDeptManager = data.fDeptManager
        projectModel.isManager = (projectModel.fDeptManager.fId == context.user())

        //项目组成员
        projectModel.fProjectMembers = data.fProjectMembers

        //开拓信息
        projectModel.fDevelopInfo = data.fDevelopInfo

        //项目编号
        projectModel.fProtocolNo = data.fProtocolNo

        //限制结束日期
        projectModel.fLimitFinishTime = data.fLimitFinishTime

        //达标日期
        projectModel.fQualifyTime = data.fQualifyTime

        //项目是否有项目启动会
        projectModel.fIsProjectStart = data.fIsProjectStart

        //项目是否有汇报评审
        projectModel.fIsProjectReportReview = data.fIsProjectReportReview

        projectModel.fCreateTime = format(new Date(data.fCreateTime), "yyyy-MM-dd")

        projectModel.fColFileFinTime = data.fColFileFinTime


        let isProjectDocumentation = false;
        if (data.projectDocumentation) {
          isProjectDocumentation = true
          //归档信息
          projectModel.projectDocumentation = data.projectDocumentation
        } else {
          //归档信息
          projectModel.projectDocumentation = {
            "fLimitFinishTime": format(Date.now(), 'yyyy-MM-dd HH:mm:ss'),
            "fQuelifyTime": format(Date.now(), 'yyyy-MM-dd HH:mm:ss'),
            "fPerpormanceTime": format(Date.now(), 'yyyy-MM-dd HH:mm:ss'),
            "fDevelopTime": format(Date.now(), 'yyyy-MM-dd HH:mm:ss'),
          }
        }
        projectModel.isProjectDocumentation = isProjectDocumentation

        //是否项目组内成员
        var isProjectMember = false
        isProjectMember = isProjectMember || projectModel.isManager
        for (var i = 0; i < projectModel.fProjectMembers.length; i++) {
          isProjectMember =
            isProjectMember ||
            projectModel.fProjectMembers[i].fId == context.user()
        }
        projectModel.isProjectMember = isProjectMember
        projectModel.fAuditStatus = data.fAuditStatus
      })
      .catch((err) => {
        layout.close("project-view")
        layout.open({
          label: "无权限",
          key: "NoPermission",
          component: '/views/common/403.vue'
        })
      })

    //读取包件信息
    await api.projectPackageList({
        query: {
          eq: {
            'fMainId.fId': id,
          },
        },
      })
      .then(function(res) {
        if (res.status == 200) {
          baojians.value.length = 0
          var list = res.data.list
          for (var i = 0; i < list.length; i++) {
            baojians.value.push({
              value: list[i].fId,
              label: "包件" + list[i].fIndex + ":" + list[i].fName,
              name: "包件" + list[i].fIndex + ":" + list[i].fName,
            })
          }

          screenTitle.value.push('all')
          for (var i = 0; i < baojians.value.length; i++) {
            screenTitle.value.push(baojians.value[i].value)
            selectedPackageName.value.push(baojians.value[i].name)
          }
        }
      })
  }
  //
  // watch(() => menuStore.currentRouteObj.urlParams.fId, (query) => {
  //   projectInfo(query);
  // })

  const isAdmin = ref(false)

  //判断当前用户是否是管理员
  const checkIsAdminRoleUser = async () => {
    api.checkIsAdminRole().then(function(res) {
      if (res.status === 200) {
        isAdmin.value = res.data.isAdmin
      }
    })
  }

  const authStore = useAuthStore()
  const auth = authStore.getAuth(context.user())
  Promise.all([auth]).then((res) => {
    projectModel.isAdmin = res[0].includes("AUTH_ADMIN")
    isAdmin.value = projectModel.isAdmin
  })


  const isProjectStart = ref(false);
  //检查项目启动会是否是有数据
  const checkProjectStarts = () => {
    api.checkProjectStart(menuStore.currentRouteObj.urlParams.fId).then(function(res) {
      if (res.status === 200) {
        isProjectStart.value = res.data.isOk;
      }
    });
  }

  const isProjectNomination = ref(false);
  //检测项目是否有入围结果
  const checkProjectNomination = () => {
    api.checkProjectNominationResults(menuStore.currentRouteObj.urlParams.fId).then(function(res) {
      if (res.status === 200) {
        isProjectNomination.value = res.data.isOk
      }
    });
  }

  onMounted(() => {
    //2024-9-8 蔡咏钦 由于权限实际用法是和ekp类似的用法，因此此段权限判断先注释不使用
    //checkIsAdminRoleUser();
    checkProjectStarts();
    checkProjectNomination();
    stepContainer.value.parentNode.parentNode.addEventListener(
      'mousewheel',
      handleScroll,
    )
    if (menuStore.currentRouteObj.urlParams !== undefined) {
      projectInfo()
    }
  })

  const scrollToStep = (index) => {
    if (!projectModel.isProjectMember) {
      return
    }
    if (index == 0) {
      stepContainer.value.parentNode.parentNode.scrollTop = 33
    } else {
      let item = document.getElementById('step' + index)
      stepContainer.value.parentNode.parentNode.scrollTop =
        item.offsetTop + item.clientHeight - 126
    }
    for (var i = 0; i < steps.length; i++) {
      if (i == index) {
        steps[i].active = true
      } else {
        steps[i].active = false
      }
    }
  }

  function clickNode(index) {
    scrollToStep(index + 1)
  }

  function updateSelect(vals, action) {
    if (action.value == 'all') {
      vals = []
      screenTitle.value = []
      selectedPackageName.value = []
      if (action.actionType == 'check') {
        vals.push('all')
        screenTitle.value.push('all')
        for (var i = 0; i < baojians.value.length; i++) {
          vals.push(baojians.value[i].value)
          screenTitle.value.push(baojians.value[i].value)
          selectedPackageName.value.push(baojians.value[i].name)
        }
      }
    } else {
      for (var i = 0; i < baojians.value.length; i++) {
        if (baojians.value[i].value == action.value) {
          if (action.actionType == 'check') {
            selectedPackageName.value.push(baojians.value[i].name)
          } else {
            if (selectedPackageName.value.indexOf(baojians.value[i].name) >= 0) {
              selectedPackageName.value.splice(
                selectedPackageName.value.indexOf(baojians.value[i].name),
                1,
              )
            }
          }
        }
      }
      if (action.actionType == 'check') {
        if (vals.length == baojians.value.length) {
          vals.push('all')
        }
      } else {
        if (vals.indexOf('all') >= 0) {
          vals.splice(vals.indexOf('all'), 1)
        }
      }
    }
  }

  const indeterminate = ref(false)
  const screenTitle = ref([])
  const selectedPackageName = ref([])
  const baojians = ref([])
  const bidCount = ref(0)

  provide("bidCount", bidCount)
  provide("selectedPackageId", screenTitle)
  provide("selectedPackageName", selectedPackageName)
  provide("baojians", baojians)
  provide('checkProjectStarts', checkProjectStarts)
  provide('checkProjectNomination', checkProjectNomination)

  const finishDocumentation = ref(false)
  provide('finishDocumentation', finishDocumentation)
  provide('isAdmin', isAdmin)

  function changeSelect() {
    console.log('changeSelect')
  }

  const value = ref([])

  const openNodes = ref(false)
  const openLastTwoNodes = ref(false)

  /**
   * 处理节点是否可点选跳转
   */
  function handleNodes(hasMeetingOff) {
    for (var i = 0; i < steps.length; i++) {
      var step = steps[i]
      if (i <= 3) {
        step.open = true;
      } else if (i === 4) {
        step.open = hasMeetingOff;
      }
    }
    openNodes.value = hasMeetingOff
  }

  /**
   * 处理节点是否可点选跳转
   */
  function handleLaseTwoNodes(hasMeetingOff) {
    for (var i = 0; i < steps.length; i++) {
      var step = steps[i]
      step.open = i <= 4 ? true : hasMeetingOff
    }
    openLastTwoNodes.value = hasMeetingOff
  }
</script>

<style scoped>
  .step-click-node {
    display: inline-block;
    width: 2.4em;
    height: 2.4em;
    border-radius: 50%;
    line-height: 2.4em;
    text-align: center;
    color: black;
    background-color: lightgreen;
    cursor: pointer;
    z-index: 10;
    position: relative;
  }

  .step-node {
    display: inline-block;
    width: 2.4em;
    height: 2.4em;
    border-radius: 50%;
    line-height: 2.4em;
    text-align: center;
    color: black;
    background-color: lightgray;
    cursor: pointer;
    z-index: 10;
    position: relative;
  }

  .step-label {
    display: inline-block;
    padding-top: 10px;
  }

  .step-line {
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 2px;
    background-color: lightgray;
  }

  .step-cell:first-child .step-line {
    left: 50%;
  }

  .step-cell:last-child .step-line {
    right: 50%;
  }

  .active .step-node {
    color: white;
    background-color: #13aaff !important;
  }

  .active .step-click-node {
    color: white;
    background-color: #13aaff !important;
  }

  .active .step-line {
    background-color: #13aaff !important;
  }

  .step-container {
    padding-top: 9em;
  }

  .step-content {
    height: 20em;
    border: 1px solid black;
  }
</style>
