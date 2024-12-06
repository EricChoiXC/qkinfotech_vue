<script setup>

import pages from '@/router/pages.js'
import { defineAsyncComponent } from 'vue'

const props = defineProps({
  data: {
    type: Object,
  },
})

const isTab = computed(() => {
  if (!props.data?.display) {
    // 默认为tab
    return props.data?.component || props.data?.url
  }
  return props.data?.display === 'tab'
})

const isDialog = computed(() => props.data?.display === 'dialog')

const isWindow = computed(() => props.data?.display === 'window')
/*
import workbench from '@/apps/desktop.vue'
import developing from '@/apps/projectManagement/explore/pp.vue'
import bidding from '@/apps/projectManagement/explore/pua.vue'
import number from '@/apps/project/application/projectApplication_add.vue'
import pending from '@/apps/project/application/projectApplication_list.vue'
import overview from '@/apps/project/application/projectApplication_finishList.vue'
import approval from '@/apps/project/approval/approval_view.vue'
import packageView from '@/apps/supplier/packageView.vue'
import supplierEdit from '@/apps/supplier/supplier_edit.vue'
import supplierView from '@/apps/supplier/supplier_view.vue'
import supplierAdd from '@/apps/supplier/supplier_add.vue'
import union from '@/apps/supplier/supplier_union_edit.vue'
import projectView from '@/apps/project/project_nodes.vue'
import filsView from '@/apps/supplier/preview/preview_pdf_view.vue'
import documentationFiles from '@/apps/documentation/documentation_files_view.vue'
import iso from '@/apps/projectManagement/implementation/po.vue'
import isoView from '@/apps/projectManagement/implementation/view.vue'
// import personList from '@/components/org/person/listPerson.vue'
import orgList from '@/components/org/listOrg.vue'
import listGroup from '@/components/org/group/listGroup.vue'
// import listPost from '@/components/org/post/listPost.vue'
// import listTitle from '@/components/org/title/listTitle.vue'
 import roleList from '@/components/org/role/orgRoleList.vue'
 import empowerRole from '@/components/org/role/orgRoleAuthorityList.vue'
 import authedRole from '@/components/org/role/orgRoleElementList.vue'
 import rolePersonTree from '@/components/org/role/orgRolePersonTree.vue'
 import roleAuthorityTree from '@/components/org/role/orgRoleAuthorityTree.vue'
import ekpConfig from '@/sys/config/ekpConfig.vue'
import systemTaskConfig from '@/sys/task/systemTaskList.vue'
import userTaskConfig from '@/sys/task/userTaskList.vue'
import category from '@/sys/masterData/category/categoryList.vue'
import importance from '@/sys/masterData/importance/list.vue'
import nature from '@/sys/masterData/nature/natrueList.vue'
import place from '@/sys/masterData/place/placeList.vue'
import tag from '@/sys/masterData/tag/tagList.vue'
import type from '@/sys/masterData/type/typeList.vue'
import scale from '@/sys/masterData/scale/scaleList.vue'
import fund from '@/sys/masterData/fund/fundList.vue'
import mode from '@/sys/masterData/mode/modeList.vue'
import meetType from '@/sys/masterData/meetingType/meetingTypeList.vue'
import actionSuccess from '@/apps/common/successPage.vue'
import categoryAdd from '@/sys/masterData/category/categoryAdd.vue'
import categoryEdit from '@/sys/masterData/category/categoryEdit.vue'
import categoryView from '@/sys/masterData/category/categoryView.vue'
import importanceAdd from '@/sys/masterData/importance/add.vue'
import importanceView from '@/sys/masterData/importance/view.vue'
import importanceEdit from '@/sys/masterData/importance/edit.vue'
import meetingTypeView from '@/sys/masterData/meetingType/meetingTypeView.vue'
import meetingTypeEdit from '@/sys/masterData/meetingType/meetingTypeEdit.vue'
import meetingTypeAdd from '@/sys/masterData/meetingType/meetingTypeAdd.vue'
import modeView from '@/sys/masterData/mode/modeView.vue'
import modeEdit from '@/sys/masterData/mode/modeEdit.vue'
import modeAdd from '@/sys/masterData/mode/modeAdd.vue'
import natureView from '@/sys/masterData/nature/natrueView.vue'
import natureEdit from '@/sys/masterData/nature/natrueEdit.vue'
import natureAdd from '@/sys/masterData/nature/natrueAdd.vue'
import placeView from '@/sys/masterData/place/placeView.vue'
import placeEdit from '@/sys/masterData/place/placeEdit.vue'
import placeAdd from '@/sys/masterData/place/placeAdd.vue'
import tagView from '@/sys/masterData/tag/tagView.vue'
import tagEdit from '@/sys/masterData/tag/tagEdit.vue'
import tagAdd from '@/sys/masterData/tag/tagAdd.vue'
import typeView from '@/sys/masterData/type/typeView.vue'
import typeEdit from '@/sys/masterData/type/typeEdit.vue'
import typeAdd from '@/sys/masterData/type/typeAdd.vue'
import scaleView from '@/sys/masterData/scale/scaleView.vue'
import scaleEdit from '@/sys/masterData/scale/scaleEdit.vue'
import scaleAdd from '@/sys/masterData/scale/scaleAdd.vue'
import fundView from '@/sys/masterData/fund/fundView.vue'
import fundEdit from '@/sys/masterData/fund/fundEdit.vue'
import fundAdd from '@/sys/masterData/fund/fundAdd.vue'
import countryAdd from '@/sys/masterData/country/countryAdd.vue'
import countryEdit from '@/sys/masterData/country/countryEdit.vue'
import countryList from '@/sys/masterData/country/countryList.vue'
import countryView from '@/sys/masterData/country/countryView.vue'
import isoApprovalList from '@/apps/iso/isoApproval_list.vue'
import isoApprovalView from '@/apps/iso/isoApproval_view.vue'
import isoApprovalEdit from '@/apps/iso/isoApproval_edit.vue'
import menuList from '@/sys/menu/list.vue'
import syncPage from '@/sys/menu/sync.vue'
import listAssemblyAuth from '@/apps/assembly/listAssemblyAuth.vue'
import listShortcuts from '@/apps/shortcuts/listShortcuts.vue'
import interfaceInfoList from '@/sys/interface/interfaceList.vue'
import interfaceInfoView from '@/sys/interface/interfaceView.vue'

import interfaceUrlConfigList from '@/sys/interface/interfaceUrlConfigList.vue'
import interfaceUrlConfigView from '@/sys/interface/interfaceUrlConfigView.vue'
import RegistrationView from '@/apps/credentials/pre-audit/notice/notice_company_view.vue'
import filesSerch from '@/apps/credentials/pre-audit/filesSerch.vue'
import masterTextTemplateEdit from '@/sys/masterData/textTemplate/masterTextTemplate_edit.vue'
import masterTextTemplateView from '@/sys/masterData/textTemplate/masterTextTemplate_view.vue'
import masterTextTemplateList from '@/sys/masterData/textTemplate/masterTextTemplate_list.vue'

const maps = {
  // "/apps/desktop.vue": {'component':workbench,'name':"工作台",key:"workbench"},
  // "/apps/projectManagement/explore/pp.vue": {'component':developing,'name':"开拓流程","key":"explore"},
  '/apps/desktop.vue': workbench,
  '/apps/projectManagement/explore/pp.vue': developing,
  '/apps/projectManagement/explore/pua.vue': bidding,
  '/apps/project/application/projectApplication_add.vue': number,
  '/apps/project/application/projectApplication_list.vue': pending,
  '/apps/project/application/projectApplication_finishList.vue': overview,
  '/apps/project/approval/approval_view.vue': approval,
  '/apps/supplier/packageView.vue': packageView,
  '/apps/supplier/supplier_add.vue': supplierAdd,
  '/apps/supplier/supplier_edit.vue': supplierEdit,
  '/apps/supplier/supplier_view.vue':supplierView,
  '/apps/supplier/supplier_union_edit.vue': union,
  '/apps/project/project_nodes.vue': projectView,
  '/apps/supplier/preview/preview_pdf_view.vue': filsView,
  '/apps/documentation/documentation_files_view.vue': documentationFiles,
  '/apps/projectManagement/implementation/po.vue': iso,
  '/apps/projectManagement/implementation/view.vue': isoView,
  // '/components/org/person/listPerson.vue': personList,
  '/components/org/listOrg.vue': orgList,
  '/components/org/group/listGroup.vue': listGroup,
  // '/components/org/post/listPost.vue': listPost,
  // '/components/org/title/listTitle.vue': listTitle,
  '/components/org/role/orgRoleList.vue': roleList,
  '/components/org/role/orgRoleAuthorityList.vue': empowerRole,
  '/components/org/role/orgRoleElementList.vue': authedRole,
  '/components/org/role/orgRolePersonTree.vue': rolePersonTree,
  '/components/org/role/orgRoleAuthorityTree.vue': roleAuthorityTree,
  '/sys/config/ekpConfig.vue': ekpConfig,
  '/sys/task/systemTaskList.vue': systemTaskConfig,
  '/sys/task/userTaskList.vue': userTaskConfig,
  '/sys/masterData/category/categoryList.vue': category,
  '/sys/masterData/importance/list.vue': importance,
  '/sys/masterData/nature/natrueList.vue': nature,
  '/sys/masterData/place/placeList.vue': place,
  '/sys/masterData/tag/tagList.vue': tag,
  '/sys/masterData/type/typeList.vue': type,
  '/sys/masterData/scale/scaleList.vue': scale,
  '/sys/masterData/fund/fundList.vue': fund,
  '/sys/masterData/mode/modeList.vue': mode,
  '/sys/masterData/meetingType/meetingTypeList.vue': meetType,
  '/apps/common/successPage.vue': actionSuccess,
  '/sys/masterData/category/categoryAdd.vue': categoryAdd,
  '/sys/masterData/category/categoryEdit.vue': categoryEdit,
  '/sys/masterData/category/categoryView.vue': categoryView,
  '/sys/masterData/importance/add.vue': importanceAdd,
  '/sys/masterData/importance/view.vue': importanceView,
  '/sys/masterData/importance/edit.vue': importanceEdit,
  '/sys/masterData/meetingType/meetingTypeView.vue': meetingTypeView,
  '/sys/masterData/meetingType/meetingTypeEdit.vue': meetingTypeEdit,
  '/sys/masterData/meetingType/meetingTypeAdd.vue': meetingTypeAdd,
  '/sys/masterData/mode/modeView.vue': modeView,
  '/sys/masterData/mode/modeEdit.vue': modeEdit,
  '/sys/masterData/mode/modeAdd.vue': modeAdd,
  '/sys/masterData/nature/natrueView.vue': natureView,
  '/sys/masterData/nature/natrueEdit.vue': natureEdit,
  '/sys/masterData/nature/natrueAdd.vue': natureAdd,
  '/sys/masterData/place/placeView.vue': placeView,
  '/sys/masterData/place/placeEdit.vue': placeEdit,
  '/sys/masterData/place/placeAdd.vue': placeAdd,
  '/sys/masterData/tag/tagView.vue': tagView,
  '/sys/masterData/tag/tagEdit.vue': tagEdit,
  '/sys/masterData/tag/tagAdd.vue': tagAdd,
  '/sys/masterData/type/typeView.vue': typeView,
  '/sys/masterData/type/typeEdit.vue': typeEdit,
  '/sys/masterData/type/typeAdd.vue': typeAdd,
  '/sys/masterData/scale/scaleView.vue': scaleView,
  '/sys/masterData/scale/scaleEdit.vue': scaleEdit,
  '/sys/masterData/scale/scaleAdd.vue': scaleAdd,
  '/sys/masterData/fund/fundView.vue': fundView,
  '/sys/masterData/fund/fundEdit.vue': fundEdit,
  '/sys/masterData/fund/fundAdd.vue': fundAdd,
  '/sys/masterData/country/countryAdd.vue': countryAdd,
  '/sys/masterData/country/countryEdit.vue': countryEdit,
  '/sys/masterData/country/countryList.vue': countryList,
  '/sys/masterData/country/countryView.vue': countryView,
  '/apps/iso/isoApproval_list.vue': isoApprovalList,
  '/apps/iso/isoApproval_view.vue': isoApprovalView,
  '/apps/iso/isoApproval_edit.vue': isoApprovalEdit,
  '/sys/menu/list.vue': menuList,
  '/sys/menu/sync.vue': syncPage,
  '/apps/assembly/listAssemblyAuth.vue': listAssemblyAuth,
  '/apps/shortcuts/listShortcuts.vue': listShortcuts,
  '/sys/interface/interfaceList.vue': interfaceInfoList,
  '/sys/interface/interfaceView.vue': interfaceInfoView,
  '/sys/interface/interfaceUrlConfigList.vue': interfaceUrlConfigList,
  '/sys/interface/interfaceUrlConfigView.vue': interfaceUrlConfigView,
  '/apps/credentials/pre-audit/notice/notice_company_view.vue': RegistrationView,
  '/apps/credentials/pre-audit/filesSerch.vue': filesSerch,
  '/sys/masterData/textTemplate/masterTextTemplate_edit.vue': masterTextTemplateEdit,
  '/sys/masterData/textTemplate/masterTextTemplate_view.vue': masterTextTemplateView,
  '/sys/masterData/textTemplate/masterTextTemplate_list.vue': masterTextTemplateList
}
*/

const component = computed(() => {
  if (!props.data) return
  //return pages[props.data.key].component()
  return defineAsyncComponent(pages[props.data.key].component)
})

const showDialog = () => {
  window
    .$modal(
      component.value,
      {},
      {
        title: '编辑',
      },
    )
    .then((v) => {
      window.$message.success(JSON.stringify(v))
    })
}

let currentWinId

const actions = {
  dialog: () => {
    showDialog()
  },
  window: () => {
    currentWinId = window.open('/#/component', '_blank')
  },
}

watch(
  () => props.data?.display,
  (val) => {
    actions[val]?.()
  },
)
</script>

<template>
  <component v-if="isTab && data.tabKey" :is="component" v-bind="data.urlParams"></component>

  <iframe v-if="isTab && data?.url" :src="data?.url" class="size-full"></iframe>
</template>
