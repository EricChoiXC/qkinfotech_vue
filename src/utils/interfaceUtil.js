import storage from '@/utils/storage.js'
import request from '@/utils/request2.js'
import oaRequest from '@/utils/oaRequest'
import baseUrl from '@/utils/baseUrl'
import { useMessage, useDialog } from 'naive-ui'
import moment from 'moment'
import context from '@/context.js'


function createApi(currentInstance) {
  const requestInstance = new request(currentInstance)
  const oaRequestInstance = new oaRequest(currentInstance)
  const api = {}
  /**
   * @param flag add:添加;update:更新
   * @param check true/false:是否为只校验
   * @param appsProjectMain 推送数据
   * @returns {Promise<{}|{MESSAGE: string, STATUS: string}>} {STATUS : "S/E" , MESSAGE : "异常信息" , f_protocol_no : "项目编号"}
   */
  api.projectMainCheck = async function (flag, check, appsProjectMain) {
    if (appsProjectMain == undefined) {
      return {
        STATUS: 'E',
        MESSAGE: '未提供项目信息',
      }
    }
    if (flag == undefined || typeof flag != 'string') {
      flag = 'edit'
    }
    if (check == undefined || typeof check != 'boolean') {
      check = true
    }

    // 初始化一个空数组，用于存放提取后的对象
    let group = {}
    appsProjectMain.fScales.forEach((scale) => {
      if (!group[scale.fGroup]) {
        group[scale.fGroup] = {
          groupName: scale.fGroup,
          typeName: [],
          scales: [],
        }
      }
      var inputScale = {}
      inputScale[scale.fScale.fName] = scale.fValue
      group[scale.fGroup].scales.push(inputScale)
    })
    appsProjectMain.fTypes.forEach((type) => {
      if (!group[type.fGroup]) {
        group[type.fGroup] = {
          groupName: type.fGroup,
          typeName: [],
          scales: [],
        }
      }
      group[type.fGroup].typeName.push(type.fTypeId.fName)
    })
    var groupArray = []
    for (var key in group) {
      groupArray.push(group[key])
    }

    const innerObj = {
      //非appsProjectMain字段
      f_flag: flag, //add-新增  edit-编辑
      f_check_flag: check, //true-只校验，没有返回编号  false-不校验返回编号
      s: context.user(), //用户id

      //appsProjectMain字段，可直接通过（/pm/projectNo/applicationa/projectView）获取出来的数据
      f_id: appsProjectMain.fId, //pm Id
      f_name: appsProjectMain.fName, //项目名称
      f_simple_name: appsProjectMain.fSimpleName, //项目简称
      f_eng_name: appsProjectMain.fEngName, //项目英文名
      f_protocol_no: appsProjectMain.fProtocolNo, // 项目编号
      f_protocol_number: appsProjectMain.fProtocolNumber, //协议编号
      f_project_mode: appsProjectMain.fProjectMode, //项目模式
      f_create_time: appsProjectMain.fCreateTime
        ? moment(appsProjectMain.fCreateTime).toDate()
        : new Date(),
      f_dept: appsProjectMain.fDept, //项目部门
      f_manager: appsProjectMain.fDeptManager, //部门经理，从projectView获取
      f_project_budget: appsProjectMain.fProjectBudget, //预算
      f_plan_foregin_exchange: appsProjectMain.fPlanForeignExchange, //计划用汇
      f_plan_income: appsProjectMain.fPlanIncome, //预期收入
      f_develop_info: appsProjectMain.fDevelopInfo, //开拓信息
      f_is_classified: appsProjectMain.fIsClassified, //是否涉密
      f_project_place: appsProjectMain.fProjectPlace, //项目地点
      f_persons: appsProjectMain.fProjectMembers, //项目组成员
      f_language_use: appsProjectMain.fAchievementLanguage, //成果语言
      fNotes: appsProjectMain.fNotes, //备注

      //appsProjectMain字段，但是由于在 项目申请 和 项目审批 上使用了其他命名的字段，需要进行判断处理， 非项目申请和项目审批的场景中，请直接使用projectView方法有返回的命名字段（三元运算的false段）
      //项目性质，项目申请和审批时通过selectedNatures获取，projectView下直接通过oaNatureNameArray获取
      f_project_nature: appsProjectMain.selectedNatures
        ? appsProjectMain.selectedNatures
        : appsProjectMain.oaNatureNameArray,
      //项目重要性，项目申请和审批时通过selectedImportance.fName获取，projectView下可直接通过fProjectImportance.fName获取
      f_project_importance: appsProjectMain.selectedImportance
        ? appsProjectMain.selectedImportance.fName
        : appsProjectMain.fProjectImportance
          ? appsProjectMain.fProjectImportance.fName
          : '',
      //资金来源，项目申请和审批时通过oaCapitalSource获取，projectView下通过fCapitalSource.fName获取
      f_capital_source: appsProjectMain.oaCapitalSource
        ? appsProjectMain.oaCapitalSource
        : appsProjectMain.fCapitalSource
          ? appsProjectMain.fCapitalSource.fName
          : '',
      //国家，项目申请和审批时通过oaCountry获取，projectView下通过fCountry获取，推送fCountruNum和fName
      f_country: appsProjectMain.oaCountry
        ? appsProjectMain.oaCountry
        : appsProjectMain.fCountry,
      //城市，项目申请和审批时通过oaCity获取，projectView下通过fCity获取，推送fId,fCityNum,fName
      f_city: appsProjectMain.oaCity
        ? appsProjectMain.oaCity
        : appsProjectMain.fCity,
      //项目分类，项目申请和审批时通过oaCategory获取，projectView通过fProjectCategory获取，推送fName, fNumber
      f_project_category: appsProjectMain.oaCategory
        ? appsProjectMain.oaCategory
        : appsProjectMain.fProjectCategory,
      //项目标签，项目申请和审批通过fTagNameArray获取，projectView通过appsTagNameArray获取
      f_project_tag: appsProjectMain.fTagNameArray
        ? appsProjectMain.fTagNameArray
        : appsProjectMain.appsTagNameArray,

      //项目类型，获取项目的fTypes和fScales，需进行转化
      f_project_type: JSON.stringify(groupArray),
    }

    //2024-09-09补充：资金来源是“其他”时，从fCapitalSourceOther获取资金来源
    var capitalSourceName = appsProjectMain.oaCapitalSource
      ? appsProjectMain.oaCapitalSource
      : appsProjectMain.fCapitalSource
        ? appsProjectMain.fCapitalSource.fName
        : ''
    if (capitalSourceName == '其他') {
      innerObj['f_capital_source'] = appsProjectMain.fCapitalSourceOther
    }
    //2024-09-09补充：项目性质是“其他”时，从fProjectNatureOther获取资金来源
    var projectNatures = appsProjectMain.selectedNatures
      ? appsProjectMain.selectedNatures
      : appsProjectMain.oaNatureNameArray
    for (var i = 0; i < projectNatures.length; i++) {
      if (projectNatures[i].fName == '其他') {
        projectNatures[i].fName = appsProjectMain.fProjectNatureOther
      }
    }
    innerObj['f_project_nature'] = projectNatures

    var oaQuest = await this.oaQuestMap(innerObj)
    var url = baseUrl.oaUrl + '/j/api/sitc/jy/prj/update_prj_16_base.jsp'
    var interfaceLogForm = {
      fCreateTime: new Date(),
      fInterfaceName: '老oa申请/校验接口状态',
      fInterfaceUrl: url,
      fInputParameter: JSON.stringify(innerObj),
    }
    var result = {}
    await oaRequestInstance
      .post(url, oaQuest)
      .then(function (res2) {
        result = res2
        interfaceLogForm.fInterfaceInfo = JSON.stringify(res2)
        interfaceLogForm.fProtocolNo = res2.f_protocol_no
        interfaceLogForm.fInterfaceStatus = '1'
        requestInstance.post('/pm/interface/log/save', interfaceLogForm)
      })
      .catch(function (error) {
        result.STATUS = 'E'
        result.MESSAGE = JSON.stringify(error)
        interfaceLogForm.fInterfaceInfo = JSON.stringify(error)
        interfaceLogForm.fProtocolNo = res2.f_protocol_no
        interfaceLogForm.fInterfaceStatus = '2'
        requestInstance.post('/pm/interface/log/save', interfaceLogForm)
      })
    return result
  }

  /**
   * 入围结果推送果
   * @param projectId 所属项目的pmId
   * @param projectNo 项目编号果
   * @param packages[] 所有包件序号
   * @param updatePackages {} {"1":["ekpId"]} 以需要更新的包件序号为key值，推送入围公司的ekpId数组
   * @param meetingPlace 会议地点
   * @param startTime 开始时间 资格预审会议 最晚的会议时间
   * @param finishTime 结束时间
   */
  api.compititionResultPush = async function (
    projectId,
    projectNo,
    packages,
    updatePackages,
    meetingPlace,
    startTime,
    finishTime
  ) {
    var pushObj = {
      s: context.user(), //用户id
      pmId: projectId,
      projectNo: projectNo,
      packages: packages,
      updatePackages: updatePackages,
      meetingPlace: meetingPlace,
      startTime: startTime,
      finishTime: finishTime,
    }
    var oaQuest = await this.oaQuestMap(pushObj)
    var result = {}
    var url = baseUrl.oaUrl + '/j/api/sitc/jy/prj/update_prj_16_preview.jsp'
    var interfaceLogForm = {
      fCreateTime: new Date(),
      fInterfaceName: '包件入围结果信息推送接口',
      fInterfaceUrl: url,
      fInputParameter: JSON.stringify(pushObj),
      fProtocolNo: projectNo,
    }
    await oaRequestInstance
      .post(url, oaQuest)
      .then(function (res) {
        result = res
        interfaceLogForm.fInterfaceInfo = JSON.stringify(res)
        interfaceLogForm.fInterfaceStatus = '1'
        requestInstance.post('/pm/interface/log/save', interfaceLogForm)
      })
      .catch(function (error) {
        result.STATUS = 'E'
        result.MESSAGE = JSON.stringify(error)
        interfaceLogForm.fInterfaceInfo = JSON.stringify(error)
        interfaceLogForm.fInterfaceStatus = '2'
        requestInstance.post('/pm/interface/log/save', interfaceLogForm)
      })
    return result
  }

  /**
   * 征集结果推送接口
   * @param projectId 项目pmId
   * @param projectNo 项目编号
   * @param collectionResult 征集结果对象数组：传递companyId, packageIndex, collectionPrice, notes
   * @param bidDate 确认征集结果日期对象数组：传递packageIndex, noticeDate
   * @return {} {STATUS : "S/E" , MESSAGE : "异常信息"}
   */
  api.collectionResultPush = async function (
    projectId,
    projectNo,
    collectionResult,
    bidDate,
  ) {
    var pushObj = {
      s: context.user(), //用户id
      pmId: projectId,
      projectNo: projectNo,
      collectionResult: collectionResult,
      packages: bidDate,
    }

    var oaQuest = await this.oaQuestMap(pushObj)
    var result = {}
    var url = baseUrl.oaUrl + '/j/api/sitc/jy/prj/update_prj_16_result.jsp'
    var interfaceLogForm = {
      fCreateTime: new Date(),
      fInterfaceName: '征集结果推送接口',
      fInterfaceUrl: url,
      fInputParameter: JSON.stringify(pushObj),
      fProtocolNo: projectNo,
    }
    await oaRequestInstance
      .post(url, oaQuest)
      .then(function (res) {
        result = res
        interfaceLogForm.fInterfaceInfo = JSON.stringify(res)
        interfaceLogForm.fInterfaceStatus = '1'
        requestInstance.post('/pm/interface/log/save', interfaceLogForm)
      })
      .catch(function (error) {
        result.STATUS = 'E'
        result.MESSAGE = JSON.stringify(error)
        interfaceLogForm.fInterfaceInfo = JSON.stringify(error)
        interfaceLogForm.fInterfaceStatus = '2'
        requestInstance.post('/pm/interface/log/save', interfaceLogForm)
      })
    return result
  }

  /**
   * 基本结束日期校验接口
   * @param projectId 项目pmId
   * @param projectNo 项目编号
   * @param baseFinishTime 基本结束日期（YYYY-MM-DD）
   * @return return {STATUS : "S/E" , MESSAGE : "异常信息"}
   */
  api.baseFinishTimeValidate = async function (
    projectId,
    projectNo,
    baseFinishTime,
  ) {
    var pushObj = {
      pmId: projectId,
      projectNo: projectNo,
      baseFinishTime: baseFinishTime,
    }

    var oaQuest = await this.oaQuestMap(pushObj)
    var result = {}
    var url = baseUrl.oaUrl + '/j/api/sitc/jy/prj/do_prj_16_finish.jsp'
    var interfaceLogForm = {
      fCreateTime: new Date(),
      fInterfaceName: '基本结束日期校验接口',
      fInterfaceUrl: url,
      fInputParameter: JSON.stringify(pushObj),
      fProtocolNo: projectNo,
    }
    await oaRequestInstance
      .post(url, oaQuest)
      .then(function (res) {
        result = res
        interfaceLogForm.fInterfaceInfo = JSON.stringify(res)
        interfaceLogForm.fInterfaceStatus = '1'
        requestInstance.post('/pm/interface/log/save', interfaceLogForm)
      })
      .catch(function (error) {
        result.STATUS = 'E'
        result.MESSAGE = JSON.stringify(error)
        interfaceLogForm.fInterfaceInfo = JSON.stringify(error)
        interfaceLogForm.fInterfaceStatus = '2'
        requestInstance.post('/pm/interface/log/save', interfaceLogForm)
      })
    return result
  }
  /**
   * 归档内网校验接口
   * 推送用户，项目编号，pmId
   * @param projectId pmId
   * @param projectNo 项目编号
   * @param flag "apply"/"confirm" 申请归档/确认归档
   * @return return {STATUS : "S/E" , MESSAGE : "异常信息", fDate : "基本结束日期", fId : "归档编号"}
   */
  api.fileCheck = async function (projectId, projectNo, flag) {
    var pushObj = {
      pmId: projectId,
      projectNo: projectNo,
      flag: flag ? flag : 'apply',
    }

    var oaQuest = await this.oaQuestMap(pushObj)
    var result = {}
    var url = baseUrl.oaUrl + '/j/api/sitc/jy/prj/prj_16_earc.jsp'
    var interfaceLogForm = {
      fCreateTime: new Date(),
      fInterfaceName: '归档内网校验接口',
      fInterfaceUrl: url,
      fInputParameter: JSON.stringify(pushObj),
      fProtocolNo: projectNo,
    }
    await oaRequestInstance
      .post(url, oaQuest)
      .then(function (res) {
        result = res
        interfaceLogForm.fInterfaceInfo = JSON.stringify(res)
        interfaceLogForm.fInterfaceStatus = '1'
        requestInstance.post('/pm/interface/log/save', interfaceLogForm)
      })
      .catch(function (error) {
        result.STATUS = 'E'
        result.MESSAGE = JSON.stringify(error.message)
        interfaceLogForm.fInterfaceInfo = JSON.stringify(error)
        interfaceLogForm.fInterfaceStatus = '2'
        requestInstance.post('/pm/interface/log/save', interfaceLogForm)
      })
    return result
  }

  /**
   * 归档信息获取接口
   * @param projectNo
   */
  api.fileGet = async function (projectNo) {
    var pushObj = {}

    var oaQuest = await this.oaQuestMap(pushObj)
    var result = {}
    var url = baseUrl.oaUrl + '/j/api/sitc/jy/prj/'
    var interfaceLogForm = {
      fCreateTime: new Date(),
      fInterfaceName: '归档信息获取接口',
      fInterfaceUrl: url,
      fInputParameter: JSON.stringify(pushObj),
      fProtocolNo: projectNo,
    }
    await oaRequestInstance
      .post(url, oaQuest)
      .then(function (res) {
        result = res
        interfaceLogForm.fInterfaceInfo = JSON.stringify(res)
        interfaceLogForm.fInterfaceStatus = '1'
        requestInstance.post('/pm/interface/log/save', interfaceLogForm)
      })
      .catch(function (error) {
        result.STATUS = 'E'
        result.MESSAGE = JSON.stringify(error)
        interfaceLogForm.fInterfaceInfo = JSON.stringify(error)
        interfaceLogForm.fInterfaceStatus = '2'
        requestInstance.post('/pm/interface/log/save', interfaceLogForm)
      })
    return result
  }

  /**
   * 达标检查
   * @param projectNo
   */
  api.qualifyCheck = async function (projectNo) {
    var pushObj = {
      projectNo: projectNo,
    }

    var oaQuest = await this.oaQuestMap(pushObj)
    var result = {}
    var url = baseUrl.oaUrl + '/j/api/sitc/jy/prj/refresh_over_date.jsp'
    var interfaceLogForm = {
      fCreateTime: new Date(),
      fInterfaceName: '达标检查刷新接口',
      fInterfaceUrl: url,
      fInputParameter: JSON.stringify(pushObj),
      fProtocolNo: projectNo,
    }
    await oaRequestInstance
      .post(url, oaQuest)
      .then(function (res) {
        result = res
        interfaceLogForm.fInterfaceInfo = JSON.stringify(res)
        interfaceLogForm.fInterfaceStatus = '1'
        requestInstance.post('/pm/interface/log/save', interfaceLogForm)
      })
      .catch(function (error) {
        result.STATUS = 'E'
        result.MESSAGE = JSON.stringify(error.message)
        interfaceLogForm.fInterfaceInfo = JSON.stringify(error)
        interfaceLogForm.fInterfaceStatus = '2'
        requestInstance.post('/pm/interface/log/save', interfaceLogForm)
      })
    return result
  }

  /**
   * 归档信息查询
   */
  api.loadDocumentation = async function (projectNo) {
    var pushObj = {
      projectNo: projectNo,
    }
    var oaQuest = await this.oaQuestMap(pushObj)
    var result = {}
    var url = baseUrl.oaUrl + '/j/api/sitc/jy/prj/project_ly.jsp'
    var interfaceLogForm = {
      fCreateTime: new Date(),
      fInterfaceName: '归档信息查询接口',
      fInterfaceUrl: url,
      fInputParameter: JSON.stringify(pushObj),
      fProtocolNo: projectNo,
    }
    await oaRequestInstance
      .post(url, oaQuest)
      .then(function (res) {
        result = res
        interfaceLogForm.fInterfaceInfo = JSON.stringify(res)
        interfaceLogForm.fInterfaceStatus = '1'
        requestInstance.post('/pm/interface/log/save', interfaceLogForm)
      })
      .catch(function (error) {
        result.STATUS = 'E'
        result.MESSAGE = JSON.stringify(error.message)
        interfaceLogForm.fInterfaceInfo = JSON.stringify(error)
        interfaceLogForm.fInterfaceStatus = '2'
        requestInstance.post('/pm/interface/log/save', interfaceLogForm)
      })
    return result
  }

  /**
   * 生成加密报文
   * @param form
   * @returns {Promise<*>}
   */
  api.oaQuestMap = async function (form) {
    form.s = context.user()
    form.t = new Date().getTime()
    var res = await requestInstance.post('/pm/pms/oaQuestMap', form)
    return res.oaQuest
  }

  api.loadWorkbench = async function () {
    var oaQuest = await this.oaQuestMap({})
    var result = {}
    var url = baseUrl.oaUrl + '/j/api/sitc/jy/user_workbench_1.jsp'
    var interfaceLogForm = {
      fCreateTime: new Date(),
      fInterfaceName: '近期工作概况（工作台）查询接口',
      fInterfaceUrl: url,
      fInputParameter: '',
    }
    await oaRequestInstance
      .post(url, oaQuest)
      .then(function (res) {
        result = res
        interfaceLogForm.fInterfaceInfo = JSON.stringify(res)
        interfaceLogForm.fInterfaceStatus = '1'
        requestInstance.post('/pm/interface/log/save', interfaceLogForm)
      })
      .catch(function (error) {
        result.STATUS = 'E'
        result.MESSAGE = JSON.stringify(error.message)
        interfaceLogForm.fInterfaceInfo = JSON.stringify(error)
        interfaceLogForm.fInterfaceStatus = '2'
        requestInstance.post('/pm/interface/log/save', interfaceLogForm)
      })
    return result
  }

  return api
}

export default createApi
