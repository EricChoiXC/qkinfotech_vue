<template>
  <div>
    <n-grid :y-gap="8" :cols="1">
      <n-grid-item>
        <div style="margin-bottom: 10px">
          <p style="font-size: 18px; font-weight: bold">
            资格预审公告信息
            <n-button tag="a" @click="ekpJumpNews" type="primary" v-if="
                props.data.isManager &&
                props.data.fAuditStatus == '1' &&
                !finishDocumentation
              ">
              发布公告
            </n-button>
          </p>
        </div>
        <div>
          <noticeList :data="noticeData" :isManaget="
              props.data.isManager &&
              props.data.fAuditStatus == '1' &&
              !finishDocumentation
            " />
        </div>
      </n-grid-item>
      <n-grid-item>
        <n-space vertical>
          <div style="margin-bottom: 10px">
            <n-space>
              <p style="font-size: 18px; font-weight: bold">资格预审会议信息</p>
              <n-select :options="hasMeeting" v-model:value="hasVal" style="width: 80px" :disabled="
                  !props.data.isManager ||
                  meetingData.length > 0 ||
                  props.data.fAuditStatus != '1' ||
                  finishDocumentation
                "></n-select>
              <n-button-group v-if="hasVal">
                <n-space>
                  <n-button v-if="
                      props.data.isManager &&
                      props.data.fAuditStatus == '1' &&
                      !finishDocumentation
                    " type="primary" @click="handleSelect()">
                    添加
                  </n-button>
                  <n-button tag="a" @click="reservationOaMeeting" target="_blank" type="primary" v-if="
                      props.data.fAuditStatus == '1' && !finishDocumentation
                    ">
                    会议室预订
                  </n-button>
                  <n-button tag="a" @click="reservationOaCar" target="_blank" type="primary" v-if="
                      props.data.fAuditStatus == '1' && !finishDocumentation
                    ">
                    车辆预订
                  </n-button>
                  <n-button tag="a" @click="openOaMeetingRoom" type="primary">
                    会议室查看
                  </n-button>
                  <n-button tag="a" @click="openOaCar" type="primary">
                    车辆查看
                  </n-button>
                </n-space>
              </n-button-group>
            </n-space>
          </div>
          <div v-if="hasVal">
            <meetingList :data="meetingData" @init="init" :isManager="
                props.data.isManager &&
                props.data.fAuditStatus == '1' &&
                !finishDocumentation
              " />
          </div>
        </n-space>
      </n-grid-item>
      <n-grid-item>
        <n-space vertical>
          <div>
            <p style="font-size: 18px; font-weight: bold">
              入围名单
              <n-button-group>
                <n-space>
                  <n-button type="primary" @click="resultAdd" v-if="
                      props.data.isManager &&
                      props.data.fAuditStatus == '1' &&
                      !finishDocumentation
                    ">
                    入围结果
                  </n-button>
                  <n-button tag="a" @click="ekpJumpResultNews" type="primary" v-if="
                      props.data.isManager &&
                      props.data.fAuditStatus == '1' &&
                      !finishDocumentation
                    ">
                    发布公告
                  </n-button>
                </n-space>
              </n-button-group>
            </p>
          </div>
          <div>
            <finalizationList :isManager="
                props.data.isManager &&
                props.data.fAuditStatus == '1' &&
                !finishDocumentation
              " ref="finalizationListRef" />
          </div>
        </n-space>
      </n-grid-item>
      <n-grid-item>
        <div>
          <p style="font-size: 18px; font-weight: bold">附件信息</p>
        </div>
        <div>
          <div>
            <n-grid :y-gap="8" :cols="1">
              <n-grid-item span="2">
                <n-table :single-line="false">
                  <tbody>
                    <tr>
                      <td style="width: 20%" class="tdcenter">
                        资格预审文件<span v-if="requiredFlag" style="color: red">*</span><br />
                        <n-button type="success" @click="openIsoApproval"
                          v-show="props.data.isManager && props.data.fAuditStatus == '1' && !finishDocumentation">
                          成果产品检验流转
                        </n-button>
                      </td>
                      <td class="tdleft">
                        <sitc-attachment title="资格预审文件" modelName="com.qkinfotech.core.tendering.iso.model.IsoApproval"
                          :modelId="preAuditIsoId" fkey="资格预审文件" :disabled="true">
                        </sitc-attachment>
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 20%" class="tdcenter">
                        资格预审公告<span v-if="requiredFlag" style="color: red">*</span>
                      </td>
                      <td class="tdleft">
                        <sitc-attachment :linkPackage="true" :projectId="id" fkey="noticeMain"
                          modelName="com.qkinfotech.core.tendering.model.apps.notice.AppsNoticeMain"
                          :modelId="props.data.fId" :disabled="
                            !props.data.isManager ||
                            props.data.fAuditStatus != '1' ||
                            finishDocumentation
                          "></sitc-attachment>
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 20%" class="tdcenter">
                        资格预审结果公告<span v-if="requiredFlag" style="color: red">*</span>
                      </td>
                      <td class="tdleft">
                        <sitc-attachment :linkPackage="true" :projectId="id" fkey="noticeFinishMain"
                          modelName="com.qkinfotech.core.tendering.model.apps.notice.AppsNoticeMain"
                          :modelId="props.data.fId" :disabled="
                            !props.data.isManager ||
                            props.data.fAuditStatus != '1' ||
                            finishDocumentation
                          "></sitc-attachment>
                      </td>
                    </tr>
                    <!--       <tr>
                      <td style="width: 20%" class="tdcenter">申请人名单</td>
                      <td class="tdleft">
                        <sitc-attachment
                          :linkPackage="true"
                          :projectId="id"
                          fkey="applicantList"
                          modelName="com.qkinfotech.core.tendering.model.apps.notice.AppsNoticeMain"
                          :modelId="props.data.fId"
                          :disabled="
                            !props.data.isManager ||
                            props.data.fAuditStatus != '1' ||
                            finishDocumentation
                          "
                        ></sitc-attachment>
                      </td>
                    </tr> -->
                    <tr>
                      <td style="width: 20%" class="tdcenter">资格预审报告</td>
                      <td class="tdleft">
                        <sitc-attachment :linkPackage="true" :projectId="id" fkey="preReport"
                          modelName="com.qkinfotech.core.tendering.model.apps.notice.AppsNoticeMain"
                          :modelId="props.data.fId" :disabled="
                            !props.data.isManager ||
                            props.data.fAuditStatus != '1' ||
                            finishDocumentation
                          "></sitc-attachment>
                      </td>
                    </tr>
                    <tr>
                      <td style="width: 20%" class="tdcenter">其他</td>
                      <td class="tdleft">
                        <sitc-attachment :linkPackage="true" :projectId="id" fkey="noticeOtherFile"
                          modelName="com.qkinfotech.core.tendering.model.apps.notice.AppsNoticeMain"
                          :modelId="props.data.fId" :disabled="
                            !props.data.isManager ||
                            props.data.fAuditStatus != '1' ||
                            finishDocumentation
                          "></sitc-attachment>
                      </td>
                    </tr>
                  </tbody>
                </n-table>
              </n-grid-item>
            </n-grid>
          </div>
        </div>
      </n-grid-item>
    </n-grid>
  </div>
  <n-modal style="width: 60%" v-model:show="meetingShow" preset="dialog" title="会议添加" :mask-closable="false">
    <meetingadd @onClose="closeModal(meetingShow)" @onSuccess="successModal" :data="props.data" />
  </n-modal>

  <n-modal style="width: 85%" v-model:show="resultShow" preset="dialog" title="入围结果" :mask-closable="false">
    <finalizationAdd @closeResultAdd="closeResultAdd" />
  </n-modal>
</template>

<script setup>
  import noticeList from './notice/notice_list.vue'
  import meetingList from './meeting/meeting_list.vue'
  import finalizationList from './finalization-results/finalization_results_list.vue'
  import noticeadd from './notice/notice_add.vue'
  import meetingadd from './meeting/meeting_add.vue'
  import finalizationAdd from './finalization-results/finalization_results_add.vue'
  import sitcAttachment from '@/apps/common/attachment/SITCAttachment.vue'
  import {
    useMessage
  } from 'naive-ui'
  import createApi from './api'
  import baseUrl from '@/utils/baseUrl'
  import storage from '@/utils/storage'
  import singleLoginApi from '@/utils/singleLogin'
  import {
    getCurrentInstance,
    inject
  } from 'vue'
  import {
    useMenuStore
  } from '@/store/menu.js'

  const currentInstance = getCurrentInstance()
  const api = createApi(currentInstance)
  const singleLogin = singleLoginApi(currentInstance)
  const finishDocumentation = inject('finishDocumentation')
  const menuStore = useMenuStore()
  const message = useMessage()
  // const route = useRoute();
  let id = menuStore.currentRouteObj.urlParams.fId //项目id
  const finalizationListRef = ref(null)
  const {
    proxy
  } = getCurrentInstance()

  const props = defineProps({
    data: Object,
  })

  //是否有资格预审会议
  const hasVal = ref(false)
  const hasMeeting = reactive([{
      label: '有',
      value: true,
    },
    {
      label: '无',
      value: false,
    },
  ])

  //入围modal
  const resultShow = ref(false)
  const resultAdd = () => {
    resultShow.value = true
  }

  //会议modal
  const meetingShow = ref(false)
  const handleSelect = () => {
    meetingShow.value = true
  }

  const meetingData = reactive([])
  provide('meetingData', meetingData)
  //会议list初始化方法
  const init = async () => {
    if (id === undefined) {
      return
    }
    meetingData.length = 0
    await api
      .meetingMeetingList({
        fId: id,
      })
      .then((result) => {
        const data = result.data
        if (data.length != 0) {
          hasVal.value = true
          for (var i = 0; i < data.length; i++) {
            const obj = {}
            obj.id = data[i].id
            obj.projId = data[i].projId
            obj.meetingEndTime = data[i].meetingEndTime
            obj.meetingRoom = data[i].meetingRoom
            obj.meetingStartTime = data[i].meetingStartTime
            obj.packageName = data[i].packageName
            obj.remarks = data[i].remarks
            obj.type = data[i].type
            obj.experts = data[i].fOwnerExpert
            obj.exExperts = data[i].fOutsideExpert
            obj.fFrom = data[i].fFrom
            obj.fInId = data[i].fInId
            obj.fEdited = data[i].fEdited
            meetingData.push(obj)
          }
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  /** 获取公司信息 */
  const noticeData = reactive([])
  let bidCompanyInfoList = []
  let noticePackageList = []
  //公告list初始化方法
  const noticeInit = async () => {
    if (id === undefined) {
      return
    }
    noticeData.length = 0
    await api
      .noticeMainNoticeList({
        fId: id,
      })
      .then(async (result) => {
        const data = result.data
        for (let i = 0; i < data.length; i++) {
          const obj = {}
          obj.title = data[i].title
          obj.packageNames = data[i].packageNames
          obj.noticeId = data[i].noticeId
          obj.noticeName = data[i].noticeName
          obj.noticeurl = data[i].noticeurl
          obj.noticeReleaseDate = data[i].noticeReleaseDate
          obj.bidTerm = data[i].bidTerm
          obj.appDocDeadline = data[i].appDocDeadline
          obj.ekpId = data[i].ekpId
          //标书单位数据
          // bidCompanyInfoList.length = 0
          const query = [{
            eq: {
              'fMain.fId': data[i].noticeId,
            },
          }, ]
          // const res = await axios.post("/pm/apps/notice/company/bid/list", {
          //   query: query
          // });
          // bidCompanyInfoList.push(...res.data.list);
          const list = await getBidCompanyInfoList(query)
          obj.bidCompanyInfoList = list
          //获取公告包件信息
          // noticePackageList.length = 0
          // const packageRes = await axios.post("/pm/apps/notice/package/list", {
          //   query: query
          // });
          // for (let i = 0; i < packageRes.data.list.length; i++) {
          //   noticePackageList.push(packageRes.data.list[i].fPackage.fName);
          // }
          const processedList = processBidCompanyInfoList(obj.bidCompanyInfoList)
          obj.processedNoticePackageList = processedList
          //申请文件
          const applyFilesList = await getApplyFiles(obj.noticeId)
          obj.applyFiles = applyFilesList
          noticeData.push(obj)
        }
      })
      .catch((err) => {
        console.log(err)
      })
  }
  // 数据处理函数
  function processBidCompanyInfoList(bidCompanyInfoList) {
    // 创建一个空对象来存储包件和对应的公司
    const packages = {}
    // 遍历原始数据
    bidCompanyInfoList.forEach((company) => {
      // 分割包件名称为数组
      const packageNames = company.fPackageName
        .split(';')
        .map((name) => name.trim())
      // 遍历包件名称
      packageNames.forEach((packageName) => {
        // 如果包件不存在，则创建一个新的条目
        if (!packages[packageName]) {
          packages[packageName] = {
            packageName: packageName,
            companies: [],
          }
        }
        // 添加公司到对应的包件
        packages[packageName].companies.push(company)
      })
      const packageCodes = company.fPackageCode
        .split(';')
      for (var i = 0; i < packageCodes.length; i++) {
        packages[packageNames[i]].packageCode = packageCodes[i]
      }
    })
    // 将对象转换为数组
    return Object.values(packages)
  }

  const getBidCompanyInfoList = async (query) => {
    const bidCompanyInfoList = []
    const res = await api.noticeCompanyBidList({
      query: query,
    })
    bidCompanyInfoList.push(...res.data.list)
    return bidCompanyInfoList
  }

  //会议保存
  const successModal = async (v) => {
    meetingShow.value = false
    init()
  }
  //会议取消
  const closeModal = (v) => {
    meetingShow.value = false
  }
  //初始化调用
  onMounted(() => {
    noticeInit()
    init()
    checkPreNotice()
    getPreAuditIsoId(id)
  })

  function reservationOaCar() {
    var url = baseUrl.oaJumpUrl + '/j/sitc/adm/car_order/new.jsp'
    singleLogin.oaJump(url)
  }

  function reservationOaMeeting() {
    var url = baseUrl.oaJumpUrl + '/j/sitc/adm/mroom/mroom_list.jsp'
    singleLogin.oaJump(url)
  }

  function openOaCar() {
    var url = baseUrl.oaJumpUrl + '/j/sitc/adm/car_order/list.jsp'
    singleLogin.oaJump(url)
  }

  function openOaMeetingRoom() {
    var url = baseUrl.oaJumpUrl + '/j/sitc/adm/mroom/mroom_list_p.jsp'
    singleLogin.oaJump(url)
  }

  function ekpJumpNews() {
    var url =
      baseUrl.ekpUrl +
      '/sys/news/sys_news_main/sysNewsMain.do?method=add&fdTemplateId=13f89f0aecc9570a269328c4ea8b510d&.fdTemplate=13f89f0aecc9570a269328c4ea8b510d&i.docTemplate=13f89f0aecc9570a269328c4ea8b510d&ptype=1&businessId=' +
      props.data.fProjectNo
    singleLogin.ekpJump(url)
  }

  function ekpJumpResultNews() {
    var url =
      baseUrl.ekpUrl +
      '/sys/news/sys_news_main/sysNewsMain.do?method=add&fdTemplateId=16f434f75f02ce38c7ed58a413a82778&.fdTemplate=16f434f75f02ce38c7ed58a413a82778&i.docTemplate=16f434f75f02ce38c7ed58a413a82778&businessId=' +
      props.data.fProjectNo + '&ptype=2'
    singleLogin.ekpJump(url)
  }


  function closeResultAdd() {
    resultShow.value = false
    proxy.$refs.finalizationListRef.List.allProjectPackage(
      menuStore.currentRouteObj.urlParams.fId,
    )
    proxy.$refs.finalizationListRef.List.allCompanyPackage(
      menuStore.currentRouteObj.urlParams.fId,
    )
    proxy.$refs.finalizationListRef.List.companyBid(
      menuStore.currentRouteObj.urlParams.fId,
    )
  }

  //获取申请文件
  async function getApplyFiles(noticeId) {
    //通过noticeId查询apps_supplier_main表记录，再查attachment_main表：modelName=com.qkinfotech.core.tendering.model.apps.supplier.AppsSupplierMain; key=supplierMain
    var result = []
    var supplierMains = await api.supplierMainList({
      query: [{
        and: [{
            eq: {
              'fNotice.fId': noticeId,
            },
          },
          {
            eq: {
              fCurrentStatus: 2,
            },
          },
        ],
      }, ],
    })
    if (supplierMains.status == 200) {
      if (supplierMains.data.list.length > 0) {
        var modelIds = []
        for (var i = 0; i < supplierMains.data.list.length; i++) {
          modelIds.push(supplierMains.data.list[i].fId)
        }
        var applyFiles = await api.attachmentMainList({
          query: {
            and: [{
                eq: {
                  fModelName: 'com.qkinfotech.core.tendering.model.apps.supplier.AppsSupplierMain',
                },
              },
              {
                eq: {
                  fKey: 'supplierMain',
                },
              },
              {
                in: {
                  fModelId: modelIds,
                },
              },
            ],
          },
        })
        if (applyFiles.status == 200) {
          result = applyFiles.data.list
        }
      }
      //附件是由哪个公司上传的对应关系
      result.forEach(v => {
        const a = supplierMains.data.list.filter(s => v.fModelId === s.fId)
        if (a.length != 0) {
          v.fCompanyName = a[0].fSupplier.fName
        }
      })
    }
    return result
  }

  const requiredFlag = ref(false)
  const checkPreNotice = async () => {
    //查询是否存在资格预审公告
    const onlyPreNoticeList = await api.noticeMainList({
      query: {
        and: [{
            eq: {
              'fProjectId.fId': id,
            },
          },
          {
            eq: {
              fIsPrequalification: 'true',
            },
          },
        ],
      },
    })
    if (onlyPreNoticeList.data.list.length > 0) {
      requiredFlag.value = true
    }
  }

  const preAuditIsoId = ref("")

  function getPreAuditIsoId(id) {
    var query = {
      query: {
        and: [{
            "eq": {
              "fProjectId": id
            }
          },
          {
            "eq": {
              "fStatus": "30"
            }
          },
          {
            "eq": {
              "fAchievementName": "资格预审文件"
            }
          }
        ]
      },
      sort: ["fFinishTime desc"]
    }
    api.isoApprovalList(query).then(function(res) {
      if (res.data.list.length > 0) {
        preAuditIsoId.value = res.data.list[0].fId
      }
    })
  }

  async function openIsoApproval() {
    if (await hasProcessingApproval()) {
      message.warning("已有在流转的审批单，无法发起ISO审批！")
    } else {
      window.open(
        baseUrl.pmUrl +
        '/view/projectManagement/implementation/project-iso-edit?projectId=' + id +
        '&name=资格预审文件', '_blank'
      )
    }
  }

  //校验是否可发起iso审批
  async function hasProcessingApproval() {
    //校验规则：当前项目当前类型的所有流程，没有处于正在流转状态，即可针对这版本发起重新审批
    var hasProcessing = false
    var query = {
      query: {
        and: [{
            "eq": {
              "fAchievementName": "资格预审文件"
            }
          },
          {
            "not": {
              "in": {
                "fStatus": ["00", "30"]
              }
            }
          },
          {
            "eq": {
              "fProjectId": id
            }
          }
        ]
      }
    }
    await api.isoApprovalList(query).then(function(res) {
      hasProcessing = (res.data.list.length != 0)
    })
    return hasProcessing
  }
</script>

<style></style>
