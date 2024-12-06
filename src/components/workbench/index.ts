import UserProcess from './UserProcess.vue'
import PurchaseNotice from './PurchaseNotice.vue'
import OfflineAudit from './OfflineAudit.vue'
import OfficialAccountProcess from './OfficialAccountProcess.vue'
import LawKnowledge from './LawKnowledge.vue'
import OrgStructDiagram from './OrgStructDiagram.vue'
import TextLibrary from './TextLibrary.vue'
import ExamArrange from './ExamArrange.vue'
import EchartReport from './EchartReport.vue'
import WaitAlloAgreement from './WaitAlloAgreement.vue'
import SupplierProject from './SupplierProject.vue'
import UserProject from './UserProject.vue'
import Todo from './Todo.vue'
import PurchaseAnnouncement from './PurchaseAnnouncement.vue'

const componentsMap = {
  UserProcess, //我的流程
  PurchaseNotice, //采购公告
  OfflineAudit, //线下待审
  OfficialAccountProcess, //公众号流程
  LawKnowledge, //法律法规知识库
  OrgStructDiagram, //业主架构图
  TextLibrary, //文本库
  ExamArrange, //考试安排
  EchartReport, //图形报表组件
  WaitAlloAgreement, //待分配协议
  SupplierProject, //供应商项目
  UserProject, //我的项目
  Todo, //待办
  PurchaseAnnouncement, //已领购项目
}
export default componentsMap
