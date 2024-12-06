import moment from 'moment'
import request from '@/utils/request3.js'

// 定义一个可能为null的requestInstance变量
let requestInstance = null

function createApi(currentInstance) {
  if (!requestInstance) {
    requestInstance = new request(currentInstance)
  }
  const api = {}
  api.loadTemplate = async (id) => {
    const getProjectModel = async (projectId) => {
      let response = await requestInstance.post(
        `/pm/projectNo/applicationa/projectView?fId=${projectId}`,
      )
      const { data } = response
      return data
    }
    let projectModel = await getProjectModel(id)
    return await template(projectModel)
  }
  return api
}
export default createApi

const template = async (projectModel) => {
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
        </div>
    </body>
    </html>`
  return html
}

/** 电子归档快照 */
const projectRegistration = async (projectModel) => {
  let html = `<div class="card">
        <h3>电子归档上传</h3>
        <table class="table">
            <colgroup><col width="15%"/><col/></colgroup>
            <tr><td>项目编号	</td><td>${projectModel.fProtocolNo}</td></tr>
            <tr><td>项目名称	</td><td>${projectModel.fName}</td></tr>
            <tr><td>项目经理	</td><td>${projectModel.fDeptManager.fName}</td></tr>
        </table>
        <h3>方案征集项目电子归档</h3>
        <table class="table">
            <colgroup><col width="15%"/><col/></colgroup>
            <tr><td>项目前期资料</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain', 'earlyInfomation')}</td></tr>
            <tr><td>工作计划</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain', 'workPlan')}</td></tr>
            <tr><td>资格预审资料(若有)</td>
            <td><table class="table">
                <tr><td>资格预审公告</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.notice.AppsNoticeMain', 'preReport')}</td></tr>
                <tr><td>资格预审结果公告</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.notice.AppsNoticeMain', 'noticeFinishMain')}</td></tr>
                <tr><td>资格预审报告</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.notice.AppsNoticeMain', 'preReport')}</td></tr>
              </table>
            </td></tr>
            <tr><td>方案征集邀请书(若有)</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain', 'invitationLetter')}</td></tr>
            <tr><td>方案征集合同及附件*	</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain', 'collectionFile')}</td></tr>
            <tr><td>澄清问题、补充文件及附件(若有)	</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain', 'supplementFile')}</td></tr>
            <tr><td>书面情况报告*</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.collection.AppsCollectionResult', 'writtenReport')}</td></tr>
            <tr><td>评审结果公告(若有)</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain', 'originalNotice')}</td></tr>
            <tr><td>评审结果通知(若有)	</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain', 'reviewResults')}</td></tr>
            <tr><td>最终设计成果*</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.report.AppsReport', 'resultFile')}</td></tr>
	          <tr><td>其他文件	</td>
            <td><table class="table">
                <tr><td style='width:30%'>项目其他文件</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain', 'other')}</td></tr>
                <tr><td style='width:30%'>资格预审其他文件</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.notice.AppsNoticeMain', 'noticeOtherFile')}</td></tr>
                <tr><td style='width:30%'>征集结果其他文件</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.collection.AppsCollectionResult', 'other')}</td></tr>
                <tr><td style='width:30%'>其他</td><td>${await getAttachment(projectModel.fId, 'com.qkinfotech.core.tendering.model.apps.project.AppsProjectMain', 'documnetationFile')}</td></tr>
              </table>
            </td></tr>
        </table>
    </div>`
  return html
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

