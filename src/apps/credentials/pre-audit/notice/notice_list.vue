<template>
  <div v-for="item in data" style="margin-bottom: 20px" :bordered="false" v-show="showNotice(item)">
    <n-table :single-line="false">
      <colgroup>
        <col width="20%" />
        <col width="30%" />
        <col width="20%" />
        <col />
      </colgroup>
      <tbody>
        <tr>
          <td class="tdcenter">公告标题</td>
          <td class="tdleft" colspan="3">
            {{ item.title }}
          </td>
        </tr>
        <tr>
          <td class="tdcenter">包件信息</td>
          <td class="tdleft">
            {{ item.packageNames }}
          </td>
          <td class="tdcenter">
            资格预审公告
            <!-- <br>
              <n-button type="tertiary" :round="true" size="tiny" @click="editNotice(item.ekpId)"
                v-if="props.isManaget">
                <template #icon>
                  <n-icon>
                    <Pencil></Pencil>
                  </n-icon>
                </template>
                修改
              </n-button> -->
          </td>
          <td class="tdleft">
            <n-button text tag="a" @click="ekpJumpNews(item.noticeurl)" type="primary">
              {{ item.noticeName }}
            </n-button>
          </td>
        </tr>
        <tr>
          <td style="width: 20%" class="tdcenter">公告发布日期</td>
          <td class="tdleft">
            {{ item.noticeReleaseDate }}
          </td>
          <td style="width: 20%" class="tdcenter">标书获取日期</td>
          <td class="tdleft">
            {{ item.bidTerm }}
          </td>
        </tr>
        <tr>
          <td style="width: 20%" class="tdcenter">
            获取标书单位<br />
            <n-button type="tertiary" :round="true" size="tiny" @click="exportCompany(item)">
              <template #icon>
                <n-icon>
                  <download></download>
                </n-icon>
              </template>
              获取单位列表
            </n-button>
            <br />
            <n-button type="tertiary" :round="true" size="tiny" @click="exportPackage(item)">
              <template #icon>
                <n-icon>
                  <download></download>
                </n-icon>
              </template>
              包件购买列表
            </n-button>
            <!-- <br />
            <n-button
              type="tertiary"
              :round="true"
              size="tiny"
              @click="exportOriginalFile(item)"
            >
              <template #icon>
                <n-icon>
                  <download></download>
                </n-icon>
              </template>
              领购文件查询
            </n-button> -->
          </td>
          <td class="tdleft" colspan="3">
            <n-list :show-divider="false">

              <n-list-item>
                <n-thing title="">
                  <n-grid x-gap="14" :cols="7">
                    <n-gi>
                      <div style="text-align: center">
                        公司名称
                      </div>
                    </n-gi>
                    <n-gi>
                      <div style="text-align: center">
                        联系人
                      </div>
                    </n-gi>
                    <n-gi>
                      <div style="text-align: center">
                        手机
                      </div>
                    </n-gi>
                    <n-gi>
                      <div style="text-align: center">
                        状态
                      </div>
                    </n-gi>
                    <n-gi>
                      <div style="text-align: center">
                        所属包件
                      </div>
                    </n-gi>
                    <n-gi>
                      <div style="text-align: center">
                        领购时间
                      </div>
                    </n-gi>
                  </n-grid>
                </n-thing>
              </n-list-item>

              <n-list-item v-for="(company, index) in item.bidCompanyInfoList" :key="index"
                v-show="showBidCompany(company)">
                <n-thing title="">
                  <n-grid x-gap="14" :cols="7">
                    <n-gi>
                      <div style="text-align: center">
                        <!-- <n-button text @click="openAttachmentView(company)"> -->
                        {{ company.fApplyName }}
                        <!-- </n-button> -->
                      </div>
                    </n-gi>
                    <n-gi>
                      <div style="text-align: center">
                        {{ company.fContacts }}
                      </div>
                    </n-gi>
                    <n-gi>
                      <div style="text-align: center">
                        {{ company.fPhone }}
                      </div>
                    </n-gi>
                    <n-gi>
                      <div style="text-align: center">
                        {{ getStatusText(company.fBusinessStatus) }}
                      </div>
                    </n-gi>
                    <n-gi>
                      <div style="text-align: center">
                        <span v-for="baojian in baojians">
                          <span v-if="
                              company.fPackageCode.indexOf(baojian.value) >= 0
                            ">
                            {{ baojian.label }}；
                          </span>
                        </span>
                      </div>
                    </n-gi>
                    <n-gi>
                      <div style="text-align: center">
                        {{ company.fCreateTime }}
                      </div>
                    </n-gi>
                    <n-gi>
                      <div style="text-align: center">
                        <n-button text type="primary" @click="getCompanyList(company)">登记信息</n-button><br />
                      </div>
                    </n-gi>
                  </n-grid>
                </n-thing>
              </n-list-item>
            </n-list>
          </td>
        </tr>
        <tr colspan="3">
          <td style="width: 20%" class="tdcenter">
            申请文件<br />
            <n-button type="tertiary" :round="true" size="tiny" @click="changeFileShow(item)">
              <template #icon>
                <n-icon>
                  <download></download>
                </n-icon>
              </template>
              申请文件列表
            </n-button>
            <!--            <br />
            <n-button
              type="tertiary"
              :round="true"
              size="tiny"
              @click="changeSelectShow"
            >
              <template #icon>
                <n-icon>
                  <search></search>
                </n-icon>
              </template>
              文件搜索
            </n-button> -->
          </td>
          <td class="tdleft">
            <n-list>
              <n-list-item v-for="file in item.applyFiles" v-show="showFile(file)">
                <n-thing title="" content-style="margin-top: 10px">
                  <n-button text tag="a" target="_blank"
                    @click="viewPDF(file.fFile.fId)">{{file.fCompanyName}} | {{ file.fFileName }}</n-button>
                </n-thing>
              </n-list-item>
            </n-list>
          </td>
        </tr>
        <tr>
          <td style="width: 20%" class="tdcenter">申请文件截至日期</td>
          <td class="tdleft" colspan="3">
            {{ item.appDocDeadline }}
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>

  <n-modal style="width: 85%; height: 600px" v-model:show="fileShow" preset="dialog" title="申请文件列表"
    :mask-closable="false">
    <n-space justify="end">
      <n-button @click="downloadApplys">下载申请文件</n-button>
      <n-button @click="doExportApplys">导出文件列表</n-button>
    </n-space>
    <n-checkbox-group v-model:value="fileCities" @update:value="handleUpdateValue" style="width: 88%">
      <n-space item-style="display: flex;">
        <n-checkbox value="subFlag" label="是否包含未递交" />
        <n-checkbox value="companyName" label="领购单位名称" />
        <n-checkbox value="mainCompany" label="主体单位名称" />
        <n-checkbox value="jointCompany" label="联合体公司" />
        <n-checkbox value="name" label="联系人" />
        <n-checkbox value="phone" label="手机" />
        <n-checkbox value="email" label="邮箱" />
        <n-checkbox value="packages" label="包件" />
        <n-checkbox value="fCreateTime" label="领购时间" />
        <n-checkbox value="fileSize" label="文件大小" />
        <n-checkbox value="ip" label="提交IP" />
        <n-checkbox value="subTime" label="递交时间" />
      </n-space>
    </n-checkbox-group>
    <div style="
        height: 430px;
        overflow-y: auto;
        display: block;
        border-top: 1px solid rgba(239, 239, 245, 1);
        border-bottom: 1px solid rgba(239, 239, 245, 1);
      ">
      <n-table :single-line="false">
        <thead>
          <tr>
            <th v-if="fileCities.filter((item) => item !== 'subFlag').length > 0">
              序号
            </th>
            <th v-if="fileCities.includes('packages')">包件</th>
            <th v-if="fileCities.includes('companyName')">领购单位名称</th>
            <th v-if="fileCities.includes('mainCompany')">主体单位名称</th>
            <th v-if="fileCities.includes('jointCompany')">联合体公司</th>
            <th v-if="fileCities.includes('name')">联系人</th>
            <th v-if="fileCities.includes('phone')">手机</th>
            <th v-if="fileCities.includes('email')">邮箱</th>
            <th v-if="fileCities.includes('fCreateTime')">领购时间</th>
            <th v-if="fileCities.includes('fileSize')">文件大小</th>
            <th v-if="fileCities.includes('ip')">提交IP</th>
            <th v-if="fileCities.includes('subTime')">递交时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in data1" :key="index">
            <template v-if="fileCitiesFlag || (!fileCitiesFlag && item.subTime !== '')">
              <td v-if="
                  fileCities.filter((item) => item !== 'subFlag').length > 0
                ">
                {{ index + 1 }}
              </td>
              <td v-if="fileCities.includes('packages')">
                <span v-for="baojian in baojians">
                  <span v-if="item.packageCodes.indexOf(baojian.value) >= 0">{{ baojian.label }}；</span>
                </span>
              </td>
              <td v-if="fileCities.includes('companyName')">
                {{ item.companyName }}
              </td>
              <td v-if="fileCities.includes('mainCompany')">
                {{ item.mainCompany }}
              </td>
              <td v-if="fileCities.includes('jointCompany')">
                {{ item.jointCompany }}
              </td>
              <td v-if="fileCities.includes('name')">
                {{ item.name }}
              </td>
              <td v-if="fileCities.includes('phone')">
                {{ item.phone }}
              </td>
              <td v-if="fileCities.includes('email')">
                {{ item.email }}
              </td>
              <td v-if="fileCities.includes('fCreateTime')">
                {{ item.fCreateTime }}
              </td>
              <td v-if="fileCities.includes('fileSize')">
                {{ item.fileSize }}
              </td>
              <td v-if="fileCities.includes('ip')">
                {{ item.ip }}
              </td>
              <td v-if="fileCities.includes('subTime')">
                {{ item.subTime }}
              </td>
            </template>
          </tr>
        </tbody>
      </n-table>
    </div>
  </n-modal>

  <n-modal style="width: 60%" v-model:show="exportShow" preset="dialog" title="导出字段" :mask-closable="false">
    <n-space justify="end">
      <n-button @click="doDownloadPackage">下载领购资料</n-button>
      <n-button @click="doExportCompany">导出领购列表</n-button>
    </n-space>
    <!-- <commonExport module="apps/notice/company/bid"></commonExport> -->
    <n-checkbox-group v-model:value="cities">
      <n-space item-style="display: flex;">
        <n-checkbox value="companyName" label="单位名称" />
        <n-checkbox value="name" label="联系人" />
        <n-checkbox value="phone" label="手机号" />
        <n-checkbox value="email" label="邮箱" />
        <n-checkbox value="pack" label="包件" />
        <n-checkbox value="time" label="领购时间" />
      </n-space>
    </n-checkbox-group>
    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th v-if="cities.length > 0">序号</th>
          <th v-if="cities.includes('companyName')">单位名称</th>
          <th v-if="cities.includes('name')">联系人</th>
          <th v-if="cities.includes('phone')">手机</th>
          <th v-if="cities.includes('email')">邮箱</th>
          <th v-if="cities.includes('pack')">包件</th>
          <th v-if="cities.includes('time')">领购时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in bidCompanyInfoList" :key="index">
          <td v-if="cities.length > 0">{{ index + 1 }}</td>
          <td v-if="cities.includes('companyName')">{{ item.fApplyName }}</td>
          <td v-if="cities.includes('name')">{{ item.fContacts }}</td>
          <td v-if="cities.includes('phone')">{{ item.fPhone }}</td>
          <td v-if="cities.includes('email')">{{ item.fEmail }}</td>
          <td v-if="cities.includes('pack')">
            <span v-for="baojian in baojians">
              <span v-if="item.fPackageCode.indexOf(baojian.value) >= 0">{{ baojian.label }}；</span>
            </span>
          </td>
          <td v-if="cities.includes('time')">{{ item.fCreateTime }}</td>
        </tr>
      </tbody>
    </n-table>
    <n-table :bordered="false" :single-line="false">
      <tbody>
        <tr>
          <td>
            <n-input v-model:value="emailStr" type="textarea" :allowInput="(value) => false"></n-input>
          </td>
        </tr>
      </tbody>
    </n-table>
  </n-modal>

  <n-modal style="width: 60%" v-model:show="packageShow" preset="dialog" title="导出字段" :mask-closable="false">
    <n-space justify="end">
      <n-button @click="doDownloadPackage">下载领购资料</n-button>
      <n-button @click="doExportPackage">导出领购列表</n-button>
    </n-space>
    <n-checkbox-group v-model:value="buyPackageListCheckbox">
      <n-space item-style="display: flex;">
        <n-checkbox value="packageName" label="包件名称" />
        <n-checkbox value="companyName" label="单位名称" />
        <n-checkbox value="name" label="联系人" />
        <n-checkbox value="phone" label="手机" />
        <n-checkbox value="email" label="邮箱" />
        <n-checkbox value="time" label="领购时间" />
      </n-space>
    </n-checkbox-group>
    <n-table :bordered="false" :single-line="false">
      <thead>
        <tr>
          <th v-if="buyPackageListCheckbox.includes('packageName')">
            包件名称
          </th>
          <th v-if="buyPackageListCheckbox.includes('companyName')">
            单位名称
          </th>
          <th v-if="buyPackageListCheckbox.includes('name')">联系人</th>
          <th v-if="buyPackageListCheckbox.includes('phone')">手机</th>
          <th v-if="buyPackageListCheckbox.includes('email')">邮箱</th>
          <th v-if="buyPackageListCheckbox.includes('time')">领购时间</th>
        </tr>
      </thead>
      <tbody>
        <!-- 遍历外层数组 -->
        <template v-for="(packageGroup, groupIndex) in processedNoticePackageList">
          <!-- 计算 rowspan 的值 -->
          <tr v-for="(company, companyIndex) in packageGroup.companies" :key="company.fId">
            <td v-if="
                companyIndex === 0 &&
                buyPackageListCheckbox.includes('packageName')
              " :rowspan="packageGroup.companies.length">
              <span v-for="baojian in baojians">
                <span v-if="baojian.value == packageGroup.packageCode">
                  {{ baojian.label }}
                </span>
              </span>
            </td>
            <td v-if="buyPackageListCheckbox.includes('companyName')">
              {{ company.fApplyName }}
            </td>
            <td v-if="buyPackageListCheckbox.includes('name')">
              {{ company.fContacts }}
            </td>
            <td v-if="buyPackageListCheckbox.includes('phone')">
              {{ company.fPhone }}
            </td>
            <td v-if="buyPackageListCheckbox.includes('email')">
              {{ company.fEmail }}
            </td>
            <td v-if="buyPackageListCheckbox.includes('time')">
              {{ company.fCreateTime }}
            </td>
          </tr>
        </template>
      </tbody>
    </n-table>
  </n-modal>

  <n-modal style="width: 60%" v-model:show="originalFileShow" preset="dialog" title="单位文件" :mask-closable="false">
    <div style="display: flex; align-items: center; margin-bottom: 20px">
      <div style="flex: 1">
        <span>单位名称：</span>
        <n-input v-model:value="searchText" placeholder="请输入单位名称" @input="getOriginCompanyList(item.noticeId)"
          style="width: 420px" />
      </div>
      <n-button type="info" @click="downloadCompanyFileData" style="margin-left: 500px">下载</n-button>
    </div>
    <n-data-table :columns="fileColumns" :data="originCompanyList" :pagination="pagination" :row-key="(row) => row"
      :checked-row-keys="checkedRowKeys" @update:checked-row-keys="handleCheck" />
  </n-modal>

  <n-modal style="width: 80%" v-model:show="selectShow" preset="dialog" title="文件搜索" :mask-closable="false">
    <fileserch />
  </n-modal>

  <n-modal style="width: 90%" v-model:show="attachmentView" preset="dialog" title="文件预览">
    <attachmentViewer :id="attachmentId" :link="attachmentLink" :type="attachmentType"></attachmentViewer>
  </n-modal>
</template>

<script setup>
  import {
    DownloadOutline as download
  } from '@vicons/ionicons5'
  import {
    useRouter
  } from 'vue-router'
  import {
    SearchOutline as search
  } from '@vicons/ionicons5'
  import {
    Pencil
  } from '@vicons/ionicons5'
  import {
    onMounted,
    reactive,
    ref,
    inject
  } from 'vue'
  import fileserch from '@/apps/credentials/pre-audit/filesSerch.vue'
  import createApi from './api'
  import {
    useMenuStore
  } from '@/store/menu.js'
  import commonImport from '@/apps/common/transport/import.vue'
  import commonExport from '@/apps/common/transport/export.vue'
  import baseUrl from '@/utils/baseUrl'
  import * as XLSX from 'xlsx'
  import {
    useMessage,
    useDialog
  } from 'naive-ui'
  import attachmentViewer from '@/apps/common/attachment/attachmentViewer.vue'
  import singleLoginApi from '@/utils/singleLogin'
  import context from '@/context.js'

  const currentInstance = getCurrentInstance()
  const api = createApi(currentInstance)
  const singleLogin = singleLoginApi(currentInstance)
  const menuStore = useMenuStore()
  const message = useMessage()
  const dialog = useDialog()
  const attachmentView = ref(false) //预览窗口
  const attachmentLink = ref('') //链接（实际无用）
  const attachmentType = ref('') //预览文件id
  const attachmentId = ref('') //预览文件格式
  const disabled = ref(true)
  const props = defineProps({
    data: Array,
    isManaget: Boolean,
  })
  const data = props.data
  const baojians = inject('baojians', [])

  const editNotice = (ekpid) => {
    singleLogin.ekpJump(
      baseUrl.ekpUrl +
      '/sys/news/sys_news_main/sysNewsMain.do?method=edit&fdId=' +
      ekpid,
    )
  }

  function ekpJumpNews(url) {
    singleLogin.ekpJump(url)
  }

  const cities = ref(['companyName', 'time', 'email', 'phone', 'pack', 'name'])

  // 根据 cities 的值来决定哪些列应该显示
  const showColumns = computed(() => {
    return {
      companyName: cities.includes('companyName'),
      name: cities.includes('name'),
      phone: cities.includes('phone'),
      email: cities.includes('email'),
      pack: cities.includes('pack'),
      time: cities.includes('time'),
    }
  })

  const show = ref(false)

  const router = useRouter()
  const getCompanyList = (v) => {
    window.open(
      context.path + `/view/companyView?fCompanyId=${v.fApplyId}&fProjectId=${projectId}`,
    )
  }

  const exportShow = ref(false)

  /**包件导出控制弹窗 */
  const packageShow = ref(false)
  const emailStr = ref('')
  const exportCompany = (item) => {
    openNoticeId.value = item.noticeId
    exportShow.value = true
    bidCompanyInfoList.length = 0
    emailStr.value = ''
    for (var i = 0; i < item.bidCompanyInfoList.length; i++) {
      bidCompanyInfoList.push(item.bidCompanyInfoList[i])
      emailStr.value += item.bidCompanyInfoList[i].fEmail + ';'
    }
  }

  /**原始文件导出控制弹窗 */
  const originalFileShow = ref(false)
  const exportOriginalFile = async (item) => {
    openNoticeId.value = item.noticeId
    await getOriginCompanyList(item.noticeId)
    originalFileShow.value = true
  }

  const openNoticeId = ref('')
  const exportPackage = (item) => {
    packageShow.value = true
    processedNoticePackageList.length = 0
    openNoticeId.value = item.noticeId
    for (var i = 0; i < item.processedNoticePackageList.length; i++) {
      processedNoticePackageList.push(item.processedNoticePackageList[i])
    }
  }

  //申请文件列表
  const data1 = ref([])
  const fileCities = ref([
    'subFlag',
    'companyName',
    'mainCompany',
    'jointCompany',
    'name',
    'phone',
    'email',
    'packages',
    'fCreateTime',
    'fileSize',
    'ip',
    'subTime',
  ])
  const fileShow = ref(false)
  const changeFileShow = async (item) => {
    openNoticeId.value = item.noticeId
    fileShow.value = true
    const res = await api.noticeMainGetApplyFiles({
      fId: item.noticeId,
    })
    data1.value.length = 0
    for (var i = 0; i < res.data.length; i++) {
      data1.value.push(res.data[i])
    }
  }

  const selectShow = ref(false)
  const changeSelectShow = () => {
    // selectShow.value = true;
    window.open(context.path + `/view/filesSerch`)
  }

  const e = ref([{
    fId: '1',
    fName: '1',
  }, ])

  const columns = [{
      type: 'selection',
    },
    {
      title: '申请文件列表',
      key: 'fFileName',
    },
  ]

  const fileColumns = [{
      type: 'selection',
      width: 100, // 可以设置宽度
    },
    {
      title: '单位名称',
      key: 'fCompanyName',
      align: 'center',
    },
    /*{
      title: '操作',
      key: 'action',
      width: 100,
      render(row) {
        return [
          h(
            NButton,
            {
              onClick: () => {
                const linkAndType = row.fileLinkAndType.map((file) => ({
                  ...file,
                  type: extractExtension(file.type),
                }))
                if (linkAndType.length > 0) {
                  attachmentId.value = linkAndType[0].id
                  attachmentLink.value = linkAndType[0].link
                  attachmentType.value = linkAndType[0].type
                  attachmentView.value = true
                }
              },
            },
            '预览',
          ),
        ]
      },
    },*/
  ]

  //文件后缀
  function extractExtension(filename) {
    return filename.split('.').pop()
  }

  const checkedRowKeys = ref([])
  const handleCheck = (keys, rows) => {
    checkedRowKeys.value = keys
  }

  watch(checkedRowKeys, (newValue, oldValue) => {})

  const getStatusText = (status) => {
    switch (status) {
      case '00':
        return '受理中'
      case '01':
        return '驳回'
      case '02':
        return '已受理'
      case '03':
        return '无需审核'
      default:
        return '未知状态'
    }
  }

  /**初始文件查询 */
  const originCompanyList = reactive([])
  //过滤招标公司
  const filterBidCompany = reactive([])
  //单位名称搜索框内容
  const searchText = ref('')

  const getOriginCompanyList = async (noticeId) => {
    originCompanyList.length = 0
    const filterList = reactive([])

    if (searchText.value !== '') {
      var filterBidCompanyQuery = [{
        and: [{
            eq: {
              'fMain.fId': noticeId,
            },
          },
          {
            contains: {
              fApplyName: searchText.value,
            },
          },
        ],
      }, ]
      const res = await api.noticeCompanyBidList({
        query: filterBidCompanyQuery,
      })
      filterList.push(...res.data.list)
    } else {
      const res = await api.noticeCompanyBidList({
        query: [{
          eq: {
            'fMain.fId': noticeId,
          },
        }, ],
      })
      filterList.push(...res.data.list)
    }

    for (var i = 0; i < filterList.length; i++) {
      var qyery = [{
        and: [{
            eq: {
              fModelId: filterList[i].fId,
            },
          },
          {
            eq: {
              fModelName: 'com.qkinfotech.core.tendering.model.apps.notice.AppsNoticeCompanyBid',
            },
          },
          {
            eq: {
              fKey: 'companyFile',
            },
          },
        ],
      }, ]
      const res = await api.attachmentMainList({
        query: qyery,
      })
      if (res.data.list.length == 0) {
        continue
      }
      if (res.data.list.length > 0) {
        // 确保至少有一个元素
        if (!res.data.list[0].fileId) {
          res.data.list[0].fileId = []
        }
        if (!res.data.list[0].fileLinkAndType) {
          res.data.list[0].fileLinkAndType = []
        }
        // 初始化第一个元素的属性
        res.data.list[0].fCompanyName = filterList[i].fApplyName
        res.data.list[0].fileId.push(res.data.list[0].fFile.fId)
        res.data.list[0].fileLinkAndType.push({
          id: res.data.list[0].fFile.fId,
          link: res.data.list[0].fFileLink + '?fId=' + res.data.list[0].fFile.fId,
          type: res.data.list[0].fFileName,
        })

        // 如果列表中有多个元素，则合并数据
        if (res.data.list.length > 1) {
          for (var j = 1; j < res.data.list.length; j++) {
            res.data.list[0].fileId.push(res.data.list[j].fFile.fId)
            res.data.list[0].fileLinkAndType.push({
              link: res.data.list[j].fFileLink + '?fId=' + res.data.list[j].fFile.fId,
              type: res.data.list[j].fFileName,
            })
          }
        }
        // 将合并后的对象添加到数组中
        originCompanyList.push(res.data.list[0])
      }
    }
  }
  const route = useRoute()
  const projectId = menuStore.currentRouteObj.urlParams.fId

  /**downloadCompanyFileData 初始查询按钮 下载方法 */
  const downloadCompanyFileData = () => {
    console.log(openNoticeId)
    if (checkedRowKeys.value.length == 0) {
      dialog.warning({
        title: '提示',
        content: '未选择单位，是否全部下载？',
        positiveText: '是',
        negativeText: '否',
        onPositiveClick: () => {
          const fFileId = reactive([])
          for (var i = 0; i < originCompanyList.length; i++) {
            fFileId.push(...originCompanyList[i].fileId)
          }
          var url = baseUrl.pmUrl + '/pm/companyBid/doDownloadPackage?'
          url += 'noticeId=' + openNoticeId.value
          window.open(url, '_target')
        },
        onNegativeClick: () => {
          return
        },
      })
      return
    }
    var fFileId = []
    for (var i = 0; i < checkedRowKeys.value.length; i++) {
      fFileId.push(checkedRowKeys.value[i].fModelId)
    }

    var url = baseUrl.pmUrl + '/pm/companyBid/doDownloadPackage?'
    url += 'noticeId=' + openNoticeId.value
    url += '&bidIds=' + fFileId
    window.open(url, '_target')
  }

  const downloadApplys = () => {
    // const fFileId = reactive([])
    // for (var i = 0; i < data1.value.length; i++) {
    //   fFileId.push(data1.value[i].fileId)
    // }
    var url =
      baseUrl.pmUrl +
      '/pm/companyBid/doDownloadApplyFiles?noticeId=' +
      openNoticeId.value
    window.open(url, '_target')
  }

  // 在组件加载时初始化数据
  onMounted(() => {})

  const bidCompanyInfoList = reactive([])
  const processedNoticePackageList = reactive([])

  //全部单位导出excel
  function doExportCompany() {
    if (cities.value.length == 0) {
      message.error('请选择要导出的字段')
      return
    }
    var title = []
    if (cities.value.includes('companyName')) {
      title.push({
        value: 'fApplyName',
        label: '单位名称',
      })
    }
    if (cities.value.includes('name')) {
      title.push({
        value: 'fContacts',
        label: '联系人',
      })
    }
    if (cities.value.includes('phone')) {
      title.push({
        value: 'fPhone',
        label: '手机',
      })
    }
    if (cities.value.includes('email')) {
      title.push({
        value: 'fEmail',
        label: '邮箱',
      })
    }
    //2024-0923 导出的时候，优化一下包件名称的导出
    if (cities.value.includes('pack')) {
      title.push({
        value: 'fPackageNameWithIdx',
        label: '包件名称',
      })
      for (var i = 0; i < bidCompanyInfoList.length; i++) {
        var fPackageNameWithIdx = ''
        for (var j = 0; j < baojians.value.length; j++) {
          if (
            bidCompanyInfoList[i].fPackageCode.indexOf(baojians.value[j].value) >=
            0
          ) {
            fPackageNameWithIdx += baojians.value[j].label + '；'
          }
        }
        bidCompanyInfoList[i].fPackageNameWithIdx = fPackageNameWithIdx
      }
    }
    if (cities.value.includes('time')) {
      title.push({
        value: 'fCreateTime',
        label: '领购时间',
      })
    }
    doExport(title, bidCompanyInfoList, '标书单位')
  }

  //包件导出
  function doExportPackage() {
    var title = []
    if (buyPackageListCheckbox.value.includes('packageName')) {
      title.push({
        value: 'fPackageName',
        label: '包件名称',
      })
    }
    if (buyPackageListCheckbox.value.includes('companyName')) {
      title.push({
        value: 'fApplyName',
        label: '单位名称',
      })
    }
    if (buyPackageListCheckbox.value.includes('name')) {
      title.push({
        value: 'fContacts',
        label: '联系人',
      })
    }
    if (buyPackageListCheckbox.value.includes('phone')) {
      title.push({
        value: 'fPhone',
        label: '手机',
      })
    }
    if (buyPackageListCheckbox.value.includes('email')) {
      title.push({
        value: 'fEmail',
        label: '邮箱',
      })
    }
    if (buyPackageListCheckbox.value.includes('time')) {
      title.push({
        value: 'fCreateTime',
        label: '领购时间',
      })
    }
    var values = []
    for (var i = 0; i < processedNoticePackageList.length; i++) {
      var companies = processedNoticePackageList[i].companies
      for (var j = 0; j < companies.length; j++) {
        var line = {
          /*fPackageName: processedNoticePackageList[i].packageName,*/
          fApplyName: companies[j].fApplyName,
          fContacts: companies[j].fContacts,
          fPhone: companies[j].fPhone,
          fEmail: companies[j].fEmail,
          fCreateTime: companies[j].fCreateTime,
        }
        var packageName = ''
        for (var k = 0; k < baojians.value.length; k++) {
          if (
            baojians.value[k].label.indexOf(
              ':' + processedNoticePackageList[i].packageName,
            ) >= 0
          ) {
            packageName += baojians.value[k].label + '；'
          }
        }
        line.fPackageName = packageName
        values.push(line)
      }
    }
    doExport(title, values, '包件单位')
  }

  //申请文件导出
  function doExportApplys() {
    if (fileCities.value.filter((item) => item !== 'subFlag').length == 0) {
      message.error('请选择要导出的字段')
      return
    }
    var title = []
    if (fileCities.value.includes('companyName')) {
      title.push({
        value: 'companyName',
        label: '领购单位名称',
      })
    }
    if (fileCities.value.includes('mainCompany')) {
      title.push({
        value: 'mainCompany',
        label: '主体单位名称	',
      })
    }
    if (fileCities.value.includes('jointCompany')) {
      title.push({
        value: 'jointCompany',
        label: '联合体公司	',
      })
    }
    if (fileCities.value.includes('name')) {
      title.push({
        value: 'name',
        label: '联系人',
      })
    }
    if (fileCities.value.includes('phone')) {
      title.push({
        value: 'phone',
        label: '手机',
      })
    }
    if (fileCities.value.includes('email')) {
      title.push({
        value: 'email',
        label: '邮箱',
      })
    }
    if (fileCities.value.includes('packages')) {
      title.push({
        value: 'packageWithIdx',
        label: '包件名称',
      })
      for (var i = 0; i < data1.value.length; i++) {
        var packageName = ''
        for (var j = 0; j < baojians.value.length; j++) {
          if (data1.value[i].packageCodes.indexOf(baojians.value[j].value) >= 0) {
            packageName += baojians.value[j].label + '；'
          }
        }
        data1.value[i].packageWithIdx = packageName
      }
    }
    if (fileCities.value.includes('fCreateTime')) {
      title.push({
        value: 'fCreateTime',
        label: '领购时间',
      })
    }
    if (fileCities.value.includes('fileSize')) {
      title.push({
        value: 'fileSize',
        label: '文件大小',
      })
    }
    if (fileCities.value.includes('ip')) {
      title.push({
        value: 'ip',
        label: '提交IP',
      })
    }
    if (fileCities.value.includes('subTime')) {
      title.push({
        value: 'subTime',
        label: '递交时间',
      })
    }
    //是否包含未递交 - false 不含未递交
    if (!fileCitiesFlag.value) {
      const newData = computed(() =>
        data1.value.filter((item) => item.subTime !== ''),
      )
      doExport(title, newData.value, '申请文件列表')
    } else {
      doExport(title, data1.value, '申请文件列表')
    }
  }

  /**
   * 导出
   * @param {Object} title 标题行：[{value:"name", label:"名称"}]
   * @param {Object} values 数据行：[{name:"张三"},{name:"李四"}]
   * @param {Object} fileName 文件名
   */
  function doExport(title, values, fileName) {
    var data = []
    var titleLine = []
    titleLine.push('序号')
    for (var i = 0; i < title.length; i++) {
      titleLine.push(title[i].label)
    }
    data.push(titleLine)
    for (var i = 0; i < values.length; i++) {
      var line = []
      line.push(i + 1)
      for (var j = 0; j < title.length; j++) {
        line.push(values[i][title[j].value])
      }
      data.push(line)
    }
    try {
      const sheet = XLSX.utils.aoa_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, sheet, 'Sheet1')
      XLSX.writeFile(wb, fileName + '.xlsx')
    } catch (e) {
      message.error('导出失败，请重试！')
    }
  }

  //点击标书单位，预览附件
  function openAttachmentView(row) {
    var modelName =
      'com.qkinfotech.core.tendering.model.apps.notice.AppsNoticeCompanyBid'
    var modelId = row.fId
    var param = [{
        eq: {
          fModelName: modelName,
        },
      },
      {
        eq: {
          fModelId: modelId,
        },
      },
    ]
    var query = {
      and: param,
    }
    api
      .attachmentMainList({
        query: query,
      })
      .then(function(res) {
        if (res.status == 200) {
          attachmentId.value = res.data.list[0].fFile.fId
          attachmentType.value = res.data.list[0].fFileName.split('.').pop()
          attachmentView.value = true
        }
      })
  }

  //包件过滤筛选
  const selectedPackageId = inject('selectedPackageId')
  const selectedPackageName = inject('selectedPackageName')
  //公告过滤
  function showNotice(item) {
    if (selectedPackageName.value.length == 0) {
      return true
    }
    return (
      item.packageNames
      .split(';')
      .filter((value) => selectedPackageName.value.includes(value)).length > 0
    )
  }
  //标书单位过滤
  function showBidCompany(company) {
    if (selectedPackageId.value.length == 0) {
      return true
    }
    return selectedPackageId.value.some((id) =>
      company.fPackageCode.split(';').includes(id),
    )
  }

  function showFile(file) {
    if (selectedPackageId.value.length == 0) {
      return true
    }
    return (
      file.fPackages.filter((value) =>
        selectedPackageId.value.includes(value.fPackageId.fId),
      ).length > 0
    )
  }

  const viewPDF = (id) => {
    window.open(baseUrl.pmUrl + '/view/attachment-view?fId=' + id)
  }

  //是否包含未递交
  const fileCitiesFlag = ref(true)
  const handleUpdateValue = (value) => {
    fileCitiesFlag.value = fileCities.value.includes('subFlag')
  }

  //包件购买导出列表勾选项
  const buyPackageListCheckbox = ref([
    'packageName',
    'companyName',
    'name',
    'phone',
    'email',
    'time',
  ])

  //下载项目采购附件
  function doDownloadPackage() {
    window.open(
      baseUrl.pmUrl +
      '/pm/companyBid/doDownloadPackage?noticeId=' +
      openNoticeId.value,
      '_target',
    )
  }
</script>

<style>
  .fDiv {
    text-align: center;
  }
</style>
