import moment from 'moment'
import request from '@/utils/request3.js'

// 定义一个可能为null的requestInstance变量
let requestInstance = null

function createApi(currentInstance) {
  if (!requestInstance) {
    requestInstance = new request(currentInstance)
  }
  const api = {}
  api.loadTemplate = async (id,form) => {
    const getProjectModel = async (projectId) => {
      let response = await requestInstance.post(
        `/pm/projectNo/applicationa/projectView?fId=${projectId}`,
      )
      const {
        data
      } = response
      data.fIsClassified = data.fIsClassified ? '是' : '否'
      //项目性质
      data.fProjectNatureName = data.appsNatureNameArray
      return data
    }
    let projectModel = await getProjectModel(id)
    projectModel.fProjectTypes = await getProjectTypes()
    projectModel.fProjectTags = await getProjectTags()
    projectModel.fPackageOption = await projectPackage(id)
    return await template(projectModel,form)
  }
  return api
}
export default createApi

// export async function loadTemplate(id) {
//   const getProjectModel = async (projectId) => {
//     let response = await axios.post(
//       `/pm/projectNo/applicationa/projectView?fId=${projectId}`,
//     )
//     const { data } = response
//     data.fIsClassified = data.fIsClassified ? '是' : '否'
//     //项目性质
//     data.fProjectNatureName = data.appsNatureNameArray

//     return data
//   }
//   let projectModel = await getProjectModel(id)
//   projectModel.fProjectTypes = await getProjectTypes()
//   projectModel.fProjectTags = await getProjectTags()
//   projectModel.fPackageOption = await projectPackage(id)
//   console.log(projectModel, 'projectModel')
//   return await template(projectModel)
// }

const template = async (projectModel,form) => {
  let html = `<html lang="en">
    <head>
    <style>
        body {
            background:#f0f2f5;
        }
        .page {
            page-break-after: always;
            width: 98%;
            box-sizing: border-box;
            margin: auto;
        }
        .card {
            background-color: #ffffff;
            padding: 20px;
            margin-bottom: 20px;
        }
        .card ul {
            list-style: none;
            margin: 0;
            padding: 0;
        }
        .card li {
            border: 1px solid rgba(239, 239, 245, 1);
            padding: 0 20px 20px;
        }
        .list{
            border: 1px solid rgba(239, 239, 245, 1);
            padding: 20px;
            margin-bottom: 20px;
        }
        .table {
            border-collapse: collapse;
            width: 100%;
        }
        .table th,.table td {
            border: 1px solid rgba(239, 239, 245, 1);
            padding: 8px;
            text-align: left;
        }
        .table th:nth-child(1), .table th:nth-child(3),.table td:nth-child(1), .table td:nth-child(3) {
            text-align: center;
        }
        .list-table {
            border-collapse: collapse;
            width: 100%;
        }
        .list-table th {
            background-color: rgba(250, 250, 252, 1) !important;
            font-weight: normal !important;
        }
        .list-table th,.list-table td {
            border: 1px solid rgba(239, 239, 245, 1) !important;
            padding: 8px !important;
            text-align: left !important;
        }
        .no-border-table {
            border-collapse: collapse;
            border: none !important;
            width: 100%;
        }
        .no-border-table td{
            border: none;
        }
        .scales{
            display: flex;
            gap: 10px;
            margin-right: 20px;
        }
        .scales-content{
            display: grid;
            gap: 10px;
        }
    </style>
    </head>
    <body>
        <div class="page">
        ${await projectRegistration(projectModel)}
        ${await prequalification(projectModel)}
        ${await isoCirculationForm(projectModel)}
        ${await collectionFiles(projectModel)}
        ${await projectStartMeeting(projectModel)}
        ${await reportReview(projectModel)}
        ${await collectResults(projectModel)}
        ${archivedInfo(form.value)}
        </div>
    </body>
    </html>`
  return html
}


const formatDate = (date, format) => {
  format = format || 'yyyy-MM-dd'
  date = date || new Date()
  // 使用moment格式化日期
  let now = moment(date)
  let formattedDate = now.format(format)
  return formattedDate
}

/** 项目登记 */
const projectRegistration = async (projectModel) => {
  const loadScaleGroup = (fScales) => {
    const selectedGroup = []
    for (var i = 0; i < fScales.length; i++) {
      if (!selectedGroup.includes(fScales[i].fGroup)) {
        selectedGroup.push(fScales[i].fGroup)
      }
    }
    return selectedGroup
  }
  //加载【项目规模】数据
  const loadTypeScales = (fScales) => {
    let typeScalesHtml = ''
    const selectedGroup = loadScaleGroup(fScales)
    typeScalesHtml += `<tr><td>项目规模</td>`
    typeScalesHtml +=
      '<td style="display: flex;justify-content: space-between;">'
    selectedGroup.forEach((groupName) => {
      typeScalesHtml += `<div class="scales"><div>${groupName}</div>`
      typeScalesHtml += '<div class="scales-content">'
      fScales.forEach((item) => {
        typeScalesHtml +=
          `<span><input value='${item.fValue}' disabled/>&nbsp;${item.fScale.fName}</span>`
      })
      typeScalesHtml += '</div>'
    })
    typeScalesHtml += '</td>'
    // typeScaleGroup.forEach((item) => {
    //   typeScalesHtml += `${item.value} ${item.fMasterDataScaleId.fName}</td>`
    // })
    typeScalesHtml += '</tr>'
    return typeScalesHtml
  }
  let html = `<div class="card">
        <h1>项目登记</h1>
        <h3>基本信息</h3>
        <table class="table">
            <colgroup><col width="15%"/><col width="35%"/><col width="15%"/><col/></colgroup>
            <tr><td>项目编号</td><td>${projectModel.fProtocolNo}</td><td>类别</td><td>${projectModel.fProjectCategory.fNumber} ${projectModel.fProjectCategory.fName}</td></tr>
            <tr><td>协议编号</td><td colspan="3">${projectModel.fProtocolNumber}</td></tr>
            <tr><td>项目名称</td><td>${projectModel.fName}</td><td>项目简称</td><td>${projectModel.fSimpleName}</td></tr>
            <tr><td>英文名称</td><td>${projectModel.fEngName}</td><td>业主</td><td>${projectModel.fOwner}</td></tr>
            <tr><td>项目模式</td><td colspan="3">${projectModel.fProjectMode.fName}</td></tr>
            <tr><td>登记日期</td><td colspan="3">${formatDate(new Date())}</td></tr>
            <tr><td>部门</td><td>${projectModel.fDept.fName}</td><td>项目经理</td><td>${projectModel.fDeptManager.fName}</td></tr>
            <tr><td>项目组成员</td><td colspan="3">${projectModel.fProjectMembers.map((item) => item.fName)}</td></tr>
            <tr><td>项目性质</td><td>${projectModel.fProjectNatureName.join(' ')}</td><td>项目重要性</td><td>${projectModel.fProjectImportance.fName}</td></tr>
            <tr><td>征集费预算</td><td>${projectModel.fProjectBudget}人民币</td><td>预期收入</td><td>${projectModel.fPlanIncome}元（人民币）</td></tr>
            <tr><td>开拓信息</td><td>${projectModel.fDevelopInfo}</td><td>项目执行地</td><td colspan="3">${projectModel.fExecutionCountry?.fName} ${projectModel.fExecutionCity?.fName}</td></tr>
            <tr><td>涉密项目</td><td colspan="3">${projectModel.fIsClassified}</td></tr>
            <tr><td>TimeSheet用时</td><td colspan="3">${11}</td></tr>
            <tr><td>项目备注</td><td colspan="3">${projectModel.fNotes}</td></tr>
        </table>
        <h3>项目概况</h3>
        <table class="table">
            <colgroup><col width="15%"/><col/></colgroup>
            <tr><td>项目地点</td><td>${projectModel.fProjectPlace}</td></tr>
            <tr><td>项目类型</td><td>${projectModel.fProjectTypes.filter((item) => projectModel.selectedType.includes(item.fId))?.map((item) => item.fName)}</td></tr>
            <tr><td>项目标签</td><td>${projectModel.fProjectTags.filter((item) => projectModel.selectedTag.includes(item.fId))?.map((item) => item.fName)}</td></tr>
            ${loadTypeScales(projectModel.fScales)}
            <tr><td>包件信息</td><td>${projectModel.fPackageOption.map((item) => item.fName)}</td></tr>
        </table>
        <h3>附件上传</h3>
        <table class="table">
            <colgroup><col width="15%"/><col/></colgroup>
            <tr><td>项目建议书</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain', 'projectProposal')}</td></tr>
            <tr><td>前期资料</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain', 'earlyInfomation')}</td></tr>
            <tr><td>工作计划</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain', 'workPlan')}</td></tr>
            <tr><td>其他</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain', 'other')}</td></tr>
        </table>
    </div>`
  return html
}

/** 资格预审 */
const prequalification = async (projectModel) => {
  /** 预审公告信息 */
  const preNoticeInfo = async (projectId) => {
    const getBidCompanyInfoList = async (noticeId) => {
      const query = [{
        eq: {
          'fMain.fId': noticeId,
        },
      }, ]
      const res = await requestInstance.post(
        '/pm/apps/notice/company/bid/list', {
          query: query,
        },
      )
      return res.data.list
    }
    /** 获取申请文件 */
    const getApplyFiles = async (noticeId) => {
      //通过noticeId查询apps_supplier_main表记录，再查attachment_main表：modelName=com.qkinfotech.core.tendering.model.apps.supplier.AppsSupplierMain; key=supplierMain
      var result = []
      var supplierMains = await requestInstance.post(
        '/pm/apps/supplier/main/list', {
          query: {
            eq: {
              'fNotice.fId': noticeId,
            },
          },
        },
      )
      if (supplierMains.status == 200) {
        if (supplierMains.data.list.length > 0) {
          var modelIds = []
          for (var i = 0; i < supplierMains.data.list.length; i++) {
            modelIds.push(supplierMains.data.list[i].fId)
          }
          var applyFiles = await requestInstance.post(
            '/pm/attachment/main/list', {
              query: {
                and: [{
                    eq: {
                      fModelName: 'com.qkinfotech.core.tendering.model.apps.supplier.AppsSupplierMain',
                    },
                  },
                  {
                    eq: {
                      fKey: 'supplierMain'
                    }
                  },
                  {
                    in: {
                      fModelId: modelIds
                    }
                  },
                ],
              },
            },
          )
          if (applyFiles.status == 200) {
            result = applyFiles.data.list
          }
        }
      }
      return result
    }
    const loadBidUnit = async (noticeId) => {
      let bidCompanyInfoList = await getBidCompanyInfoList(noticeId)
      let html = '<table class="no-border-table">'
      bidCompanyInfoList.forEach((item) => {
        html +=
          `<tr><td>${item.fApplyName}</td><td>${item.fContacts}</td><td>${item.fPhone}</td><td>${item.fBusinessStatus}</td><td>${item.fPackageName}</td><td>${item.fCreateTime}</td></tr>`
      })
      html += '</table>'
      return html
    }
    let response = await requestInstance.post('/pm/notice/main/noticeList', {
      fId: projectId,
    })
    const {
      data
    } = response
    let html = ''
    for (let item of data) {
      //申请文件
      const applyFilesList = await getApplyFiles(item.noticeId)
      html += `<table class="table">
                <colgroup><col width="15%"/><col width="35%"/><col width="15%"/><col/></colgroup>
                <tr><td>公告标题</td><td colspan="3">${item.title}</td></tr>
                <tr><td>包件信息</td><td>${item.packageNames}</td><td>资格预审公告</td><td>${item.noticeName}</td></tr>
                <tr><td>公告发布日期</td><td>${item.noticeReleaseDate}</td><td>标书获取日期</td><td>${item.bidTerm}</td></tr>
                <tr><td>获取标书单位</td><td colspan="3">${await loadBidUnit(item.noticeId)}</td></tr>
                <tr><td>申请文件</td><td colspan="3">${applyFilesList?.map((f) => f.fFileName)}</td></tr>
                <tr><td>申请文件截至日期</td><td colspan="3">${item.appDocDeadline}</td></tr>
            </table>`
    }
    return html
  }

  /** 预审会议信息 */
  const preMeetingInfo = async (projectId) => {
    let response = await requestInstance.post('/pm/pre/meeting/meetinglist', {
      fId: projectId,
    })
    const {
      data
    } = response
    let html = '<div class="list">'
    for (let item of data) {
      html += `<br/><table class="table"><colgroup><col width="15%"/><col /></colgroup>
                        <tr><td>包件信息</td><td>${item.packageName}</td></tr>
                        <tr><td>会议类型</td><td>${item.type}</td></tr>
                        <tr><td>会议地点</td><td>${item.meetingRoom}</td></tr>
                        <tr><td>会议时间</td><td>${item.meetingStartTime} ~ ${item.meetingEndTime}</td></tr>
                        <tr><td>业主专家</td><td>${item.fOwnerExpert}</td></tr>
                        <tr><td>外聘专家</td><td>${item.fOutsideExpert.map((exp) => exp.name)}</td></tr>
                        <tr><td>备注</td><td>${item.remarks}</td></tr>
                    </table>`
    }
    html += '</div>'
    return html
  }
  const preNominationResults = async (projectId) => {
    const companyPackage = async (projectId) => {
      var query = []
      query.push({
        eq: {
          'fProjectId.fId': projectId,
        },
      })
      let response = await requestInstance.post(
        '/pm/apps/finaliaztion/result/package/list', {
          query: query,
        },
      )
      return response.data.list
    }
    let html =
      '<table class="table"><colgroup><col width="15%"/><col/></colgroup>'
    let projectPackageData = await projectPackage(projectId)
    let companyPackageData = await companyPackage(projectId)
    projectPackageData.forEach((item) => {
      html +=
        `<tr><td>${item.fName}</td><td>${companyPackageData.filter((cp) => cp.fPackageId?.fId === item.fId).map((m) => m.fCompanyId?.fName)}</td></tr>`
    })
    html += '</table>'
    return html
  }
  let html = `<div class="card">
                <h3>资格预审公告信息</h3>
                ${await preNoticeInfo(projectModel.fId)}
                <h3>资格预审会议信息</h3>
                ${await preMeetingInfo(projectModel.fId)}
                <h3>资格预审入围结果</h3>
                ${await preNominationResults(projectModel.fId)}
                <h3>附件信息</h3>
                <table class="table">
                    <colgroup>
                    <col width="15%"/>
                    <col />
                    </colgroup>
                    <tr><td>资格预审文件*</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.notice.AppsNoticeMain', 'preAudit')}</td></tr>
                    <tr><td>资格预审公告*</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.notice.AppsNoticeMain', 'noticeMain')}</td></tr>
                    <tr><td>资格预审结果公告*</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.notice.AppsNoticeMain', 'noticeFinishMain')}</td></tr>
                    <tr><td>资格预审报告</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.notice.AppsNoticeMain', 'preReport')}</td></tr>
                    <tr><td>其他</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.notice.AppsNoticeMain', 'noticeOtherFile')}</td></tr>
                </table>
              </div>`
  return html
}

/** ISO流转单 */
const isoCirculationForm = async (projectModel) => {
  const formatStatus = (status) => {
    switch (status) {
      case '00':
        return '废弃'
      case '30':
        return '已完成'
      default:
        return '审批中'
    }
  }
  const computeCostTime = (finishTime, createTime) => {
    if (finishTime) {
      return (
        moment(finishTime).diff(moment(createTime), 'hours', false) + '小时'
      )
    } else {
      return ''
    }
  }
  const loadData = async (protocolNo) => {
    var andQuery = []
    var eqNo = {
      eq: {
        fProjectNo: protocolNo,
      },
    }
    andQuery.push(eqNo)
    var query = {
      and: andQuery,
    }
    var param = {
      distinct: true,
      query: query,
    }
    let response = await requestInstance.post('/pm/iso/approval/list', param)
    const {
      list
    } = response.data
    let html = ''
    list.forEach((item) => {
      html +=
        `<tr><td>${item.fSubject}</td><td>${item.fNo}</td><td>${formatStatus(item.fStatus)}</td><td>${item.fCreatorName}</td><td>${item.fCreateTime}</td><td>${computeCostTime(item.fFinishTime, item.fCreateTime)}</td></tr>`
    })
    return html
  }
  let html = `<div class="card">
                <h3>ISO流转单</h3>
                <table class="list-table">
                    <tr><th>ISO表单名</th><th>ISO编号</th><th>内容</th><th>填写人</th><th>填写日期</th><th>审阅用时</th></tr>
                    ${await loadData(projectModel.fProtocolNo)}
                </table>
            </div>`
  return html
}

/** 征集文件 */
const collectionFiles = async (projectModel) => {
  let html = `<div class="card">
                <h4>征集文件</h4>
                <table class="table">
                    <colgroup><col width="15%"/><col/></colgroup>
                    <tr><td>征集文件</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain', 'collectionFile')}</td></tr>
                </table>
                <h4>附件上传</h4>
                <table class="table">
                    <colgroup><col width="15%"/><col/></colgroup>
                    <tr><td>答疑文件</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain', 'answerFile')}</td></tr>
                    <tr><td>技术资料</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain', 'tecFile')}</td></tr>
                </table>
            </div>`
  return html
}

/** 项目启动会 */
const projectStartMeeting = async (projectModel) => {
  const loadMeeting = async (projectId) => {
    let html = ''
    let response = await requestInstance.post(
      '/pm/meeting/kickoff/meetinglist', {
        fId: projectId,
      },
    )
    const {
      data
    } = response
    for (let item of data) {
      Object.assign(item, item.json)
      html += `<div class="list">
                    <h4>会议信息</h4>
                    <table class="table">
                        <colgroup><col width="15%"/><col/></colgroup>
                        <tr><td>包件信息</td><td>${item.packageName}</td></tr>
                        <tr><td>会议名称</td><td>${item.fName}</td></tr>
                        <tr><td>会议时间</td><td>${item.meetingStartTime} ~ ${item.meetingEndTime}</td></tr>
                        <tr><td>会议地点</td><td>${item.meetingRoom}</td></tr>
                    </table>
                </div>`
    }
    return html
  }
  let html = `<div class="card">
                <h3>项目启动会</h3>
                ${await loadMeeting(projectModel.fId)}
            </div>`
  return html
}

/** 汇报评审 */
const reportReview = async (projectModel) => {
  const loadMeetingList = async (projectId) => {
    let html = ''
    let response = await requestInstance.post('/pm/report/meetinglist', {
      fId: projectId,
    })
    const {
      data
    } = response
    for (let item of data) {
      html += `<div class="list">
                    <h4>会议信息</h4>
                    <table class="table">
                        <colgroup><col width="15%"/><col width="35%"/><col width="15%"/><col/></colgroup>
                        <tr><td>包件信息</td><td>${item.packageName}</td><td>会议类型</td><td>${item.type}</td></tr>
                        <tr><td>会议名称</td><td>${item.fName}</td><td>会议时间</td><td>${item.meetingStartTime} ~ ${item.meetingEndTime}</td></tr>
                        <tr><td>会议地点</td><td>${item.meetingRoom}</td><td>业主专家</td><td>${item.fOwnerExpert}</td></tr>
                        <tr><td>外聘专家</td><td>${item.fOutsideExpert.map((expert) => expert.name)}</td><td>备注</td><td>${item.remarks}</td></tr>
                    </table>
                </div>`
    }
    return html
  }

  let html = `<div class="card">
                <h3>汇报评审</h3>
                ${await loadMeetingList(projectModel.fId)}
            </div>`
  return html
}

/** 征集结果 */
const collectResults = async (projectModel) => {
  const confirmTime = async (projectId) => {
    let html = ''
    // html += '<table class="list-table"><tr><th>确认时间</th></tr>'
    // var query = [{ eq: { 'fMainId.fId': projectId } }]
    // var sort = ['fConfirmTime desc']
    // let response = await axios.post('/pm/apps/collection/result/list', {
    //   query: query,
    //   sort: sort,
    // })
    // let list = response.data.list
    // list.forEach((item) => {
    //   html += `<tr><td>${item.fConfirmTime}</td></tr>`
    // })
    // html += '</table>'
    return html
  }

  const getLastrstResult = async (projectMainId) => {
    var query = [{
      eq: {
        'fMainId.fId': projectMainId
      }
    }]
    var sort = ['fConfirmTime desc']
    const res = await requestInstance.post('/pm/apps/collection/result/list', {
      query: query,
      sort: sort,
    })
    return res.data.list.length > 0 ? res.data.list[0].fId : ''
  }

  const appsCollectionResultDetail = async (data) => {
    let html = '<table class="list-table">'
    html +=
      '<tr><th>公司名称</th><th>方案征集费(万元)</th><th>奖金(万元)</th><th>评审排序</th></tr>'
    // datas.forEach((item) => {
    html +=
      `<tr><td>${data.fCompany.fName}</td><td>${data.fCollectionPrice}</td><td>${data.fPrice}</td><td>${data.fIndex}</td></tr>`
    // })
    html += '</table>'
    return html
  }
  /**公司名称装换 */
  const companyName = async (companyId) => {
    try {
      const response = await requestInstance.post(
        '/pm/org/person/load?fId=' + companyId,
      )
      const company = {
        fName: response.data.fName,
        fId: companyId,
      }
      return company
    } catch (error) {
      console.error('There was an error!', error)
      throw error // 如果需要可以抛出错误
    }
  }
  const resultPackageDetail = async (projectId) => {
    let html = ''
    let resPackageList = await requestInstance.post(
      '/pm/apps/collection/result/package/list',
    )
    let packageList = resPackageList.data?.list || []
    let sumPackageList = []
    for (let item of packageList) {
      const detailResponse = await requestInstance.post(
        '/pm/apps/collection/result/detail/load?fId=' +
        item.appsCollectionResultDetail.fId,
      )
      const companyJson = await companyName(detailResponse.data.fCompany.fId)
      const resultResponse = await requestInstance.post(
        '/pm/apps/collection/result/load?fId=' +
        detailResponse.data.fResultId.fId,
      )
      item.appsCollectionResultDetail.fCompany = companyJson
      if (
        resultResponse.data.fMainId.fId === projectId &&
        resultResponse.data.fId === (await getLastrstResult(projectId))
      ) {
        sumPackageList.push(item)
        html +=
          `<tr><td>${item.appsProjectPackage.fName}</td><td>${await appsCollectionResultDetail(item.appsCollectionResultDetail)}</td></tr>`
      }
    }
    // 使用reduce方法计算总和
    const totalSum = sumPackageList.reduce((accumulator, currentValue) => {
      // accumulator是累加器，初始值为0（如果未指定，则默认为数组的第一个元素）
      // 在这里，我们将每个对象的fCollectionPrice和fPrice相加，并累加到accumulator上
      return (
        Number(accumulator) +
        Number(currentValue.appsCollectionResultDetail.fCollectionPrice) +
        Number(currentValue.appsCollectionResultDetail.fPrice)
      )
    }, 0)
    html += `<tr><td>总金额</td><td>${totalSum.toFixed(2)}</td></tr>`
    return html
  }

  let html = `<div class="card">
                <h4>征集结果</h4>
                ${await confirmTime(projectModel.fId)}
                <div class="list">
                  <table class="table">
                    <colgroup><col width="15%"/><col/></colgroup>
                    ${await resultPackageDetail(projectModel.fId)}
                    <tr><td>方案效果图</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.collection.AppsCollectionResult', 'solutionEffect')}</td></tr>
                  </table>
                  <h4>附件上传</h4>
                  <table class="table">
                    <colgroup><col width="15%"/><col/></colgroup>
                    <tr><td>成果文件</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.report.AppsReport', 'resultFile')}</td></tr>
                    <tr><td>书面报告</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.collection.AppsCollectionResult', 'writtenReport')}</td></tr>
                    <tr><td>其他</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.collection.AppsCollectionResult', 'other')}</td></tr>
                  </table>
                </div>
              </div>`
  return html
}

/** 归档信息 */
const archivedInfo = (projectModel) => {
  let html = `<div class="card">
                <h3>归档信息<br/>履约奖信息</h3>
                <table class="table">
                  <colgroup><col width="15%"/><col width="35%"/><col width="15%"/><col/></colgroup>
                  <tr><td>项目类别</td><td>${projectModel.projectType}</td><td>中标金额</td><td>${projectModel.bidCount}</td></tr>
                  <tr><td>包件信息</td><td>${projectModel.packages.map((item) => item.name)}</td><td>投标人数量</td><td>${projectModel.fTenderNum}</td></tr>
                  <tr><td>项目重要性</td><td>${projectModel.projectImportance}</td><td>公司电子采购平台、进场招标</td><td>${projectModel.fIsCompanyProcurement}</td></tr>
                  <tr><td>使用语言</td><td>${projectModel.fLanguage}</td><td>有无资格预审</td><td colspan="3">${projectModel.hasPre}</td></tr>
                  <tr><td>履约奖</td><td>${projectModel.fPerpormancePrice}</td><td>履约发奖日期</td><td>${projectModel.fPerpormanceTime}</td></tr>
                  <tr><td>开拓奖</td><td>${projectModel.fDevelopPrice}</td><td>开拓发奖日期</td><td>${projectModel.fDevelopTime}</td></tr>
                </table>
                <h3>归档履约信息</h3>
                <table class="table">
                  <colgroup><col width="15%"/><col width="35%"/><col width="15%"/><col/></colgroup>
                  <tr><td>项目登记日期</td><td>${projectModel.fProjectRegisterTime}</td><td>基本结束日期</td><td>${projectModel.fBaseFinishTime} 周期${projectModel.circleTime}天</td></tr>
                  <tr><td>实际代理费</td><td colspan="3">${projectModel.fAgencyFee}</td></tr>
                  <tr><td>限制结束日期</td><td>${projectModel.fLimitFinishTime}</td><td>达标日期</td><td>${projectModel.fQuelifyTime}</td></tr>
                  <tr<td>归档申请</td><td colspan="3">${projectModel.fDocumentationNo}</td></tr>
                  <tr><td>协议归档编号</td><td>${projectModel.fProtocolDocumentationNo}</td><td>协议归档日期</td><td>${projectModel.fProtocolDocumentationTime}</td></tr>
                  <tr><td>履约评价表编号</td><td>${projectModel.fEvaluationNo}</td><td>履约上交日期</td><td>${projectModel.fEvaluationTime}</td></tr>
                  <tr><td>归档编号</td><td>${projectModel.fDocumentationNo}</td><td>归档日期</td><td>${projectModel.fDocumentationTime}</td></tr>
                  <tr><td>财务结算日期</td><td>${projectModel.fFinanceBalanceTime}</td><td>费用结算日期</td><td>${projectModel.fFeeBalanceTime}</td></tr>
                </table>
              </div>`
  return html
}

/** 获取所有包件信息 */
const projectPackage = async (projectId) => {
  var query = []
  query.push({
    eq: {
      'fMainId.fId': projectId,
    },
  })
  let response = await requestInstance.post('/pm/apps/project/package/list', {
    query: query,
  })
  return response.data.list
}

/** 获取附件 */
const getAttachment = async (fModelId, fModelName, fKey) => {
  var param = []
  var eq = []
  eq.push({
    eq: {
      fModelName: fModelName,
    },
  })
  eq.push({
    eq: {
      fModelId: fModelId,
    },
  })
  eq.push({
    eq: {
      fKey: fKey,
    },
  })
  eq.push({
    neq: {
      fDisplay: '1',
    },
  })
  param.push({
    and: eq,
  })
  let response = await requestInstance.post('/pm/attachment/main/list', {
    query: param,
    distinct: true,
  })
  // console.log(response, 'attach')
  return response.data.list.map((item) => item.fFileName)
}

/** 获取项目类型 */
const getProjectTypes = async () => {
  let response = await requestInstance.post('/pm/masterdata/type/list')
  return response.data.list
}
/** 获取项目标签 */
const getProjectTags = async () => {
  let response = await requestInstance.post('/pm/masterdata/tag/list')
  return response.data.list
}
