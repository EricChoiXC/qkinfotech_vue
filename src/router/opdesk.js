import { convertToRoutes } from '@/utils/convertToRoutes'
import ComponentLoader from '@/components/ComponentLoader.vue'
import baseUrl from '@/utils/baseUrl'
import context from '@/context.js'

import pages from './pages.js'
import { getAuthMenu } from '@/router/router-auth'
import storage from '@/utils/storage'
import createApi from '@/apps/api.js'

const WorkbenchLayout = () => import('@/layout/opdesk/index.vue')

const childComponent = (data) =>
  defineComponent({
    render() {
      return h(ComponentLoader, data)
    },
  })

const responseRoutes = [
  {
    label: '首页',
    key: 'home',
    menu: [
      {
        label: '工作台',
        style: 'color:#fff',
        key: 'workbench',
        icon: 'BookIcon',
        showAside: true,
        component: '/apps/desktop.vue',
      },
      {
        label: '登陆',
        key: 'login',
        display: 'window',
        showAside: false,
        component: '/views/login/index.vue',
      },
      {
        label: '第三方登陆',
        key: 'thirdLogin',
        display: 'window',
        showAside: false,
        component: '/views/login/thirdLogin.vue',
      },
    ],
  },
  {
    label: '项目管理',
    key: 'projectManagement',
    children: [
      {
        label: '开拓阶段',
        key: 'explore',
        menu: [
          {
            label: '开拓流程',
            key: 'developing',
            icon: 'BookIcon',
            showAside: true,
            // display: "ekp",
            component: '/apps/projectManagement/explore/pp.vue',
            // onClick: () => singleLogin.ekpJump(baseUrl.ekpUrl +
            //   "/sitc/project/sitc_project_visit_main/index.jsp"),
          },
          {
            label: '投标流程',
            key: 'bidding',
            icon: 'BookIcon',
            showAside: true,
            // display: "ekp",
            component: '/apps/projectManagement/explore/pua.vue',
            // onClick: () => singleLogin.ekpJump(baseUrl.ekpUrl + "/sitc/project/sitc_project_bid_code/index.jsp"),
          },
          {
            label: '协议流程',
            key: 'pending-protocol',
            icon: 'BookIcon',
            showAside: true,
            // display: "ekp",
            component: '/apps/projectManagement/explore/protocol.vue',
            // onClick: () => singleLogin.ekpJump(baseUrl.ekpUrl + "/sitc/project/sitc_project_code/index.jsp"),
          },
          {
            label: '收费标准',
            key: 'pending-charge',
            icon: 'BookIcon',
            showAside: true,
            component: '/apps/projectManagement/explore/charge.vue',
            // display: "ekp",
            // onClick: () => singleLogin.ekpJump(baseUrl.ekpUrl + "/sitc/project/sitc_project_rates_ibs/index.jsp"),
          },
          {
            label: '协议模板',
            key: 'protocol-template',
            icon: 'BookIcon',
            showAside: true,
            component: '/apps/projectManagement/explore/protocolTemplate.vue',
            // display: "ekp",
            // onClick: () => singleLogin.ekpJump(baseUrl.ekpUrl + "/sitc/template/"),
          },
        ],
      },
      {
        label: '执行阶段',
        key: 'implementation',
        menu: [
          {
            label: '项目编号申请',
            key: 'project-number-application',
            icon: 'BookIcon',
            showAside: true,
            component: '/apps/project/application/projectApplication_add.vue',
          },
          {
            label: '待审项目一览',
            key: 'pending-projects',
            icon: 'BookIcon',
            showAside: true,
            component: '/apps/project/application/projectApplication_list.vue',
          },
          {
            label: '项目信息查询',
            key: 'project-overview',
            icon: 'BookIcon',
            showAside: true,
            component:
              '/apps/project/application/projectApplication_finishList.vue',
          },
          {
            label: '项目审批',
            key: 'approval',
            icon: 'BookIcon',
            component: '/apps/project/approval/approval_view.vue',
            showAside: false,
          },
          {
            label: '资格申请包件总览',
            key: 'package-view',
            icon: 'BookIcon',
            component: '/apps/supplier/packageView.vue',
            showAside: false,
          },
          {
            label: '资格申请查看',
            key: 'supplier-view',
            icon: 'BookIcon',
            component: '/apps/supplier/supplier_view.vue',
            showAside: false,
          },
          {
            label: '资格申请',
            key: 'supplier-edit',
            icon: 'BookIcon',
            component: '/apps/supplier/supplier_edit.vue',
            showAside: false,
          },
          {
            label: '资格申请',
            key: 'supplier-add',
            icon: 'BookIcon',
            component: '/apps/supplier/supplier_add.vue',
            showAside: false,
          },
          {
            label: '联合申请',
            key: 'supplier-union-view',
            icon: 'BookIcon',
            component: '/apps/supplier/supplier_union_edit.vue',
            showAside: false,
          },
          {
            label: '项目详情',
            key: 'project-view',
            showAside: false,
            component: '/apps/project/project_nodes.vue',
          },
          {
            label: '电子归档',
            key: 'documentation-files',
            icon: 'BookIcon',
            showAside: false,
            component: '/apps/documentation/documentation_files_view.vue',
          },
          {
            label: '文件搜索',
            key: 'filesSerch',
            icon: 'BookIcon',
            showAside: false,
            component: '/apps/credentials/pre-audit/filesSerch.vue',
          },
          {
            label: '登记信息',
            key: 'RegistrationView',
            icon: 'BookIcon',
            showAside: false,
            component:
              '/apps/credentials/pre-audit/notice/notice_company_view.vue',
          },
          {
            label: '成果产品检验流转单',
            key: 'project-iso',
            icon: 'BookIcon',
            showAside: false,
            component: '/apps/iso/isoApproval_list.vue',
          },
          {
            label: '成果产品检验流转单查看页',
            key: 'project-iso-view',
            icon: 'BookIcon',
            showAside: false,
            component: '/apps/iso/isoApproval_view.vue',
          },
          {
            label: '成果产品检验流转单审批页',
            key: 'project-iso-edit',
            icon: 'BookIcon',
            showAside: false,
            component: '/apps/iso/isoApproval_edit.vue',
          },
        ],
      },
    ],
  },
  {
    label: '三库资料',
    key: 'library',
    children: [
      {
        label: '专家库',
        key: 'expert',
        // url: baseUrl.ekpUrl + '/km/expert/',
        showAside: true,
        component: '/apps/projectManagement/implementation/expert.vue',
        // component: "/apps/iso/isoApproval_edit.vue"
        // onClick: () => singleLogin.ekpJump(baseUrl.ekpUrl + "/km/expert/"),
      },
      {
        label: '业主库',
        key: 'owner',
        // url: baseUrl.ekpUrl + '/km/proprietor/',
        showAside: true,
        component: '/apps/projectManagement/implementation/proprietor.vue',
        // component: "/apps/iso/isoApproval_edit.vue"
        // onClick: () => singleLogin.ekpJump(baseUrl.ekpUrl + "/km/proprietor/"),
      },
      {
        label: '供应商',
        key: 'supplier',
        // component: '',
        // url: baseUrl.ekpUrl + '/km/supplier/',
        showAside: true,
        component: '/apps/projectManagement/implementation/supplier.vue',
        // onClick: () => singleLogin.ekpJump(baseUrl.ekpUrl + "/km/supplier/"),
      },
    ],
  },
  {
    label: '后台管理',
    key: 'sys',
    children: [
      {
        label: '组织机构管理',
        key: 'org',
        menu: [
          /* {
        label: "人员列表",
        key: "personList",
        icon: "BookIcon",
        showAside: true,
        component: "/components/org/person/listPerson.vue"
      }, */
          {
            label: '组织架构',
            key: 'orgList',
            icon: 'BookIcon',
            showAside: true,
            component: '/components/org/listOrg.vue',
          },
          {
            label: '群组',
            key: 'listGroup',
            icon: 'BookIcon',
            showAside: true,
            component: '/components/org/group/listGroup.vue',
          },
          /* {
        label: "岗位",
        key: "listPost",
        icon: "BookIcon",
        showAside: true,
        component: "/components/org/post/listPost.vue"
      }, */
          /* {
        label: "职级",
        key: "listTitle",
        icon: "BookIcon",
        showAside: true,
        component: "/components/org/title/listTitle.vue"
      }, */
        ],
      },
      {
        label: '权限管理',
        key: 'auth',
        menu: [
          {
            label: '角色管理',
            key: 'roleList',
            icon: 'BookIcon',
            showAside: true,
            component: '/components/org/role/orgRoleList.vue',
          },
          {
            label: '赋权角色',
            key: 'empowerRole',
            icon: 'BookIcon',
            showAside: true,
            component: '/components/org/role/orgRoleAuthorityList.vue',
          },
          {
            label: '授权角色',
            key: 'authedRole',
            icon: 'BookIcon',
            showAside: true,
            component: '/components/org/role/orgRoleElementList.vue',
          },
          {
            label: '员工授权查询',
            key: 'rolePersonTree',
            icon: 'BookIcon',
            showAside: true,
            component: '/components/org/role/orgRolePersonTree.vue',
          },
          {
            label: '角色授权查询',
            key: 'roleAuthorityTree',
            icon: 'BookIcon',
            showAside: true,
            component: '/components/org/role/orgRoleAuthorityTree.vue',
          },
          {
            label: '菜单授权管理',
            key: 'menuAuth',
            icon: 'BookIcon',
            showAside: true,
            component: '/sys/menu/list.vue',
          },
          {
            label: '同步页面',
            key: 'syncPage',
            icon: 'BookIcon',
            showAside: true,
            component: '/sys/menu/sync.vue',
          },
          /* , {
            label: "组件权限",
            key: "listAssemblyAuth",
            icon: "BookIcon",
            showAside: true,
            component: "/apps/assembly/listAssemblyAuth.vue"
          } */
    ]
  }, {
    label: "工作台快捷方式设置",
    key: "workbech",
    menu: [{
      label: "快捷方式配置",
      key: "listShortcuts",
      icon: "BookIcon",
      showAside: true,
      component: "/apps/shortcuts/listShortcuts.vue"
    }, {
      label: "组件权限",
      key: "listAssemblyAuth",
      icon: "BookIcon",
      showAside: true,
      component: "/apps/assembly/listAssemblyAuth.vue"
    }]
  }, {
    label: "后台设置",
    key: "system",
    menu: [{
        label: "ekp配置",
        key: "ekpConfig",
        icon: "BookIcon",
        showAside: true,
        component: "/sys/config/ekpConfig.vue"
      }, {
        label: "系统定时任务",
        key: "systemTaskConfig",
        icon: "BookIcon",
        showAside: true,
        component: "/sys/task/systemTaskList.vue"
      }, {
        label: "用户定时任务",
        key: "userTaskConfig",
        icon: "BookIcon",
        showAside: true,
        component: "/sys/task/userTaskList.vue"
      }, {
        label: "接口调用信息",
        key: "interfaceInfoList",
        icon: "BookIcon",
        showAside: true,
        component: "/sys/interface/interfaceList.vue"
      },
      {
        label: "接口信息查询",
        key: "interfaceInfoView",
        icon: "BookIcon",
        showAside: false,
        component: "/sys/interface/interfaceView.vue"
      },
      {
        label: "接口地址配置",
        key: "interfaceUrlConfigList",
        icon: "BookIcon",
        showAside: true,
        component: "/sys/interface/interfaceUrlConfigList.vue",
      },
      {
        label: "接口地址查看",
        key: "interfaceUrlConfigView",
        icon: "BookIcon",
        showAside: false,
        component: "/sys/interface/interfaceUrlConfigView.vue"
      }
    ]
  }, {
    label: "主数据管理",
    key: "master",
    menu: [{
      label: "项目类别",
      key: "masterData-category",
      icon: "BookIcon",
      showAside: true,
      component: "/sys/masterData/category/categoryList.vue"
    }, {
      label: "项目重要性",
      key: "masterData-importance",
      icon: "BookIcon",
      showAside: true,
      component: "/sys/masterData/importance/list.vue"
    }, {
      label: "项目性质",
      key: "masterData-nature",
      icon: "BookIcon",
      showAside: true,
      component: "/sys/masterData/nature/natrueList.vue"
    }, {
      label: "城市",
      key: "masterData-place",
      icon: "BookIcon",
      showAside: true,
      component: "/sys/masterData/place/placeList.vue"
    }, {
      label: "国家",
      key: "masterData-country",
      icon: "BookIcon",
      showAside: true,
      component: "/sys/masterData/country/countryList.vue"
    }, {
      label: "项目标签",
      key: "masterData-tag",
      icon: "BookIcon",
      showAside: true,
      component: "/sys/masterData/tag/tagList.vue"
    }, {
      label: "项目类型",
      key: "masterData-type",
      icon: "BookIcon",
      showAside: true,
      component: "/sys/masterData/type/typeList.vue"
    }, {
      label: "项目规模",
      key: "masterData-scale",
      icon: "BookIcon",
      showAside: true,
      component: "/sys/masterData/scale/scaleList.vue"
    }, {
      label: "资金来源",
      key: "masterData-fund",
      icon: "BookIcon",
      showAside: true,
      component: "/sys/masterData/fund/fundList.vue"
    }, {
      label: "项目模式",
      key: "masterData-mode",
      icon: "BookIcon",
      showAside: true,
      component: "/sys/masterData/mode/modeList.vue"
    }, {
      label: "项目会议类型",
      key: "masterData-meetType",
      icon: "BookIcon",
      showAside: true,
      component: "/sys/masterData/meetingType/meetingTypeList.vue"
    }, {
      label: "成功页面",
      key: "actionSuccess",
      icon: "BookIcon",
      showAside: false,
      component: "/apps/common/successPage.vue"
    }, {
      label: "新增项目类别",
      key: "masterDataCategoryAdd",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/category/categoryAdd.vue"
    }, {
      label: "编辑项目类别",
      key: "masterDataCategoryEdit",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/category/categoryEdit.vue"
    }, {
      label: "查看项目类别",
      key: "masterDataCategoryView",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/category/categoryView.vue"
    }, {
      label: "新增项目重要性",
      key: "masterDataImportanceAdd",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/importance/add.vue"
    }, {
      label: "查看项目重要性",
      key: "masterDataImportanceview",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/importance/view.vue"
    }, {
      label: "编辑项目重要性",
      key: "masterDataImportanceedit",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/importance/edit.vue"
    }, {
      label: "查看项目会议类型",
      key: "masterDataMeetingTypeView",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/meetingType/meetingTypeView.vue"
    }, {
      label: "编辑项目会议类型",
      key: "masterDataMeetingTypeEdit",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/meetingType/meetingTypeEdit.vue"
    }, {
      label: "新增项目会议类型",
      key: "masterDataMeetingTypeAdd",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/meetingType/meetingTypeAdd.vue"
    }, {
      label: "查看项目模式",
      key: "masterDataModeView",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/mode/modeView.vue"
    }, {
      label: "编辑项目模式",
      key: "masterDataModeEdit",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/mode/modeEdit.vue"
    }, {
      label: "新增项目模式",
      key: "masterDataModeAdd",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/mode/modeAdd.vue"
    }, {
      label: "查看项目性质",
      key: "masterDataNatureView",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/nature/natrueView.vue"
    }, {
      label: "编辑项目性质",
      key: "masterDataNatureEdit",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/nature/natrueEdit.vue"
    }, {
      label: "新增项目性质",
      key: "masterDataNatureAdd",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/nature/natrueAdd.vue"
    }, {
      label: "查看地点",
      key: "masterDataPlaceView",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/place/placeView.vue"
    }, {
      label: "查看国家",
      key: "masterDataCountryView",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/country/countryView.vue"
    }, {
      label: "编辑地点",
      key: "masterDataPlaceEdit",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/place/placeEdit.vue"
    }, {
      label: "编辑国家",
      key: "masterDataCountryEdit",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/country/countryEdit.vue"
    }, {
      label: "新增地点",
      key: "masterDataPlaceAdd",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/place/placeAdd.vue"
    }, {
      label: "新增国家",
      key: "masterDataCountryAdd",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/country/countryAdd.vue"
    }, {
      label: "查看标签",
      key: "masterDataTagView",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/tag/tagView.vue"
    }, {
      label: "编辑标签",
      key: "masterDataTagEdit",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/tag/tagEdit.vue"
    }, {
      label: "新增标签",
      key: "masterDataTagAdd",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/tag/tagAdd.vue"
    }, {
      label: "查看项目类型",
      key: "masterDataTypeView",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/type/typeView.vue"
    }, {
      label: "编辑项目类型",
      key: "masterDataTypeEdit",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/type/typeEdit.vue"
    }, {
      label: "新增项目类型",
      key: "masterDataTypeAdd",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/type/typeAdd.vue"
    }, {
      label: "查看项目规模",
      key: "masterDataScaleView",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/scale/scaleView.vue"
    }, {
      label: "编辑项目规模",
      key: "masterDataScaleEdit",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/scale/scaleEdit.vue"
    }, {
      label: "新增项目规模",
      key: "masterDataScaleAdd",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/scale/scaleAdd.vue"
    }, {
      label: "查看资金来源",
      key: "masterDataFundView",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/fund/fundView.vue"
    }, {
      label: "编辑资金来源",
      key: "masterDataFundEdit",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/fund/fundEdit.vue"
    }, {
      label: "新增资金来源",
      key: "masterDataFundAdd",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/fund/fundAdd.vue"
    }, {
      label: "编辑文本模板",
      key: "masterTextTemplateEdit",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/textTemplate/masterTextTemplate_edit.vue"
    }, {
      label: "查看文本模板",
      key: "masterTextTemplateView",
      icon: "BookIcon",
      showAside: false,
      component: "/sys/masterData/textTemplate/masterTextTemplate_view.vue"
    }, {
      label: "文本模板",
      key: "masterTextTemplateList",
      icon: "BookIcon",
      showAside: true,
      component: "/sys/masterData/textTemplate/masterTextTemplate_list.vue"
    }]
  }]
}]
const api = createApi(getCurrentInstance())

async function load(router) {
  /* 登陆人类型 */
  const userType = ref("0")
  api.orgPersonLoad({
      fId: context.user()
    })
    .then(function (res) {
      userType.value = res.data.fEkpUserType
    })

  let menu = responseRoutes

  //除管理员外，其他用户读取sys_menu配置的页面数据
  if (context.user() != '00000000000000000000000000000000') {
    const personalMenu = await getAuthMenu(router)
    //console.log(personalMenu)
    if (personalMenu && personalMenu.length > 0) {
      menu = personalMenu
    } else {
      menu = []
    }
    menu.unshift({
      label: '首页',
      key: 'home',
      menu: [
        {
          label: '工作台',
          style: 'color:#fff',
          key: 'workbench',
          icon: 'BookIcon',
          tabKey: 'workbench',
          showAside: true,
          component: '/apps/desktop.vue',
        },
        {
          label: '公司内网',
          key: 'company-intranet',
          icon: 'BookIcon',
          showAside: userType.value === '1' ? true : false,
          component:
            '/apps/projectManagement/desktopQlink/company_intranet.vue',
        },
        {
          label: '电子采购平台',
          key: 'ebidding',
          icon: 'BookIcon',
          showAside: userType.value === '1' ? true : false,
          component: '/apps/projectManagement/desktopQlink/ebidding.vue',
        },
        {
          label: '驾驶舱',
          key: 'cockpit',
          icon: 'BookIcon',
          showAside: userType.value === '1' ? true : false,
          component: '/apps/projectManagement/desktopQlink/cockpit.vue',
        },
        {
          label: '司务会',
          key: 'smeet',
          icon: 'BookIcon',
          showAside: userType.value === '1' ? true : false,
          component: '/apps/projectManagement/desktopQlink/smeet.vue',
        },
        {
          label: '专委内审/绩效考核',
          key: 'preformance',
          icon: 'BookIcon',
          showAside: userType.value === '1' ? true : false,
          component: '/apps/projectManagement/desktopQlink/preformance.vue',
        },
        {
          label: '登陆',
          key: 'login',
          display: 'window',
          showAside: false,
          component: '/views/login/index.vue',
        },
        /*{
          label: '第三方登陆',
          key: 'thirdLogin',
          display: 'window',
          showAside: false,
          component: '/views/login/thirdLogin.vue',
        },*/
        {
          label: '项目详情',
          key: 'project-view',
          display: 'window',
          showAside: false,
          component: '/apps/project/project_nodes.vue',
        },
        {
          label: '资源不存在',
          key: 'NotFound',
          display: 'window',
          showAside: false,
          component: '/views/common/404.vue',
        },
        {
          label: '无权限',
          key: 'NoPermission',
          icon: 'BookIcon',
          showAside: false,
          component: '/views/common/403.vue',
        },
        {
          label: '成功页面',
          key: 'actionSuccess',
          icon: 'BookIcon',
          showAside: false,
          component: '/apps/common/successPage.vue',
        },
      ],
    })
  }
  console.log(menu)

  // 加载布局
  router.addRoute({
    path: '/opdesk',
    name: 'opdesk',
    component: () => import('@/layout/opdesk/index.vue'),
  })

  router.addRoute('opdesk', {
    path: '/',
    redirect: '/opdesk/home/workbench',
  })

  //404资源不存在页面
  router.addRoute({
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/common/404.vue'),
  })
  //403无权限页面
  router.addRoute({
    path: '/NoPermission',
    name: 'NoPermission',
    component: () => import('@/views/common/403.vue'),
  })

  window['$routerList'] = menu //old:convertToRoutes(responseRoutes)

  function recursive(item) {
    if (item.key) {
      item.tabKey = item.key
      let page = pages[item.key]
      if (page) {
        router.addRoute('opdesk', {
          path: page.path.substring(1),
          name: item.key,
          component: page.component,
        })
      }
    }
    if (item.children) {
      item.children.map((v) => recursive(v))
    }
    if (item.menu) {
      item.menu.map((v) => recursive(v))
    }
  }
  recursive({
    menu,
  })
  // router.addRoute('opdesk', {
  //   path: 'sys/org/orgList',
  //   name: 'orgList',
  //   component: () => import('@/apps/home/workbench.vue'),
  // });
}
export default load
