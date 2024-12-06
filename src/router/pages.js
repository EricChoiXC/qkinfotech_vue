export default {
  workbench: {
    label: '工作台',
    component: () => import('@/apps/desktop.vue'),
    path: '/home/workbench',
    url: '/apps/desktop.vue',
  },
  todo: {
    label: '待办',
    component: () => import('@/apps/notify/notifyList.vue'),
    path: '/home/todo',
  },
  listShortcut: {
    label: '快捷方式',
    component: () => import('@/apps/home/workbench.vue'),
    path: '/home/listShortcut',
  },
  developing: {
    label: '开拓流程',
    component: () => import('@/apps/projectManagement/explore/pp.vue'),
    path: '/projectManagement/explore/developing',
  },
  bidding: {
    label: '投标流程',
    component: () => import('@/apps/projectManagement/explore/pua.vue'),
    path: '/projectManagement/explore/bidding',
  },
  'pending-protocol': {
    label: '协议流程',
    component: () => import('@/apps/projectManagement/explore/protocol.vue'),
    path: '/projectManagement/explore/pending-protocol',
  },
  'pending-charge': {
    label: '收费标准',
    component: () => import('@/apps/projectManagement/explore/charge.vue'),
    path: '/projectManagement/explore/pending-charge',
  },
  'protocol-template': {
    label: '协议模板',
    component: () =>
      import('@/apps/projectManagement/explore/protocolTemplate.vue'),
    path: '/projectManagement/explore/protocol-template',
  },
  'project-agreement-info': {
    label: '结算审批流程信息',
    component: () =>
      import('@/apps/projectManagement/explore/project_agreement_info.vue'),
    path: '/projectManagement/explore/project-agreement-info',
  },
  'project-number-application': {
    label: '项目编号申请(方案征集)',
    component: () =>
      import('@/apps/project/application/projectApplication_add.vue'),
    path: '/projectManagement/implementation/project-number-application',
  },
  number: {
    label: '项目编号申请(方案征集)',
    component: () =>
      import('@/apps/project/application/projectApplication_add.vue'),
    path: '/projectManagement/implementation/project-number-application',
  },
  'project-overview': {
    label: '项目信息查询(方案征集)',
    component: () =>
      import('@/apps/project/application/projectApplication_finishList.vue'),
    path: '/projectManagement/implementation/project-overview',
  },
  overview: {
    label: '项目信息查询(方案征集)',
    component: () =>
      import('@/apps/project/application/projectApplication_finishList.vue'),
    path: '/projectManagement/implementation/project-overview',
  },
  'project-view': {
    label: '项目详情',
    component: () => import('@/apps/project/project_nodes.vue'),
    path: '/projectManagement/implementation/project-view',
    url: '/apps/project/project_nodes.vue',
  },
  projectView: {
    label: '项目详情',
    component: () => import('@/apps/project/project_nodes.vue'),
    path: '/projectManagement/implementation/project-view',
  },
  'pending-projects': {
    label: '待审项目一览(方案征集)',
    component: () =>
      import('@/apps/project/application/projectApplication_list.vue'),
    path: '/projectManagement/implementation/pending-projects',
  },
  pending: {
    label: '待审项目一览(方案征集)',
    component: () =>
      import('@/apps/project/application/projectApplication_list.vue'),
    path: '/projectManagement/implementation/pending-projects',
  },
  approval: {
    label: '待审项目审批页',
    component: () => import('@/apps/project/approval/approval_view.vue'),
    path: '/projectManagement/implementation/approval',
  },
  'package-view': {
    label: '资格申请包件预览',
    component: () => import('@/apps/supplier/packageView.vue'),
    path: '/projectManagement/implementation/package-view',
  },
  packageView: {
    label: '资格申请包件预览',
    component: () => import('@/apps/supplier/packageView.vue'),
    path: '/projectManagement/implementation/package-view',
  },
  'supplier-edit': {
    label: '资格申请',
    component: () => import('@/apps/supplier/supplier_edit.vue'),
    path: '/projectManagement/implementation/supplier-edit',
  },
  supplierEdit: {
    label: '资格申请',
    component: () => import('@/apps/supplier/supplier_edit.vue'),
    path: '/projectManagement/implementation/supplier-edit',
  },
  'supplier-view': {
    label: '资格申请查看',
    component: () => import('@/apps/supplier/supplier_view.vue'),
    path: '/projectManagement/implementation/supplier-view',
  },
  supplierView: {
    label: '资格申请查看',
    component: () => import('@/apps/supplier/supplier_view.vue'),
    path: '/projectManagement/implementation/supplier-view',
  },
  'supplier-add': {
    label: '资格申请',
    component: () => import('@/apps/supplier/supplier_add.vue'),
    path: '/projectManagement/implementation/supplier-add',
  },
  supplierAdd: {
    label: '资格申请',
    component: () => import('@/apps/supplier/supplier_add.vue'),
    path: '/projectManagement/implementation/supplier-add',
  },
  'supplier-union-view': {
    label: '联合申请',
    component: () => import('@/apps/supplier/supplier_union_edit.vue'),
    path: '/projectManagement/implementation/supplier-union-view',
  },
  union: {
    label: '联合申请',
    component: () => import('@/apps/supplier/supplier_union_edit.vue'),
    path: '/projectManagement/implementation/supplier-union-view',
  },
  filesSerch: {
    label: '文件搜索',
    component: () => import('@/apps/credentials/pre-audit/filesSerch.vue'),
    path: '/projectManagement/implementation/filesSerch',
  },
  RegistrationView: {
    label: '登记信息',
    component: () =>
      import('@/apps/credentials/pre-audit/notice/notice_company_view.vue'),
    path: '/projectManagement/implementation/RegistrationView',
  },
  'documentation-files': {
    label: '电子归档',
    component: () =>
      import('@/apps/documentation/documentation_files_view.vue'),
    path: '/projectManagement/implementation/documentation-files',
  },
  documentationFiles: {
    label: '电子归档',
    component: () =>
      import('@/apps/documentation/documentation_files_view.vue'),
    path: '/projectManagement/implementation/documentation-files',
  },
  'project-iso': {
    label: '成果产品检验流转单',
    component: () => import('@/apps/iso/isoApproval_list.vue'),
    path: '/projectManagement/implementation/project-iso',
  },
  isoApprovalList: {
    label: '成果产品检验流转单',
    component: () => import('@/apps/iso/isoApproval_list.vue'),
    path: '/projectManagement/implementation/project-iso',
  },
  'project-iso-view': {
    label: '成果产品检验流转单查看页',
    component: () => import('@/apps/iso/isoApproval_view.vue'),
    path: '/projectManagement/implementation/project-iso-view',
  },
  isoApprovalView: {
    label: '成果产品检验流转单查看页',
    component: () => import('@/apps/iso/isoApproval_view.vue'),
    path: '/projectManagement/implementation/project-iso-view',
  },
  'project-iso-edit': {
    label: '成果产品检验流转单审批页',
    component: () => import('@/apps/iso/isoApproval_edit.vue'),
    path: '/projectManagement/implementation/project-iso-edit',
  },
  isoApprovalEdit: {
    label: '成果产品检验流转单审批页',
    component: () => import('@/apps/iso/isoApproval_edit.vue'),
    path: '/projectManagement/implementation/project-iso-edit',
  },
  orgList: {
    label: '组织架构',
    component: () => import('@/components/org/listOrg.vue'),
    path: '/sys/org/orgList',
  },
  listGroup: {
    label: '群组',
    component: () => import('@/components/org/group/listGroup.vue'),
    path: '/sys/org/listGroup',
  },
  roleList: {
    label: '角色管理',
    component: () => import('@/components/org/role/orgRoleList.vue'),
    path: '/sys/auth/roleList',
  },
  empowerRole: {
    label: '赋权角色',
    component: () => import('@/components/org/role/orgRoleAuthorityList.vue'),
    path: '/sys/auth/empowerRole',
  },
  authedRole: {
    label: '授权角色',
    component: () => import('@/components/org/role/orgRoleElementList.vue'),
    path: '/sys/auth/authedRole',
  },
  authed: {
    label: '员工授权查询',
    component: () => import('@/components/org/role/orgRolePersonTree.vue'),
    path: '/sys/auth/authed',
  },
  rolePersonTree: {
    label: '员工授权查询',
    component: () => import('@/components/org/role/orgRolePersonTree.vue'),
    path: '/sys/auth/authed',
  },
  roleAuthorityTree: {
    label: '角色授权查询',
    component: () => import('@/components/org/role/orgRoleAuthorityTree.vue'),
    path: '/sys/auth/roleAuthorityTree',
  },
  // 'authed':{
  //   label:'角色授权查询',
  //   component:() => import('@/components/org/role/orgRoleAuthorityTree.vue'),
  //   path:'/sys/auth/authed'
  // },
  menuAuth: {
    label: '菜单权限管理',
    component: () => import('@/sys/menu/list.vue'),
    path: '/sys/auth/menuAuth',
  },
  menuList: {
    label: '菜单权限管理',
    component: () => import('@/sys/menu/list.vue'),
    path: '/sys/auth/menuList',
  },
  syncPage: {
    label: '同步页面数据',
    component: () => import('@/sys/menu/sync.vue'),
    path: '/sys/auth/syncPage',
  },
  listAssemblyAuth: {
    label: '组件权限',
    component: () => import('@/apps/assembly/listAssemblyAuth.vue'),
    path: '/sys/auth/listAssemblyAuth',
  },
  listShortcuts: {
    label: '快捷方式配置',
    component: () => import('@/apps/shortcuts/listShortcuts.vue'),
    path: '/sys/workbech/listShortcuts',
  },
  ekpConfig: {
    label: 'ekp配置',
    component: () => import('@/sys/config/ekpConfig.vue'),
    path: '/sys/system/ekpConfig',
  },
  systemTaskConfig: {
    label: '系统定时任务',
    component: () => import('@/sys/task/systemTaskList.vue'),
    path: '/sys/system/systemTaskConfig',
  },
  userTaskConfig: {
    label: '用户定时任务',
    component: () => import('@/sys/task/userTaskList.vue'),
    path: '/sys/system/userTaskConfig',
  },
  interfaceInfoList: {
    label: '接口调用信息',
    component: () => import('@/sys/interface/interfaceList.vue'),
    path: '/sys/system/interfaceInfoList',
  },
  interfaceInfoView: {
    label: '接口信息查询',
    component: () => import('@/sys/interface/interfaceView.vue'),
    path: '/sys/system/interfaceInfoView',
  },
  interfaceUrlConfigList: {
    label: '接口地址配置',
    component: () => import('@/sys/interface/interfaceUrlConfigList.vue'),
    path: '/sys/system/interfaceUrlConfigList',
  },
  interfaceUrlConfigView: {
    label: '接口地址查看',
    component: () => import('@/sys/interface/interfaceUrlConfigView.vue'),
    path: '/sys/system/interfaceUrlConfigView',
  },
  'masterData-category': {
    label: '项目类别',
    component: () => import('@/sys/masterData/category/categoryList.vue'),
    path: '/sys/master/masterData-category',
  },
  category: {
    label: '项目类别',
    component: () => import('@/sys/masterData/category/categoryList.vue'),
    path: '/sys/master/category',
  },
  'masterData-importance': {
    label: '项目重要性',
    component: () => import('@/sys/masterData/importance/list.vue'),
    path: '/sys/master/masterData-importance',
  },
  importance: {
    label: '项目重要性',
    component: () => import('@/sys/masterData/importance/list.vue'),
    path: '/sys/master/masterData-importance',
  },
  'masterData-nature': {
    label: '项目性质',
    component: () => import('@/sys/masterData/nature/natrueList.vue'),
    path: '/sys/master/masterData-nature',
  },
  nature: {
    label: '项目性质',
    component: () => import('@/sys/masterData/nature/natrueList.vue'),
    path: '/sys/master/masterData-nature',
  },
  'masterData-place': {
    label: '项目地点',
    component: () => import('@/sys/masterData/place/placeList.vue'),
    path: '/sys/master/masterData-place',
  },
  place: {
    label: '项目地点',
    component: () => import('@/sys/masterData/place/placeList.vue'),
    path: '/sys/master/masterData-place',
  },
  'masterData-country': {
    label: '项目地点',
    component: () => import('@/sys/masterData/country/countryList.vue'),
    path: '/sys/master/masterData-country',
  },
  countryList: {
    label: '项目地点',
    component: () => import('@/sys/masterData/country/countryList.vue'),
    path: '/sys/master/masterData-country',
  },
  'masterData-tag': {
    label: '项目标签',
    component: () => import('@/sys/masterData/tag/tagList.vue'),
    path: '/sys/master/masterData-tag',
  },
  tag: {
    label: '项目标签',
    component: () => import('@/sys/masterData/tag/tagList.vue'),
    path: '/sys/master/masterData-tag',
  },
  'masterData-type': {
    label: '项目类型',
    component: () => import('@/sys/masterData/type/typeList.vue'),
    path: '/sys/master/masterData-type',
  },
  type: {
    label: '项目类型',
    component: () => import('@/sys/masterData/type/typeList.vue'),
    path: '/sys/master/masterData-type',
  },
  'masterData-scale': {
    label: '项目规模',
    component: () => import('@/sys/masterData/scale/scaleList.vue'),
    path: '/sys/master/masterData-scale',
  },
  scale: {
    label: '项目规模',
    component: () => import('@/sys/masterData/scale/scaleList.vue'),
    path: '/sys/master/masterData-scale',
  },
  'masterData-fund': {
    label: '资金来源',
    component: () => import('@/sys/masterData/fund/fundList.vue'),
    path: '/sys/master/masterData-fund',
  },
  fund: {
    label: '资金来源',
    component: () => import('@/sys/masterData/fund/fundList.vue'),
    path: '/sys/master/masterData-fund',
  },
  'masterData-mode': {
    label: '项目模式',
    component: () => import('@/sys/masterData/mode/modeList.vue'),
    path: '/sys/master/masterData-mode',
  },
  mode: {
    label: '项目模式',
    component: () => import('@/sys/masterData/mode/modeList.vue'),
    path: '/sys/master/masterData-mode',
  },
  'masterData-meetType': {
    label: '项目会议类型',
    component: () => import('@/sys/masterData/meetingType/meetingTypeList.vue'),
    path: '/sys/master/masterData-meetType',
  },
  meetType: {
    label: '项目会议类型',
    component: () => import('@/sys/masterData/meetingType/meetingTypeList.vue'),
    path: '/sys/master/masterData-meetType',
  },
  actionSuccess: {
    label: '成功页面',
    component: () => import('@/apps/common/successPage.vue'),
    path: '/sys/master/actionSuccess',
  },
  masterDataCategoryAdd: {
    label: '新增项目类别',
    component: () => import('@/sys/masterData/category/categoryAdd.vue'),
    path: '/sys/master/masterDataCategoryAdd',
  },
  categoryAdd: {
    label: '新增项目类别',
    component: () => import('@/sys/masterData/category/categoryAdd.vue'),
    path: '/sys/master/masterDataCategoryAdd',
  },
  masterDataCategoryEdit: {
    label: '编辑项目类别',
    component: () => import('@/sys/masterData/category/categoryEdit.vue'),
    path: '/sys/master/masterDataCategoryEdit',
  },
  categoryEdit: {
    label: '编辑项目类别',
    component: () => import('@/sys/masterData/category/categoryEdit.vue'),
    path: '/sys/master/masterDataCategoryEdit',
  },
  masterDataCategoryView: {
    label: '查看项目类别',
    component: () => import('@/sys/masterData/category/categoryView.vue'),
    path: '/sys/master/masterDataCategoryView',
  },
  categoryView: {
    label: '查看项目类别',
    component: () => import('@/sys/masterData/category/categoryView.vue'),
    path: '/sys/master/masterDataCategoryView',
  },
  masterDataImportanceview: {
    label: '查看项目重要性',
    component: () => import('@/sys/masterData/importance/view.vue'),
    path: '/sys/master/masterDataImportanceview',
  },
  importanceView: {
    label: '查看项目重要性',
    component: () => import('@/sys/masterData/importance/view.vue'),
    path: '/sys/master/masterDataImportanceview',
  },
  masterDataImportanceedit: {
    label: '编辑项目重要性',
    component: () => import('@/sys/masterData/importance/edit.vue'),
    path: '/sys/master/masterDataImportanceedit',
  },
  importanceEdit: {
    label: '编辑项目重要性',
    component: () => import('@/sys/masterData/importance/edit.vue'),
    path: '/sys/master/masterDataImportanceedit',
  },
  masterDataImportanceAdd: {
    label: '新增项目重要性',
    component: () => import('@/sys/masterData/importance/add.vue'),
    path: '/sys/master/masterDataImportanceAdd',
  },
  importanceAdd: {
    label: '新增项目重要性',
    component: () => import('@/sys/masterData/importance/add.vue'),
    path: '/sys/master/masterDataImportanceAdd',
  },
  masterDataModeView: {
    label: '查看项目类型',
    component: () => import('@/sys/masterData/mode/modeView.vue'),
    path: '/sys/master/masterDataModeView',
  },
  modeView: {
    label: '查看项目类型',
    component: () => import('@/sys/masterData/mode/modeView.vue'),
    path: '/sys/master/masterDataModeView',
  },
  masterDataModeEdit: {
    label: '编辑项目类型',
    component: () => import('@/sys/masterData/mode/modeEdit.vue'),
    path: '/sys/master/masterDataModeEdit',
  },
  modeEdit: {
    label: '编辑项目类型',
    component: () => import('@/sys/masterData/mode/modeEdit.vue'),
    path: '/sys/master/masterDataModeEdit',
  },
  masterDataModeAdd: {
    label: '新增项目模式',
    component: () => import('@/sys/masterData/mode/modeAdd.vue'),
    path: '/sys/master/masterDataModeAdd',
  },
  modeAdd: {
    label: '新增项目模式',
    component: () => import('@/sys/masterData/mode/modeAdd.vue'),
    path: '/sys/master/masterDataModeAdd',
  },
  masterDataMeetingTypeView: {
    label: '查看项目会议类型',
    component: () =>
      iimport('@/sys/masterData/meetingType/meetingTypeView.vue'),
    path: '/sys/master/masterDataMeetingTypeView',
  },
  meetingTypeView: {
    label: '查看项目会议类型',
    component: () =>
      iimport('@/sys/masterData/meetingType/meetingTypeView.vue'),
    path: '/sys/master/masterDataMeetingTypeView',
  },
  masterDataMeetingTypeEdit: {
    label: '编辑项目会议类型',
    component: () => import('@/sys/masterData/meetingType/meetingTypeEdit.vue'),
    path: '/sys/master/masterDataMeetingTypeEdit',
  },
  meetingTypeEdit: {
    label: '编辑项目会议类型',
    component: () => import('@/sys/masterData/meetingType/meetingTypeEdit.vue'),
    path: '/sys/master/masterDataMeetingTypeEdit',
  },
  masterDataMeetingTypeAdd: {
    label: '新增项目会议类型',
    component: () => import('@/sys/masterData/meetingType/meetingTypeAdd.vue'),
    path: '/sys/master/masterDataMeetingTypeAdd',
  },
  meetingTypeAdd: {
    label: '新增项目会议类型',
    component: () => import('@/sys/masterData/meetingType/meetingTypeAdd.vue'),
    path: '/sys/master/masterDataMeetingTypeAdd',
  },
  masterDataNatureView: {
    label: '查看项目性质',
    component: () => import('@/sys/masterData/nature/natrueView.vue'),
    path: '/sys/master/masterDataNatureView',
  },
  natureView: {
    label: '查看项目性质',
    component: () => import('@/sys/masterData/nature/natrueView.vue'),
    path: '/sys/master/masterDataNatureView',
  },
  masterDataNatureEdit: {
    label: '编辑项目性质',
    component: () => import('@/sys/masterData/nature/natrueEdit.vue'),
    path: '/sys/master/masterDataNatureEdit',
  },
  natureEdit: {
    label: '编辑项目性质',
    component: () => import('@/sys/masterData/nature/natrueEdit.vue'),
    path: '/sys/master/masterDataNatureEdit',
  },
  masterDataNatureAdd: {
    label: '新增项目性质',
    component: () => import('@/sys/masterData/nature/natrueAdd.vue'),
    path: '/sys/master/masterDataNatureAdd',
  },
  natureAdd: {
    label: '新增项目性质',
    component: () => import('@/sys/masterData/nature/natrueAdd.vue'),
    path: '/sys/master/masterDataNatureAdd',
  },
  masterDataPlaceView: {
    label: '查看项目地点',
    component: () => import('@/sys/masterData/place/placeView.vue'),
    path: '/sys/master/masterDataPlaceView',
  },
  placeView: {
    label: '查看项目地点',
    component: () => import('@/sys/masterData/place/placeView.vue'),
    path: '/sys/master/masterDataPlaceView',
  },
  masterDataCountryView: {
    label: '查看项目地点',
    component: () => import('@/sys/masterData/country/countryView.vue'),
    path: '/sys/master/masterDataCountryView',
  },
  countryView: {
    label: '查看项目地点',
    component: () => import('@/sys/masterData/country/countryView.vue'),
    path: '/sys/master/masterDataCountryView',
  },
  masterDataPlaceEdit: {
    label: '编辑项目地点',
    component: () => import('@/sys/masterData/place/placeEdit.vue'),
    path: '/sys/master/masterDataPlaceEdit',
  },
  placeEdit: {
    label: '编辑项目地点',
    component: () => import('@/sys/masterData/place/placeEdit.vue'),
    path: '/sys/master/masterDataPlaceEdit',
  },
  masterDataCountryList: {
    label: '国家',
    component: () => import('@/sys/masterData/country/countryList.vue'),
    path: '/sys/master/masterDataCountryList',
  },
  masterDataPlaceList: {
    label: '城市',
    component: () => import('@/sys/masterData/place/placeList.vue'),
    path: '/sys/master/masterDataPlaceList',
  },
  masterDataCountryEdit: {
    label: '编辑国家',
    component: () => import('@/sys/masterData/country/countryEdit.vue'),
    path: '/sys/master/masterDataCountryEdit',
  },
  countryEdit: {
    label: '编辑国家',
    component: () => import('@/sys/masterData/country/countryEdit.vue'),
    path: '/sys/master/masterDataCountryEdit',
  },
  masterDataPlaceAdd: {
    label: '新增项目地点',
    component: () => import('@/sys/masterData/place/placeAdd.vue'),
    path: '/sys/master/masterDataPlaceAdd',
  },
  placeAdd: {
    label: '新增项目地点',
    component: () => import('@/sys/masterData/place/placeAdd.vue'),
    path: '/sys/master/masterDataPlaceAdd',
  },
  masterDataCountryAdd: {
    label: '新增国家',
    component: () => import('@/sys/masterData/country/countryAdd.vue'),
    path: '/sys/master/masterDataCountryAdd',
  },
  countryAdd: {
    label: '新增国家',
    component: () => import('@/sys/masterData/country/countryAdd.vue'),
    path: '/sys/master/masterDataCountryAdd',
  },
  masterDataTagView: {
    label: '查看项目标签',
    component: () => import('@/sys/masterData/tag/tagView.vue'),
    path: '/sys/master/masterDataTagView',
  },
  tagView: {
    label: '查看项目标签',
    component: () => import('@/sys/masterData/tag/tagView.vue'),
    path: '/sys/master/masterDataTagView',
  },
  masterDataTagEdit: {
    label: '编辑项目标签',
    component: () => import('@/sys/masterData/tag/tagEdit.vue'),
    path: '/sys/master/masterDataTagEdit',
  },
  tagEdit: {
    label: '编辑项目标签',
    component: () => import('@/sys/masterData/tag/tagEdit.vue'),
    path: '/sys/master/masterDataTagEdit',
  },
  masterDataTagAdd: {
    label: '新增项目标签',
    component: () => import('@/sys/masterData/tag/tagAdd.vue'),
    path: '/sys/master/masterDataTagAdd',
  },
  tagAdd: {
    label: '新增项目标签',
    component: () => import('@/sys/masterData/tag/tagAdd.vue'),
    path: '/sys/master/masterDataTagAdd',
  },
  masterDataTypeView: {
    label: '查看项目类型',
    component: () => import('@/sys/masterData/type/typeView.vue'),
    path: '/sys/master/masterDataTypeView',
  },
  typeView: {
    label: '查看项目类型',
    component: () => import('@/sys/masterData/type/typeView.vue'),
    path: '/sys/master/masterDataTypeView',
  },
  masterDataTypeEdit: {
    label: '编辑项目类型',
    component: () => import('@/sys/masterData/type/typeEdit.vue'),
    path: '/sys/master/masterDataTypeEdit',
  },
  typeEdit: {
    label: '编辑项目类型',
    component: () => import('@/sys/masterData/type/typeEdit.vue'),
    path: '/sys/master/masterDataTypeEdit',
  },
  masterDataTypeAdd: {
    label: '新增项目类型',
    component: () => import('@/sys/masterData/type/typeAdd.vue'),
    path: '/sys/master/masterDataTypeAdd',
  },
  typeAdd: {
    label: '新增项目类型',
    component: () => import('@/sys/masterData/type/typeAdd.vue'),
    path: '/sys/master/masterDataTypeAdd',
  },
  masterDataFundView: {
    label: '查看资金来源',
    component: () => import('@/sys/masterData/fund/fundView.vue'),
    path: '/sys/master/masterDataFundView',
  },
  fundView: {
    label: '查看资金来源',
    component: () => import('@/sys/masterData/fund/fundView.vue'),
    path: '/sys/master/masterDataFundView',
  },
  masterDataFundEdit: {
    label: '编辑资金来源',
    component: () => import('@/sys/masterData/fund/fundEdit.vue'),
    path: '/sys/master/masterDataFundEdit',
  },
  fundEdit: {
    label: '编辑资金来源',
    component: () => import('@/sys/masterData/fund/fundEdit.vue'),
    path: '/sys/master/masterDataFundEdit',
  },
  masterDataFundAdd: {
    label: '新增资金来源',
    component: () => import('@/sys/masterData/fund/fundAdd.vue'),
    path: '/sys/master/masterDataFundAdd',
  },
  fundAdd: {
    label: '新增资金来源',
    component: () => import('@/sys/masterData/fund/fundAdd.vue'),
    path: '/sys/master/masterDataFundAdd',
  },
  masterDataScaleView: {
    label: '查看项目规模',
    component: () => import('@/sys/masterData/scale/scaleView.vue'),
    path: '/sys/master/masterDataScaleView',
  },
  scaleView: {
    label: '查看项目规模',
    component: () => import('@/sys/masterData/scale/scaleView.vue'),
    path: '/sys/master/masterDataScaleView',
  },
  masterDataScaleEdit: {
    label: '编辑项目规模',
    component: () => import('@/sys/masterData/scale/scaleEdit.vue'),
    path: '/sys/master/masterDataScaleEdit',
  },
  scaleEdit: {
    label: '编辑项目规模',
    component: () => import('@/sys/masterData/scale/scaleEdit.vue'),
    path: '/sys/master/masterDataScaleEdit',
  },
  masterDataScaleAdd: {
    label: '新增项目规模',
    component: () => import('@/sys/masterData/scale/scaleAdd.vue'),
    path: '/sys/master/masterDataScaleAdd',
  },
  scaleAdd: {
    label: '新增项目规模',
    component: () => import('@/sys/masterData/scale/scaleAdd.vue'),
    path: '/sys/master/masterDataScaleAdd',
  },
  masterTextTemplateEdit: {
    label: '编辑文本模板',
    component: () =>
      import('@/sys/masterData/textTemplate/masterTextTemplate_edit.vue'),
    path: '/sys/master/masterTextTemplateEdit',
  },
  masterTextTemplateView: {
    label: '查看文本模板',
    component: () =>
      import('@/sys/masterData/textTemplate/masterTextTemplate_view.vue'),
    path: '/sys/master/masterTextTemplateView',
  },
  masterTextTemplateList: {
    label: '文本模板',
    component: () =>
      import('@/sys/masterData/textTemplate/masterTextTemplate_list.vue'),
    path: '/sys/master/masterTextTemplateList',
  },
  calendar: {
    label: '日历',
    component: () => import('@/apps/home/calendar.vue'),
    path: '/calendar',
  },
  'ppt-view': {
    label: '预览ppt',
    component: () => import('@/apps/supplier/preview/preview_pdf_view.vue'),
    path: '/ppt-view',
  },
  filsView: {
    label: '预览ppt',
    component: () => import('@/apps/supplier/preview/preview_pdf_view.vue'),
    path: '/ppt-view',
  },
  thirdLogin: {
    label: '第三方自动登陆',
    component: () => import('@/views/login/thirdLogin.vue'),
    path: '/thirdLogin',
  },
  NoPermission: {
    label: '无权限',
    component: () => import('@/views/common/403.vue'),
    path: '/NoPermission',
  },
  'company-intranet': {
    label: '公司内网',
    component: () => import('@/apps/projectManagement/desktopQlink/company_intranet.vue'),
    path: '/company-intranet',
  },
  ebidding: {
    label: '电子采购平台',
    component: () => import('@/apps/projectManagement/desktopQlink/ebidding.vue'),
    path: '/ebidding',
  },
  cockpit: {
    label: '驾驶舱',
    component: () => import('@/apps/projectManagement/desktopQlink/cockpit.vue'),
    path: '/cockpit',
  },
  smeet: {
    label: '司务会',
    component: () => import('@/apps/projectManagement/desktopQlink/smeet.vue'),
    path: '/smeet',
  },
  preformance: {
    label: '专委内审/绩效考核',
    component: () => import('@/apps/projectManagement/desktopQlink/preformance.vue'),
    path: '/preformance',
  },
  'expert-person': {
    label: '专家库',
    path: '/expert-person',
    component: () => import('@/apps/projectManagement/implementation/expert.vue'),
  },
  'expert-drwa': {
    label: '专家抽取任务',
    path: '/expert-drwa',
    component: () => import('@/apps/projectManagement/implementation/expert_drwa.vue'),
  },
  'expert-eme-lib': {
    label: '紧急专家库',
    path: '/expert-eme-lib',
    component: () => import('@/apps/projectManagement/implementation/expert_eme_lib.vue'),
  },
  'expert-suggest': {
    label: '专家推荐信息',
    path: '/expert-suggest',
    component: () => import('@/apps/projectManagement/implementation/expert_suggest.vue'),
  },
  'expert-person-bak': {
    label: '备用专家清单',
    path: '/expert-person-bak',
    component: () => import('@/apps/projectManagement/implementation/expert_person_bak.vue'),
  },
  'expert-sign': {
    label: '专家库签到白名单',
    path: '/expert-sign',
    component: () => import('@/apps/projectManagement/implementation/expert_sign.vue'),
  },
  'expert-evaluation': {
    label: '专家评价',
    path: '/expert-evaluation',
    component: () => import('@/apps/projectManagement/implementation/expert_evaluation.vue'),
  },
  'expert-evaluation-itemself': {
    label: '自定义专家评价',
    path: '/expert-evaluation-itemself',
    component: () => import('@/apps/projectManagement/implementation/expert_evaluation_itemself.vue'),
  },
  'proprietor-owner': {
    label: '业主账号管理',
    path: '/proprietor-owner',
    component: () => import('@/apps/projectManagement/implementation/proprietor.vue'),
  },
  'proprietor-project': {
    label: '业主项目信息',
    path: '/proprietor-project',
    component: () => import('@/apps/projectManagement/implementation/proprietor_project.vue'),
  },
  'supplier-person': {
    label: '供应商企业管理',
    path: '/supplier-person',
    component: () => import('@/apps/projectManagement/implementation/supplier.vue'),
  },
  'supplier-reset': {
    label: '供应商信息重置',
    path: '/supplier-reset',
    component: () => import('@/apps/projectManagement/implementation/supplier_reset.vue'),
  },
  //====== 快捷方式/组件页面 ======
  //开票管理
  'sitc-invoice-apply': {
    label: '开票管理',
    path: '/sitc-invoice-apply',
    component: () => import('@/apps/projectManagement/shortcuts/featuredPjojects/sitc_invoice_apply.vue'),
  },
  'sitc-invoice-list': {
    label: '待开列表',
    path: '/sitc-invoice-list',
    component: () => import('@/apps/projectManagement/shortcuts/featuredPjojects/sitc_invoice_list.vue'),
  },
  //快递
  'sitc-express': {
    label: '顺丰快递',
    path: '/sitc-express',
    component: () => import('@/apps/projectManagement/shortcuts/featuredPjojects/sitc_express.vue'),
  },
  //线下收款
  'main-info': {
    label: '线下基本信息',
    path: '/main-info',
    component: () => import('@/apps/projectManagement/shortcuts/featuredPjojects/main_info.vue'),
  },
  'sign-info': {
    label: '线下报名信息',
    path: '/sign-info',
    component: () => import('@/apps/projectManagement/shortcuts/featuredPjojects/sign_info.vue'),
  },
  //
  createQRIndex: {
    label: '签到码生成',
    path: '/createQRIndex',
    component: () => import('@/apps/projectManagement/shortcuts/featuredPjojects/createQRIndex.vue'),
  },
  expertSignIndex: {
    label: '专家账号录入',
    path: '/expertSignIndex',
    component: () => import('@/apps/projectManagement/shortcuts/featuredPjojects/expertSignIndex.vue'),
  },
  //新闻模块 -- 典型项目
  advanced: {
    label: '先进制造',
    path: '/advanced',
    component: () => import('@/apps/projectManagement/shortcuts/featuredPjojects/advanced.vue'),
  },
  city: {
    label: '城市规划',
    path: '/city',
    component: () => import('@/apps/projectManagement/shortcuts/featuredPjojects/city.vue'),
  },
  culture: {
    label: '文化娱乐',
    path: '/culture',
    component: () => import('@/apps/projectManagement/shortcuts/featuredPjojects/culture.vue'),
  },
  educational: {
    label: '教育系统',
    path: '/educational',
    component: () => import('@/apps/projectManagement/shortcuts/featuredPjojects/educational.vue'),
  },
  financial: {
    label: '金融服务',
    path: '/financial',
    component: () => import('@/apps/projectManagement/shortcuts/featuredPjojects/financial.vue'),
  },
  medical: {
    label: '医疗卫生',
    path: '/medical',
    component: () => import('@/apps/projectManagement/shortcuts/featuredPjojects/medical.vue'),
  },
  property: {
    label: '房产物业',
    path: '/property',
    component: () => import('@/apps/projectManagement/shortcuts/featuredPjojects/property.vue'),
  },
  science: {
    label: '科创中心',
    path: '/science',
    component: () => import('@/apps/projectManagement/shortcuts/featuredPjojects/science.vue'),
  },
  transportation: {
    label: '交通运输',
    path: '/transportation',
    component: () => import('@/apps/projectManagement/shortcuts/featuredPjojects/transportation.vue'),
  },
  water: {
    label: '水务环保',
    path: '/water',
    component: () => import('@/apps/projectManagement/shortcuts/featuredPjojects/water.vue'),
  },
  //新闻模块 -- 公告公示
  purchaseLink: {
    label: '购买链接',
    path: '/purchaseLink',
    component: () => import('@/apps/projectManagement/shortcuts/announcement/purchaseLink.vue'),
  },
  procurement: {
    label: '采购公告',
    path: '/procurement',
    component: () => import('@/apps/projectManagement/shortcuts/announcement/procurement.vue'),
  },
  procurementMy: {
    label: '我的公告',
    path: '/procurementMy',
    component: () => import('@/apps/projectManagement/shortcuts/announcement/procurement_my.vue'),
  },
  purchasing: {
    label: '领购中采购公告',
    path: '/purchasing',
    component: () => import('@/apps/projectManagement/shortcuts/announcement/purchasing.vue'),
  },
  purchaseForecast: {
    label: '采购预告',
    path: '/purchaseForecast',
    component: () => import('@/apps/projectManagement/shortcuts/announcement/purchaseForecast.vue'),
  },
  result: {
    label: '结果公示/公告',
    path: '/result',
    component: () => import('@/apps/projectManagement/shortcuts/announcement/result.vue'),
  },
  ownerProcurement: {
    label: '业主采购公告',
    path: '/ownerProcurement',
    component: () => import('@/apps/projectManagement/shortcuts/announcement/ownerProcurement.vue'),
  },
  ownerResult: {
    label: '业主结果公告',
    path: '/ownerResult',
    component: () => import('@/apps/projectManagement/shortcuts/announcement/ownerResult.vue'),
  },
  //新闻模块 -- 公告新闻
  companyNews: {
    label: '公司新闻',
    path: '/companyNews',
    component: () => import('@/apps/projectManagement/shortcuts/news/companyNews.vue'),
  },
  //新闻模块 -- 项目-EN
  advancedManufacturing: {
    label: 'Advanced Manufacturing',
    path: '/advancedManufacturing',
    component: () => import('@/apps/projectManagement/shortcuts/EN_featuredPjojects/advancedManufacturing.vue'),
  },
  cultureEnterainment: {
    label: 'Culture & Enterainment',
    path: '/cultureEnterainment',
    component: () => import('@/apps/projectManagement/shortcuts/EN_featuredPjojects/cultureEnterainment.vue'),
  },
  ecologyEnvironnment: {
    label: 'Ecology & Environnment',
    path: '/ecologyEnvironnment',
    component: () => import('@/apps/projectManagement/shortcuts/EN_featuredPjojects/ecologyEnvironnment.vue'),
  },
  education: {
    label: 'Education',
    path: '/education',
    component: () => import('@/apps/projectManagement/shortcuts/EN_featuredPjojects/education.vue'),
  },
  financialService: {
    label: 'Financial Service',
    path: '/Financial Service',
    component: () => import('@/apps/projectManagement/shortcuts/EN_featuredPjojects/financialService.vue'),
  },
  higntechFacility: {
    label: 'Hign-tech Facility',
    path: '/higntechFacility',
    component: () => import('@/apps/projectManagement/shortcuts/EN_featuredPjojects/higntechFacility.vue'),
  },
  publicHealth: {
    label: 'Public Health',
    path: '/publicHealth',
    component: () => import('@/apps/projectManagement/shortcuts/EN_featuredPjojects/publicHealth.vue'),
  },
  realEstate: {
    label: 'Real Estate',
    path: '/realEstate',
    component: () => import('@/apps/projectManagement/shortcuts/EN_featuredPjojects/realEstate.vue'),
  },
  transportInfrastructure: {
    label: 'Transport Infrastructure',
    path: '/transportInfrastructure',
    component: () => import('@/apps/projectManagement/shortcuts/EN_featuredPjojects/transportInfrastructure.vue'),
  },
  urbanPlanning: {
    label: 'Urban Planning',
    path: '/urbanPlanning',
    component: () => import('@/apps/projectManagement/shortcuts/EN_featuredPjojects/urbanPlanning.vue'),
  },
  //新闻模块 -- 公告-EN
  'en-notices': {
    label: 'Procurement Notices',
    path: '/en-notices',
    component: () => import('@/apps/projectManagement/shortcuts/EN_announcement/notices.vue'),
  },
  'en-predictions': {
    label: 'Procurement Predictions',
    path: '/en-predictions',
    component: () => import('@/apps/projectManagement/shortcuts/EN_announcement/predictions.vue'),
  },
  'en-results': {
    label: 'Procurement Results',
    path: '/en-results',
    component: () => import('@/apps/projectManagement/shortcuts/EN_announcement/results.vue'),
  },
  //新闻模块 -- 新闻-EN
  'en-companyNews': {
    label: 'news',
    path: '/en-companyNews',
    component: () => import('@/apps/projectManagement/shortcuts/EN_news/companyNews.vue'),
  },
  //业务知识考试
  student: {
    label: '业务知识考试',
    path: '/student',
    component: () => import('@/apps/projectManagement/shortcuts/student/student.vue'),
  },
  //文本库
  textLibrary: {
    label: '文本库',
    path: '/textLibrary',
    component: () => import('@/apps/projectManagement/workbench/multidoc/textLibrary.vue'),
  },
  //法律法规
  institution: {
    label: '法律法规',
    path: '/institution',
    component: () => import('@/apps/projectManagement/workbench/institution/km_institution.vue'),
  },
  'institution-sh': {
    label: '上海市管理机构',
    path: '/institution-sh',
    component: () => import('@/apps/projectManagement/workbench/institution/km_institution_sh.vue'),
  },
  'institution-cn': {
    label: '国家管理机构',
    path: '/institution-cn',
    component: () => import('@/apps/projectManagement/workbench/institution/km_institution_cn.vue'),
  },
  //流程
  'off-account': {
    label: '公众号',
    path: '/off-account',
    component: () => import('@/apps/projectManagement/workbench/review/off_account.vue'),
  },
  'review-my': {
    label: '我的流程',
    path: '/review-my',
    component: () => import('@/apps/projectManagement/workbench/review/review_my.vue'),
  },
  'fcreate-review': {
    label: '发起流程',
    path: '/fcreate-review',
    component: () => import('@/apps/projectManagement/workbench/review/fcreate_review.vue'),
  },
  'examine-review': {
    label: '流程审核',
    path: '/examine-review',
    component: () => import('@/apps/projectManagement/workbench/review/examine_review.vue'),
  },
  'follow-review': {
    label: '流程跟踪',
    path: '/follow-review',
    component: () => import('@/apps/projectManagement/workbench/review/follow_review.vue'),
  },
  'feedback-review': {
    label: '流程反馈',
    path: '/feedback-review',
    component: () => import('@/apps/projectManagement/workbench/review/feedback_review.vue'),
  },
  'fsearch-review': {
    label: '流程查询',
    path: '/fsearch-review',
    component: () => import('@/apps/projectManagement/workbench/review/fsearch_review.vue'),
  },
  'notify-read':{
    label: '待阅',
    path: '/notify-read',
    component: () => import('@/apps/projectManagement/workbench/notify/read.vue'),
  },
  'notify-process':{
    label: '待办',
    path: '/notify-process',
    component: () => import('@/apps/projectManagement/workbench/notify/process.vue'),
  },
  'notify-system':{
    label: '系统通知类',
    path: '/notify-system',
    component: () => import('@/apps/projectManagement/workbench/notify/system.vue'),
  },
  'notify-fastview':{
    label: '快速审批',
    path: '/notify-fastview',
    component: () => import('@/apps/projectManagement/workbench/notify/fastview.vue'),
  },
  'notify-star':{
    label: '星标待办',
    path: '/notify-star',
    component: () => import('@/apps/projectManagement/workbench/notify/star.vue'),
  }
}
