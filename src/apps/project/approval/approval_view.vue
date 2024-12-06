<template>
  <n-layout v-if="isAdmin || userId == applicationModel.fCurrentProcessorId">
    <n-space vertical size="large">
      <n-layout-header>
      </n-layout-header>
      <n-layout-content>
        <n-card>
          <n-form ref="formRef" :model="applicationModel" label-placement="" label-width="150px" :rules="rules"
            :disabled="isEditForm">
            <n-grid :cols="2">
              <n-gi :span="2">
                <p style="font-size: 16px; font-weight: bold;">基本信息</p>
              </n-gi>
              <n-gi :span="2">
                <n-table :single-line="false">
                  <tbody>
                    <tr>
                      <th style="width: 20%; text-align: center;">编号</th>
                      <td style="width: 35%;" class="tdleft">
                        <div v-if="applicationModel.fProtocolNo != undefined && applicationModel.fProtocolNo != ''">
                          {{applicationModel.fProtocolNo}}
                        </div>
                        <div v-else>
                          项目审批通过后自动生成
                        </div>
                      </td>
                      <th style="width: 20%; text-align: center;">类别</th>
                      <td style="width: 35%;" class="tdleft">
                        <n-select v-model:value="applicationModel.projectCategory.fId" :options="categoryOptions" tag
                          :disabled="true" @update:value="categoryUpdateValue" />
                      </td>
                    </tr>
                    <tr>

                      <th style="width: 20%; text-align: center;">协议编号<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft" colspan="3">
                        <n-form-item path="fProtocolNumber" class="flex-center">
                          <n-input style="width: 60vw;" v-model:value="applicationModel.fProtocolNumber"
                            :disabled="true"></n-input>
                          <n-button @click="selectNumber" :disabled="isEditForm || applicationModel.fAuditStatus !== '0'">选择</n-button>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>

                      <th style="width: 20%; text-align: center;">项目名称<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft" colspan="3">
                        <n-form-item path="fName" class="flex-center">
                          <n-input v-model:value="applicationModel.fName" style="width: 60vw;" :disabled="applicationModel.fAuditStatus !== '0'"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>

                      <th style="width: 20%; text-align: center;">项目简称<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft" colspan="3">
                        <n-form-item path="fSimpleName" class="flex-center">
                          <n-input v-model:value="applicationModel.fSimpleName" style="width: 60vw;" :disabled="applicationModel.fAuditStatus !== '0'"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>

                      <th style="width: 20%; text-align: center;">英文名称<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft" colspan="3">
                        <n-form-item label="" path="fEngName" class="flex-center">
                          <n-input v-model:value="applicationModel.fEngName" style="width: 60vw;" :disabled="applicationModel.fAuditStatus !== '0'"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>

                      <th style="width: 20%; text-align: center;">业主<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft" colspan="3">
                        <n-form-item label="" class="flex-center">
                          <n-input v-model:value="applicationModel.fOwner" :disabled="true"
                            style="width: 60vw;"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>

                      <th style="width: 20%; text-align: center;">项目模式<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item label="" class="flex-center">
                          <n-radio-group v-model:value="applicationModel.projectMode">
                            <n-space>
                              <n-radio :value="applicationModel.fangAnProjectMode.fId" @change="handleModeChange"
                                disabled>
                                {{ applicationModel.fangAnProjectMode.fName }}
                              </n-radio>
                            </n-space>
                          </n-radio-group>
                        </n-form-item>
                      </td>

                      <th style="width: 20%; text-align: center;">登记日期<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item label="" class="flex-center">
                          <n-date-picker v-model:value="applicationModel.fCreateTime" :disabled="true"
                            type="date"></n-date-picker>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>

                      <th style="width: 20%; text-align: center;">部门<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item label="" path="fDept" class="flex-center">
                          <formAddress :fElement="applicationModel.fDept" :status="addressEdit" orgType="ORG_TYPE_DEPT"
                            :limitRange="shgjzbOrg">
                          </formAddress>
                        </n-form-item>
                      </td>
                      <th style="width: 20%; text-align: center;">项目经理<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item path="fName" class="flex-center">
                          <formAddress :fElement="applicationModel.fDeptManager" :status="addressEdit"
                            orgType="ORG_TYPE_PERSON" :limitRange="[applicationModel.fDept]"
                            @searchModal="afterChangeDeptManager()"></formAddress>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 20%; text-align: center;">项目组成员</th>
                      <td style="width: 35%;" class="tdleft" colspan="3">
                        <n-form-item label="" class="flex-center">
                          <formAddress :fElements="applicationModel.fProjectMembers" :status="addressEdit"
                            orgType="ORG_TYPE_PERSON" multi :limitRange="[applicationModel.fDept]"
                            :exCludes="[applicationModel.fDeptManager.fId]"></formAddress>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>

                      <th style="width: 20%; text-align: center;">项目性质<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item class="flex-center" path="fProjectNature">
                          <n-space vertical>
                            <n-checkbox-group v-model:value="applicationModel.selectedNature"
                              @update:value="handleUpdateNature" :disabled="applicationModel.fAuditStatus !== '0'">
                              <n-grid :cols="4" >
                                <n-gi v-for="(item, index) in applicationModel.fProjectNatures">
                                  <div v-show="showNature(item)">
                                    <n-tooltip trigger="hover">
                                      <template #trigger>
                                        <n-checkbox :value="item.fId" :label="item.fName" :key="index">
                                          {{ item.fName }}
                                        </n-checkbox>
                                      </template>
                                      {{ item.fNote }}
                                    </n-tooltip>
                                  </div>
                                </n-gi>
                              </n-grid>
                            </n-checkbox-group>
                            <n-input v-show="selectedNatureContainOther()"
                              v-model:value="applicationModel.fProjectNatureOther"></n-input>

                          </n-space>
                        </n-form-item>
                      </td>

                      <th style="width: 20%; text-align: center;">项目重要性<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item label="" class="flex-center">
                          <n-select v-model:value="applicationModel.projectImportance" :options="importanceOptions" tag
                            @update:value="handleUpdateValue" style="width: 20vw"  :disabled="applicationModel.fAuditStatus !== '0'"/>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>

                      <th style="width: 20%; text-align: center;">征集费预算<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item path="fProjectBudget" class="flex-center">
                          <n-input-group>
                            <n-input-number v-model:value="applicationModel.fProjectBudget" style="width: 20vw;"
                              :show-button="false" :disabled="applicationModel.fAuditStatus !== '0'"></n-input-number>
                            <n-input-group-label>人民币</n-input-group-label>
                          </n-input-group>
                        </n-form-item>
                      </td>
<!--                    </tr>
                    <tr>-->

<!--                      <th style="width: 20%; text-align: center;">资金来源<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item label="" class="flex-center" path="fCapitalSource">
                          <n-space vertical>
                            <n-radio-group v-model:value="applicationModel.capitalSource" name="radiogroup" :disabled="applicationModel.fAuditStatus !== '0'">
                              <n-space :vertical="false">
                                <n-radio v-for="option in applicationModel.fFundingSources" :key="option.fName"
                                  :value="option.fId" @change="handleChange(e, option)">
                                  {{ option.fName }}
                                </n-radio>
                              </n-space>
                            </n-radio-group>
                            <n-input v-show="selectedCapitalSourceOther()"
                              v-model:value="applicationModel.fCapitalSourceOther"></n-input>
                          </n-space>
                        </n-form-item>
                      </td>-->

                      <th style="width: 20%; text-align: center;">预期收入<span style="color: red;">*</span></th>
                      <td style="width: 55%;" class="tdleft">
                        <n-form-item label="" path="fPlanIncome" class="flex-center">
                          <n-input-group>
                            <!-- {{applicationModel.projectImportance}} -->
                            <n-input-number v-model:value="applicationModel.fPlanIncome" :show-button="false"
                              @update:value="changeImportance" style="width: 17vw" :disabled="applicationModel.fAuditStatus !== '0'"></n-input-number>
                            <n-input-group-label>元（人民币）</n-input-group-label>
                          </n-input-group>
                        </n-form-item>
                        <!-- <n-form-error v-if="$refs.formRef && $refs.formRef.errors[fPlanIncomePath]" /> -->
                      </td>
                    </tr>
                    <tr>

                      <th style="width: 20%; text-align: center;">开拓信息<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item label="" class="flex-center">
                          <n-input style="width: 20vw;" v-model:value="applicationModel.fDevelopInfo"
                            :disabled="true"></n-input>
                        </n-form-item>
                      </td>

                      <th style="width: 20%; text-align: center;">项目执行地<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item label="" class="flex-center">
                          <n-input-group>
                            <n-select v-model:value="applicationModel.fCountryVal" :options="countryList" label="名称"
                              @update:value="handleCountryValue" style="width: 10vw" :disabled="applicationModel.fAuditStatus !== '0'"></n-select>

                            <n-select v-model:value="applicationModel.fcityVal" :options="cityList"
                              :disabled="applicationModel.fCountryVal !== chinaId || isEditForm || applicationModel.fAuditStatus !== '0'"
                              @update:value="handleCityValue" style="width: 10vw"></n-select>
                          </n-input-group>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>

                      <th style="width: 20%; text-align: center;">涉密项目<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft" colspan="3">
                        <n-form-item label="" class="flex-center">
                          <n-radio-group v-model:value="applicationModel.fIsClassified" :disabled="applicationModel.fAuditStatus !== '0'">
                            <n-space>
                              <n-radio :value="true">是</n-radio>
                              <n-radio :value="false">否</n-radio>
                            </n-space>
                          </n-radio-group>
                        </n-form-item>
                      </td>
                    </tr>
                  </tbody>
                </n-table>
              </n-gi>
              <n-gi span=2>
                <p style="font-size: 16px; font-weight: bold; margin-top: 20px;">项目概况</p>
              </n-gi>
              <n-gi span=2>
                <n-table :single-line="false">
                  <tbody>
                    <tr>

                      <th style="width: 20%; text-align: center;">项目地点<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item class="flex-center">
                          <n-input v-model:value="applicationModel.fProjectPlace" style="width: 60vw;" :disabled="applicationModel.fAuditStatus !== '0'"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>

                      <th style="width: 20%; text-align: center;">项目类型<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item class="flex-center">
                          <n-space vertical>
                            <n-select :options="typeOptions" tag multiple v-model:value="applicationModel.selectedType"
                              @update:value="updateFProjectType" style="width: 60vw;" :disabled="applicationModel.fAuditStatus !== '0'"></n-select>
                            <n-input placeholder="请输入其他类型" v-show="showOtherTypeInput()" v-model:value="applicationModel.fTypeOther"></n-input>
                          </n-space>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr v-if="tagsOptions.length > 0">
                      <th style="width: 20%; text-align: center;">项目标签<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item class="flex-center">
                          <n-space vertical>
                            <n-select v-model:value="applicationModel.selectedTag" :options="tagsOptions" tag multiple
                              @update:value="handleTagValue" style="width: 60vw;" :disabled="applicationModel.fAuditStatus !== '0'"></n-select>
                            <n-input placeholder="请输入其他标签" v-show="showOtherTagInput()" v-model:value="applicationModel.fTagOther"></n-input>
                          </n-space>
                        </n-form-item>
                      </td>
                    </tr>

                    <tr v-if="applicationModel.fScales && applicationModel.fScales.length > 0">
                      <th style="width: 20%; text-align: center;">项目规模</th>
                      <td class="tdleft">
                        <n-grid v-for="groupName in allSelectValues.selectedGroup" cols="10">
                          <n-gi>{{groupName}}</n-gi>
                          <n-gi span="4">
                            <n-space vertical>
                              <div v-for="val in applicationModel.fScales">
                                <div v-if="groupName === val.fGroup">
                                  <n-input-group>
                                    <n-input-number v-model:value="val.fValue" :show-button="false"></n-input-number>
                                    <n-input-group-label>{{ val.fScale.fName }}</n-input-group-label>
                                  </n-input-group>
                                </div>
                              </div>
                            </n-space>
                          </n-gi>
                        </n-grid>
                      </td>
                    </tr>

<!--                    <tr v-for="(typeScaleGroup, index) in applicationModel.typeScales">
                      &lt;!&ndash; 显示项目类型 &ndash;&gt;

                      <th style="width: 20%; text-align: center;">
                        项目规模({{ typeScaleGroup[0].fMasterDataTypeId.fName }})<span style="color: red;">*</span>
                      </th>
                      <td class="tdleft">
                        <n-form-item>
                          &lt;!&ndash; 遍历该类型下的每一个scale &ndash;&gt;
                          <template v-for="scale in typeScaleGroup">
                            &lt;!&ndash; 添加输入框 &ndash;&gt;
                            <n-input-group>
                              <n-input-number v-model:value="scale.value" :show-button="false"
                                :key="scale.fId" :disabled="applicationModel.fAuditStatus !== '0'"></n-input-number>
                              &lt;!&ndash; 添加单位 &ndash;&gt;
                              <n-input-group-label>{{ scale.fMasterDataScaleId.fName }}</n-input-group-label>
                            </n-input-group>
                            &lt;!&ndash; 如果不是该类型下的最后一个scale，添加换行 &ndash;&gt;
                            <br v-if="scale !== typeScaleGroup[typeScaleGroup.length - 1]">
                          </template>
                        </n-form-item>
                      </td>
                    </tr>-->


                  </tbody>
                </n-table>
              </n-gi>
              <n-gi span=2>
                <p style="font-size: 16px; font-weight: bold; margin-top: 20px;">审批</p>
              </n-gi>
              <n-gi span=2>
                <processView :fProcessId="applicationModel.fReviewId" :afterRefuse="refuse"
                  :beforeSubmit="handleNotification" :beforeRefuse="refuseNotification" ref="process" />
              </n-gi>
            </n-grid>
          </n-form>
        </n-card>
      </n-layout-content>
    </n-space>
  </n-layout>

  <noRoleCard v-if=" !isAdmin && userId != applicationModel.fCurrentProcessorId && applicationModel.fCurrentProcessorId !== ''">
  </noRoleCard>

  <n-modal v-model:show="showModal" style="width:70%;height: 90%;" preset="dialog" title="协议选择">
    <n-form ref="" inline :label-width="80" :model="formValue">
      <n-form-item label="协议名称" path="name">
        <n-input v-model:value="formValue.name" placeholder="协议名称查询" />
      </n-form-item>
      <n-form-item label="协议编号" path="number">
        <n-input v-model:value="formValue.number" placeholder="协议编号查询" />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" @click="handleValidateClick">
          搜索
        </n-button>
      </n-form-item>
    </n-form>
    <n-data-table :columns="columns" :data="data" :bordered="false" />
    <br>
    <n-pagination v-model:page="pagination.page" show-size-picker :page-sizes="pagination.pageSizes"
      :item-count="pagination.itemCount" @update:page="onChangePage" @update:page-size="onUpdatePageSize" />
  </n-modal>

</template>


<script setup>
  import {
    ref,
    defineComponent,
    h,
    reactive,
    defineEmits
  } from 'vue'
  import {
    useMessage,
    useDialog
  } from 'naive-ui'
  import service from '@/utils/request.js'
  import storage from '@/utils/storage.js'
  import formAddress from '@/apps/common/address/formAddress.vue'
  import attachment from '@/apps/common/attachment/attachment.vue'
  import processView from '@/apps/common/process/processView.vue'
  import noRoleCard from '@/apps/common/page/noRoleCard.vue'
  import baseUrl from '@/utils/baseUrl'
  import interfaceUtilApi from '@/utils/interfaceUtil'
  import context from '@/context.js'
  import layout from "@/layout/layout";
  import createApi from './api'

  const currentInstance = getCurrentInstance()
  const api = createApi(currentInstance)
  const interfaceUtil = interfaceUtilApi(currentInstance)
  const emits = defineEmits(['afterSubmit', 'afterRefuse']);
  const message = useMessage()
  const handleInfo = ref(null);
  const dialog = useDialog()
  const process = ref(null)
  const {
    proxy
  } = getCurrentInstance()

  const isAdmin = storage.get("auths") && storage.get("auths").includes("AUTH_ADMIN")

  //==================================协议编号/拓展编号 start================================
  const formValue = reactive({
    name: "",
    number: ""
  });
  //协议编号modal
  const showModal = ref(false)
  const selectNumber = () => {
    getProtocolNumber(true);
  }
  //
  let data = ref([]);
  const columns = [{
      title: "协议编号",
      key: "fProtocolNumber"
    }, {
      title: "协议名称",
      key: "name"
    }, {
      title: "部门",
      key: "dept"
    }, {
      title: "部门经理",
      key: "manager"
    },
    {
      title: '操作',
      width: 120,
      key: 'options',
      render(row) {
        return [h(
          NButton, {
            onClick: () => {
              applicationModel.fDevelopInfo = row.fDevelopInfo
              applicationModel.fProtocolNumber = row.fProtocolNumber
              //获取业主
              let result = '';
              if (row.purchases !== undefined) {
                row.purchases.forEach(item => {
                  result += item; // 依次取出数组内容并拼接
                });
              }
              applicationModel.fOwner = result
              showModal.value = false
            }
          }, '选择',
        ), ]
      }
    }
  ];
  //分页参数
  const pagination = reactive({
    page: 1,
    pageSize: 5,
    itemCount: 1,
    pageSizes: [5, 10, 15],
  });

  //页数改变事件
  const onChangePage = (page) => {
    pagination.page = page;
    getProtocolNumber(false);
  }
  //页大小改变事件
  const onUpdatePageSize = (pageSize) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
    getProtocolNumber(false);
  }

  //搜索方法
  const handleValidateClick = () => {
    getProtocolNumber(false)
  }

  //协议编号接口调用
  const getProtocolNumber = async (modalFlag, url) => {
    try {
      // pg=页码&ps=页大小&q_agr_id=协议编号查询&q_agr_name=协议名称查询&sn=排序&ss=排序
      let url =
        baseUrl.oaUrl + `/j/api/sitc/jy/prj/project_sel_agr.jsp?`;
      var reqMap = {
        pg: `${pagination.page}`,
        ps: `${pagination.pageSize}`,
        s: context.user(),
        url: "/"
      }
      if (formValue.name !== '') {
        reqMap["q_agr_name"] = `${formValue.name}`
      }
      if (formValue.number != '') {
        reqMap["q_agr_id"] = `${formValue.number}`
      }
      var param = ""
      await api.oaQuestMap(reqMap)
        .then(function(res) {
          param = res.oaQuest
        })
      const response = await api.projectSelAgr(param)
      if (response.STATUS !== "S") {
        dialog.warning({
          title: '警告',
          content: 'Error!请求协议编号接口调用失败:' + response,
          positiveText: '确定',
        })
        console.log("Error!调用失败!!", response)
      } else {
        data.value.length = 0;
        pagination.itemCount = response.count;
        for (let i = 0; i < response.list.length; i++) {
          var item = response.list[i];
          data.value.push(item);
        }
        if (modalFlag) { //modalflag 区分是否需要关闭modal
          showModal.value = true
        }
      }
      var form = {
        fCreateTime: new Date(),
        fInterfaceName: "请求协议编号",
        fInterfaceUrl: url,
        fInterfaceInfo: response,
        fProtocolNo: applicationModel.fProtocolNo,
        fInputParameter: param,
        fInterfaceStatus: "1"
      }
      api.interfaceLogSave(form);
    } catch (error) {
      dialog.warning({
        title: '警告',
        content: '请求协议编号失败' + error,
        positiveText: '确定',
      })
      var form = {
        fCreateTime: new Date(),
        fInterfaceName: "请求协议编号",
        fInterfaceUrl: url,
        fInterfaceInfo: String(error),
        fProtocolNo: applicationModel.fProtocolNo,
        fInputParameter: param,
        fInterfaceStatus: "2"
      }
      api.interfaceLogSave(form);
      console.log(error);
    }
  }


  //==================================协议编号/拓展编号 end================================

  const route = useRoute()
  let id = ''
  //表单禁用/开启
  const isEditForm = ref(true)
  const addressEdit = ref("view")

  const fDept = ref({
    fId: "",
    fName: "",
  })

  /* form */
  const applicationModel = reactive({
    fId: id,
    //类别
    fProjectCategory: [],
    selectedCategory: {},
    projectCategory: {},


    fName: "",
    fSimpleName: "",
    fEngName: "",
    fOwner: '', //使用company
    fCreateTime: Date.now(),

    //部门
    fDept: {
      fId: "",
      fName: ""
    },
    //项目经理
    fDeptManager: {},
    //项目组成员
    fProjectMembers: [],
    //项目预算
    fProjectBudget: 0,



    //项目重要性
    fProjectImportance: [],
    selectedImportance: {},
    projectImportance: '',

    //项目地点
    fCountryVal: '',
    country: [],
    fCountry: {},
    fcityVal: '',
    city: [],
    fCity: {},

    //项目性质
    selectedNature: [],
    selectedNatures: [],
    fProjectNatures: [],

    //项目标签
    fProjectTags: [], //cun
    selectedTags: [], //fang
    selectedTag: [], //fang
    fTagOther: "",


    //项目类型
    fProjectTypes: [], //cun
    selectedTypes: [], //fang
    selectedType: [], //fang
    fTypes: [],
    fTypeOther: '',



    //项目规模
    fProjectScale: [],
    typeScales: [],
    fProjectScales: [], //cun
    fScales: [],


    fPlanForeignExchange: 0,
    //资金来源
    fCapitalSource: {},
    capitalSource: '',
    fFundingSources: [],


    fPlanIncome: 0,

    fDevelopInfo: "",


    //项目模式
    fangAnProjectMode: {},
    fProjectMode: {},
    projectMode: '',
    fProjectModes: [],

    currentFundingSource: null,

    fProjectPlace: "",
    fIsClassified: "",
    fExecutionLocation: "",

    //限制时间
    fPublishTime: '',
    //
    fProjectPackage: [],
    //审核状态
    fAuditStatus: '',

    //审批意见
    fApprovalComments: '',

    //流程id
    fReviewId: "",

    //oa接口参数拼接
    oaCountry: {},
    oaCity: {},
    oaCategory: {},
    oaTypeScales: [],
    oaCapitalSource: '',
    fSubmittalTime: '',

    // 当前处理人
    fCurrentProcessorId: '',

    //报错信息：
    errInfo: []
  })

  //审批意见编辑
  const isEditable = ref(false);

  //俩位小数
  const validateTwoDecimalPlaces = (rule, value, callback) => {
    const decimalRegex = /^\d+(\.\d{1,2})?$/; // 正则表达式，匹配最多两位小数的数字
    if (!decimalRegex.test(value)) {
      if (rule.field === 'fProjectBudget') {
        callback(new Error('征集费预算必须为数字，且最多保留两位小数'));
      } else if (rule.field === 'fPlanIncome') {
        callback(new Error('预期收入必须为数字，且最多保留两位小数'));
      }
    } else {
      callback();
    }
  };


  //验证规则
  const rules = ref({
    fProjectPlace: {
      required: true,
      message: '请填写项目地点',
      trigger: 'blur'
    },
    projectImportance: [{
      required: true,
      message: '请选择项目重要性',
      trigger: 'blur'
    }],
    fName: [{
      required: true,
      message: '项目名称不能为空',
      trigger: 'blur'
    }],
    fSimpleName: [{
      required: true,
      message: '项目简称不能为空',
      trigger: 'blur'
    }],
    fEngName: [{
      required: true,
      message: '英文不能为空',
      trigger: 'blur'
    }],
    fOwner: {
      required: true,
      message: '业主不能为空',
      trigger: 'blur'
    },

    fProjectBudget: [{
        required: true,
        message: '征集费预算不能为空',
        trigger: ['input', 'blur'],
        type: 'number'
      },
      {
        validator: validateTwoDecimalPlaces,
        trigger: 'blur'
      }
    ],
    fPlanIncome: [{
        required: true,
        message: '预期收入不能为空',
        trigger: 'blur',
        type: 'number'

      },
      {
        validator: validateTwoDecimalPlaces,
        trigger: 'blur'
      }
    ],
    /*fCapitalSource: [{
      message: "请填写其他资金来源",
      validator: function() {
        if (selectedCapitalSourceOther() && applicationModel.fCapitalSourceOther == "") {
          return false
        }
        return true
      }
    }],*/
    fProjectNature: [{
      message: "请填写其他项目性质",
      validator: function() {
        if (selectedNatureContainOther() && applicationModel.fProjectNatureOther == "") {
          return false
        }
        return true
      }
    }]

  });

  //项目重要性 选择校验
  const handleUpdateValue = (value, option) => {
    if (applicationModel.fPlanIncome >= 100000 && applicationModel.fPlanIncome < 200000 && applicationModel
      .projectImportance == importanceId.general) {
      dialog.warning({
        title: '警告',
        content: '预期收入大于等于10万小于20万，项目重要性不能为一般项目',
        positiveText: '确定',
      })
      selecteds.projectImportance = applicationModel.selectedImportance.fId
      return;
    }
    if (applicationModel.fPlanIncome >= 200000 && applicationModel.projectImportance == importanceId.general ||
      applicationModel.fPlanIncome >= 200000 && applicationModel.projectImportance == importanceId.deptimprotant) {
      dialog.warning({
        title: '警告',
        content: '预期收入大于等于20万，项目重要性不能为一般项目、部门重点',
        positiveText: '确定',
      })
      selecteds.projectImportance = applicationModel.selectedImportance.fId
      return;
    }
    applicationModel.selectedImportance = {
      fId: value,
      fName: option.label
    }
  }

  //项目类别
  const categoryUpdateValue = (value, option) => {
    applicationModel.selectedCategory = {
      fId: value
    }
  }


  //项目地点 国家
  const handleCountryValue = (value, option) => {
    applicationModel.fCountry = {
      fId: value,
      fCountryNum: option.key,
      fName: option.label
    }
    applicationModel.fcityVal = null;
    //oa 接口参数需要拼接
    applicationModel.oaCountry.fCountryNum = option.key
    applicationModel.oaCountry.fName = option.label
    applicationModel.fcityVal = null;
    applicationModel.fCity = null
  }

  //特定值 中国
  let chinaId = ref('')
  //项目地点 城市
  const handleCityValue = (value, option) => {
    applicationModel.fCity = {
      fId: value
    }
    //oa 接口参数需要拼接
    applicationModel.oaCity.fCityNum = option.fCityNum
    applicationModel.oaCity.fName = option.label

  }


  const formRef = ref(null)
  const now = (new Date()).getTime()


  // 项目类别
  const categoryOptions = computed(() => {
    return applicationModel.fProjectCategory.map(item => ({
      label: item.fNumber + '  ' + item.fName, // 用作显示的文本
      value: item.fId, // 用作值绑定
    }));
  });

  //国家list
  const countryList = reactive([]);
  //项目地点 国家 计算属性，生成选项数组
  // const countryList = computed(() => {
  //   return applicationModel.country.map(item => ({
  //     label: item.fName, // 用作显示的文本
  //     value: item.fId, // 用作值绑定
  //   }));
  // });

  //项目地点 国家 计算属性，生成选项数组
  // 计算属性，生成选项数组
  // 城市list 生成
  const cityList = computed(() => {
    if (!applicationModel.fCountryVal) return [];
    // 获取当前所选国家的所有城市
    let cities = applicationModel.city.filter(city =>
      city.fParentId === applicationModel.fCountryVal
    );
    // 分离上海
    const shanghai = cities.find(city => city.fCityNum.startsWith('310000'));
    // 分离上海的区
    const shanghaiAreas = cities.filter(city => city.fCityNum.startsWith('310') && !city.fName.startsWith('上海'));
    // 先去除上海及其区，以便于处理其他城市
    const otherCities = cities.filter(city => !city.fCityNum.startsWith('310'));
    // 重新组合列表
    const resultList = [
      shanghai && {
        label: shanghai.fName,
        value: shanghai.fId,
        disabled: true,
        fCityNum: shanghai.fCityNum, // 添加 fCityNum 属性
      },
      ...shanghaiAreas.map(area => ({
        label: area.fName,
        value: area.fId,
        fCityNum: area.fCityNum, // 添加 fCityNum 属性
      })),
      ...otherCities.map(city => ({
        label: city.fName,
        value: city.fId,
        fCityNum: city.fCityNum, // 添加 fCityNum 属性
      })),
    ];

    // 过滤掉可能的 undefined 元素
    return resultList.filter(Boolean);
  });

  //项目标签  计算属性，生成选项数组
  const tagsOptions = computed(() => {
    return applicationModel.fProjectTags.map(item => ({
      label: item.fName, // 用作显示的文本
      value: item.fId, // 用作值绑定
    }));
  });

  //项目性质
  const handleUpdateNature = (v) => {
    applicationModel.selectedNatures = [];
    // 遍历所有选中的值
    v.forEach(fId => {
      // 在fProjectNatures中查找具有匹配fId的对象
      const selectedNature = applicationModel.fProjectNatures.find(item => item.fId === fId);
      if (selectedNature) {
        // 将fId和fName添加到selectedNatures
        applicationModel.selectedNatures.push({
          fId: selectedNature.fId,
          fName: selectedNature.fName
        });
      }
    });

    // 判断是否要移除可选项/已选项
    var afterRemoveIds = []
    var afterRemoveObjs = []
    for (var i=0; i<applicationModel.selectedNature.length; i++) {
      var selectedNatureId = applicationModel.selectedNature[i]
      for (var j=0; j<applicationModel.fProjectNatures.length; j++) {
        var projectNature = applicationModel.fProjectNatures[j]
        if (projectNature.fId == selectedNatureId) {
          if (projectNature.fPreNature) {
            var hasPre = false
            for (var k=0; k<projectNature.fPreNature.split(";").length; k++) {
              if (applicationModel.selectedNature.indexOf(projectNature.fPreNature.split(";")[k]) >= 0){
                hasPre = true
              }
            }
            if (hasPre) {
              afterRemoveIds.push(selectedNatureId)
              afterRemoveObjs.push({
                fId: selectedNatureId,
                fName: projectNature.fName
              })
            }
          } else {
            afterRemoveIds.push(selectedNatureId)
            afterRemoveObjs.push({
              fId: selectedNatureId,
              fName: projectNature.fName
            })
          }
        }
      }
    }
    applicationModel.selectedNature = afterRemoveIds
    applicationModel.selectedNatures = afterRemoveObjs

    validateProjectNatureSelections();
    checkProjectNatureRules();
    validateLegalBidding();
  };
  //清空
  const clearSelectedNatures = () => {
    applicationModel.selectedNature = [];
    applicationModel.selectedNatures = []
  };
  // 定义一个方法来检查特定的项目性质选择是否违反规则
  const checkProjectNatureRules = () => {
    let conflictCount = 0;
    let natureConflict = false;

    const hasConstructionOnSite = applicationModel.selectedNatures.some(item => item.fName === '建设进场');
    const hasConstructionOffSite = applicationModel.selectedNatures.some(item => item.fName === '建设非进场');

    if (hasConstructionOnSite && hasConstructionOffSite) {
      natureConflict = true;
      dialog.warning({
        title: '警告',
        content: '选择了“建设进场”，就不能再选择“建设非进场”！',
        positiveText: '确定',
      })
    }

    const hasLoanProject = applicationModel.selectedNatures.some(item => item.fName === '贷款项目');
    const hasSelfFundedProject = applicationModel.selectedNatures.some(item => item.fName === '自筹资金项目');

    if (hasLoanProject && hasSelfFundedProject) {
      natureConflict = true;
      dialog.warning({
        title: '警告',
        content: '选择了“贷款项目”，就不能再选择“自筹资金项目”！',
        positiveText: '确定',
      })
    }

    let count = 0;

    if (applicationModel.selectedNatures.some(item => ['公开招标', '邀请招标'].includes(item.fName))) {
      count++;
    }

    if (applicationModel.selectedNatures.some(item => item.fName === '建设非进场')) {
      count++;
    }

    if (applicationModel.selectedNatures.some(item => ['地方政采', '中央政采项目'].includes(item.fName))) {
      count++;
    }

    if (count === 3 && !natureConflict) {
      dialog.warning({
        title: '警告',
        content: '“公开招标”或“邀请招标”、“建设非进场”、“政府采购”三者不可同时选择！',
        positiveText: '确定',
      })
      clearSelectedNatures();
    }

    if (natureConflict) {
      clearSelectedNatures(); // 清除选择，如果存在冲突
    }
  };


  const validateProjectNatureSelections = () => {
    if (applicationModel.selectedNatures.length === 0) {
      dialog.warning({
        title: '警告',
        content: '请选择项目性质!',
        positiveText: '确定',
      })
    } else {
      let procurementCount = 0;
      // 检查“地方政采”、“中央政采项目”、“财政非政采”的数量
      applicationModel.selectedNatures.forEach(nature => {
        if (['地方政采', '中央政采项目', '财政非政采'].includes(nature.fName)) {
          procurementCount++;
        }
      });

      if (procurementCount > 1) {
        dialog.warning({
          title: '警告',
          content: '地方政采、中央政采项目、财政非政采 不能同时选择！',
          positiveText: '确定',
        })
        clearSelectedNatures();
      }

      // 检查“建设进场”是否与“政府采购”同时被选择
      const constructionOnSite = applicationModel.selectedNatures.some(nature => nature.fName === '建设进场');
      const governmentProcurement = applicationModel.selectedNatures.some(nature => ['地方政采', '中央政采项目'].includes(nature
        .fName));

      if (constructionOnSite && governmentProcurement) {
        dialog.warning({
          title: '警告',
          content: '建设进场不可与地方政采、中央政采项目同时选择！',
          positiveText: '确定',
        })
        clearSelectedNatures();
      }
      // 检查“自筹资金项目”是否与“政府采购”或“财政非政采”同时被选择
      const selfFundedProject = applicationModel.selectedNatures.some(nature => nature.fName === '自筹资金项目');
      const prohibitedWithSelfFunded = applicationModel.selectedNatures.some(nature => ['地方政采', '中央政采项目', '财政非政采']
        .includes(nature.fName));
      if (selfFundedProject && prohibitedWithSelfFunded) {
        dialog.warning({
          title: '警告',
          content: '自筹资金项目不可与地方政采、中央政采项目、财政非政采同时选择！',
          positiveText: '确定',
        })
        clearSelectedNatures();
      }
    }
  };


  const validateLegalBidding = () => {
    if (applicationModel.selectedNatures.includes("依法必招") == true) {
      let count = 0;
      // 检查是否选择了禁止与"依法必招"同时选择的项目性质
      applicationModel.selectedNatures.forEach(nature => {
        if (['地方政采', '中央政采项目', '财政非政采', '小型工程'].includes(nature.fName)) {
          count++;
        }
      });
      if (count > 1) {
        // 显示错误消息
        dialog.warning({
          title: '警告',
          content: '依法必招项目不可同时选择“地方政采”、“中央政采项目”、“财政非政采”、“小型工程”！',
          positiveText: '确定',
        })
        clearSelectedNatures();
        // 清除非法选择
        applicationModel.selectedNatures = applicationModel.selectedNatures.filter(nature => ![
          '地方政采',
          '中央政采项目',
          '财政非政采',
          '小型工程'
        ].includes(nature.fName));
      }
    }
  };

  //项目标签
  const handleTagValue = (v, tar) => {
    applicationModel.selectedTags = []
    applicationModel.fTagNameArray = []
    for (var i = 0; i < tar.length; i++) {
      applicationModel.selectedTags.push({
        fId: tar[i].value
      })
      applicationModel.fTagNameArray.push(tar[i].label)
    }
  }


  //项目类型选项
  const typeOptions = computed(() => {
    return applicationModel.fProjectTypes.map(item => ({
      label: item.fName, // 用作显示的文本
      value: item.fId, // 用作值绑定
      types: item.types,
      fGroup: item.fGroup
    }));
  });

  // 项目类型 规模字段
  // 项目类型
  const updateFProjectType = async (v, targets) => {
    //2024-0918 项目标签与项目类型联动，选择了。。。类型的时候，项目标签可选择。。。
    applicationModel.fProjectTags = []
    var tempSelectedTagValue = []
    var tempSelectedTagsValue = []
    var pushedTagsValue = []
    for (var i=0; i<v.length; i++) {
      var tags = allSelectValues.tags[v[i]]
      //重新填充标签可选项，和移除不可选标签项
      if (tags) {
        for (var j = 0; j < tags.length; j++) {
          if (applicationModel.selectedTag.includes(tags[j].fId)) {
            tempSelectedTagValue.push(tags[j].fId)
            tempSelectedTagsValue.push({
              fId : tags[j].fId
            })
          }
          if (!pushedTagsValue.includes(tags[j].fId)) {
            applicationModel.fProjectTags.push(tags[j])
            pushedTagsValue.push(tags[j].fId)
          }
        }
      }
    }
    applicationModel.selectedTag = tempSelectedTagValue
    applicationModel.selectedTags = tempSelectedTagsValue

    //2024-0919 项目规模与项目类型联动，增加一个上级组别，选择了该组别的类型，则填写该组别的规模
    var pushedScaleValue = []
    allSelectValues.selectedGroup = []
    for (let key in allSelectValues.group) {
      var group = allSelectValues.group[key]
      var haveThisGroup = group.typeId.filter(val => v.includes(val))
      if (haveThisGroup.length > 0) {
        allSelectValues.selectedGroup.push(group.groupName)
        for (var i=0; i<group.scaleId.length; i++) {
          var scaleId = group.scaleId[i]
          var scaleName = group.scaleName[i]
          var haveThisScale = applicationModel.fScales.filter(val => val.fScale.fId === scaleId)
          if (haveThisScale.length > 0) {
            pushedScaleValue.push(haveThisScale[0])
          } else {
            pushedScaleValue.push({
              fId : "",
              fMain : {
                fId : applicationModel.fId
              },
              fScale : {
                fId : scaleId,
                fName : scaleName
              },
              fValue : "",
              fGroup : group.groupName
            })
          }
        }
      }
    }
    applicationModel.fScales = pushedScaleValue

    applicationModel.selectedTypes = v.map(id => ({
      fId: id
    }));
    applicationModel.fTypes = targets.map(val => ({
      fId : "",
      fTypeId : {
        fId : val.value,
        fName : val.label
      },
      fGroup : val.fGroup
    }))
    /*if (v.length === 0) {
      applicationModel.typeScales = [];
      return;
    }
    applicationModel.fProjectScale = targets

    const temp = new Set();

    // 使用 Promise.all 并发处理请求
    const requests = applicationModel.selectedTypes.map(async item => {
      const query = [{
        "eq": {
          "fMasterDataTypeId.fId": item.fId
        }
      }];
      const res = await axios.post("/pm/masterdata/typeScale/list", {
        query
      });

      res.data.list.forEach(scale => temp.add(scale.fMasterDataScaleId.fId));

      return res.data.list;
    });

    // 等待所有请求完成
    const results = await Promise.all(requests);

    //追加新增数据
    results.forEach((res) => {
      let flag = true;
      applicationModel.typeScales.forEach((typeScales) => {
        if (typeScales[0].fMasterDataScaleId.fId === res[0].fMasterDataScaleId.fId || typeScales[1]
          .fMasterDataScaleId.fId === res[0].fMasterDataScaleId.fId) {
          flag = false;
        }
      })
      if (flag) {
        applicationModel.typeScales.push(res)
      }
    })

    // 过滤多余数据 typeScales
    applicationModel.typeScales = applicationModel.typeScales.filter(typeScale =>
      temp.has(typeScale[0].fMasterDataScaleId.fId)
    );*/

  }

  //资金来源
  /*const handleChange = (e, option) => {
    applicationModel.fCapitalSource = {
      fId: option.fId
    };
    applicationModel.oaCapitalSource = option.fName
  }*/
  //项目模式
  const handleFundChange = (e) => {
    applicationModel.fProjectMode = {
      fId: e.target.value
    };
  }

  const importanceId = {
    //一般项目
    general: '',
    deptimprotant: '',
    companyimportant: '',
    generalName: '',
    deptimprotantName: '',
    companyimportantName: ''
  }

  //项目重要性 改变
  const changeImportance = (v) => {
    if (v < 100000) {
      applicationModel.projectImportance = importanceId.general
      applicationModel.projectImportanceName = importanceId.generalName
    } else if (v >= 100000 && v < 200000) {
      applicationModel.projectImportance = importanceId.deptimprotant
      applicationModel.projectImportanceName = importanceId.deptimprotantName
    } else if (v >= 200000) {
      applicationModel.projectImportance = importanceId.companyimportant
      applicationModel.projectImportanceName = importanceId.companyimportantName
    }
    applicationModel.selectedImportance = {
      fId: applicationModel.projectImportance,
      fName: applicationModel.projectImportanceName
    }
  }

  const initialName = {}

  const currentUrl = window.location.href;
  var auths = storage.get("auths")
  const actions = {

    projectInfo: async (url, filter) => {
      if (id === undefined) {
        return;
      }
      await api.applicationProjectView(id).then(result => {
        const data = result.data;
        // if (data.fCurrentProcessorId != context.user()) {
          // filterApproval();
          // return;
        // }

        applicationModel.fProtocolNo = data.fProtocolNo
        applicationModel.fAuditStatus = data.fAuditStatus

        applicationModel.fCurrentProcessorId = data.fCurrentProcessorId
        applicationModel.fName = data.fName
        applicationModel.fId = id
        //项目简称
        applicationModel.fSimpleName = data.fSimpleName
        //项目英文名称
        applicationModel.fEngName = data.fEngName
        initialName.fName = data.fName
        initialName.fSimpleName = data.fSimpleName
        initialName.fEngName = data.fEngName

        //国家城市
        if (data.fCountry) {
          applicationModel.oaCountry = data.fCountry
          applicationModel.fCountry = data.fCountry
        }
        if (data.fCity) {
          applicationModel.oaCity = data.fCity
          applicationModel.fCity = data.fCity
        }

        //项目预算
        applicationModel.fProjectBudget = data.fProjectBudget
        //计划用汇
        applicationModel.fPlanForeignExchange = data.fPlanForeignExchange

        //涉密项目
        applicationModel.fIsClassified = data.fIsClassified
        //项目性质
        applicationModel.selectedNature = data.selectedNature
        const naturesIds = data.selectedNature.map(str => ({
          fId: str
        }));

        applicationModel.selectedNatures = data.oaNatureNameArray.map(item => ({
          fId: item.fId,
          fName: item.fName
        }));

        //项目重要性
        applicationModel.projectImportance = data.projectImportance
        applicationModel.selectedImportance = {
          fId: data.projectImportance,
          fName: data.fProjectImportance.fName
        }
        //资金来源
        /*applicationModel.capitalSource = data.capitalSource
        applicationModel.fCapitalSource = {
          fId: data.capitalSource,
          fName: data.fCapitalSource.fName
        }
        applicationModel.oaCapitalSource = data.fCapitalSource.fName*/

        //项目执行地
        applicationModel.fcityVal = data.fcityVal
        applicationModel.fCountryVal = data.fCountryVal

        //项目标签
        applicationModel.selectedTag = data.selectedTag
        const tagsIds = data.selectedTag.map(str => ({
          fId: str
        }));
        applicationModel.selectedTags = applicationModel.selectedTags.concat(tagsIds);
        applicationModel.fTagNameArray = data.appsTagNameArray
        applicationModel.fTagOther = data.fTagOther

        //项目类型
        applicationModel.selectedType = data.selectedType
        const typesIds = data.selectedType.map(str => ({
          fId: str
        }));
        applicationModel.selectedTypes = applicationModel.selectedTypes.concat(typesIds);
        applicationModel.fTypes = data.fTypes
        applicationModel.fTypeOther = data.fTypeOther


        //类别
        applicationModel.projectCategory.fId = data.fProjectCategory.fId
        applicationModel.selectedCategory = {
          fId: data.fProjectCategory.fId,
          fName: data.fProjectCategory.fName,
          fNumber: data.fProjectCategory.fNumber
        }
        applicationModel.oaCategory = applicationModel.selectedCategory


        //项目模式
        applicationModel.projectMode = data.projectMode
        //项目地点
        applicationModel.fProjectPlace = data.fProjectPlace
        //预期收入
        applicationModel.fPlanIncome = data.fPlanIncome
        //项目规模
        applicationModel.fProjectScale = data.fProjectScale
        applicationModel.fScales = data.fScales
        for (var i=0; i<applicationModel.fScales.length; i++) {
          if (!allSelectValues.selectedGroup.includes(applicationModel.fScales[i].fGroup)) {
            allSelectValues.selectedGroup.push(applicationModel.fScales[i].fGroup)
          }
        }

        //项目
        applicationModel.fProjectMode = data.fProjectMode

        //项目规模
        applicationModel.typeScales = data.typeScales

        //业主
        applicationModel.fOwner = data.fOwner
        //部门
        applicationModel.fDept.fId = data.fDept.fId;
        applicationModel.fDept.fName = data.fDept.fName;
        applicationModel.fangAnProjectMode.fId = applicationModel.projectMode
        //审批意见
        applicationModel.fApprovalComments = data.fApprovalComments
        //ekp流程id
        applicationModel.fReviewId = data.fReviewId

        //协议编号
        applicationModel.fProtocolNumber = data.fProtocolNumber;
        //开拓信息
        applicationModel.fDevelopInfo = data.fDevelopInfo

        try {
          proxy.$refs.process.reload(data.fReviewId)
        } catch (e) {

        }
        //项目经理
        applicationModel.fDeptManager = data.fDeptManager
        //项目组成员
        applicationModel.fProjectMembers = data.fProjectMembers
      }).catch(err => {
        console.log(err)
      });
    },
    viewItem: async (row) => {},
  }

  // 项目重要性
  const importanceOptions = computed(() => {
    return applicationModel.fProjectImportance.map(item => ({
      label: item.fName, // 用作显示的文本
      value: item.fId, // 用作值绑定
    }));
  });

  //主数据查询
  const masterList = {
    NatrueList: async (url, filter) => {
      //项目性质
      await api.natureList({
        sort: ["fOrder asc"]
      }).then(result => {
        const dataList = result.data.list;
        applicationModel.fProjectNatures = [];
        for (let i = 0; i < dataList.length; i++) {
          const obj = {
            fName: dataList[i].fName,
            fId: dataList[i].fId,
            fNote: dataList[i].fNote,
            fPreNature: dataList[i].fPreNature
          };
          applicationModel.fProjectNatures.push(obj);
        }
      }).catch(err => {
        console.log(err)
      });
    },
    //项目重要性
    importanceList: async (url, filter) => {
      await api.importanceList().then(result => {
        const dataList = result.data.list;
        applicationModel.fProjectImportance = [];
        for (let i = 0; i < dataList.length; i++) {
          if (dataList[i].fName == '一般项目') {
            importanceId.general = dataList[i].fId
            importanceId.generalName = dataList[i].fName
          } else if (dataList[i].fName == '部门重点') {
            importanceId.deptimprotant = dataList[i].fId
            importanceId.deptimprotantName = dataList[i].fName
          } else if (dataList[i].fName == '公司重点') {
            importanceId.companyimportant = dataList[i].fId
            importanceId.companyimportantName = dataList[i].fName
          }
          const obj = {
            fName: dataList[i].fName,
            fId: dataList[i].fId
          };
          applicationModel.fProjectImportance.push(obj);
        }
        //
      }).catch(err => {

      });
    },

    //资金来源
    fundList: async (url, filter) => {
      await api.fundList().then(result => {
        const dataList = result.data.list;
        applicationModel.fFundingSources = [];
        for (let i = 0; i < dataList.length; i++) {
          const obj = {
            fName: dataList[i].fName,
            fId: dataList[i].fId,
          };
          applicationModel.fFundingSources.push(obj);
        }
      }).catch(err => {
        console.log(err)
      });
    },



    //项目标签
    tagList: async (url, filter) => {
      await api.tagList().then(result => {
        const dataList = result.data.list;
        applicationModel.fProjectTags = [];
        for (let i = 0; i < dataList.length; i++) {
          const obj = {
            fName: dataList[i].fName,
            fId: dataList[i].fId
          };
          applicationModel.fProjectTags.push(obj);
        }
      }).catch(err => {
        console.log(err)
      });
    },

    //国家 执行地
    countryList: async () => {
      api.countryList().then(result => {
        const dataList = result.data.list;
        applicationModel.country = [];
        countryList.length = 0
        for (let i = 0; i < dataList.length; i++) {
          if (dataList[i].fName == '中国') {
            chinaId = dataList[i].fId
          }
          const obj = {
            key: dataList[i].fCountryNum, //编码
            label: dataList[i].fName,
            value: dataList[i].fId
          };
          countryList.push(obj);
        }
      });

      //城市查询
      api.cityList().then(result => {
        const dataList = result.data.list;
        applicationModel.city = [];
        for (let i = 0; i < dataList.length; i++) {
          if (dataList[i].fParentId != null) {
            const obj = {
              fParentId: dataList[i].fParentId.fId,
              fName: dataList[i].fName,
              fId: dataList[i].fId,
              fCityNum: dataList[i].fCityNum
            };
            applicationModel.city.push(obj);
          }
        }
      });
    },


    //项目类型
    typeList: async (url, filter) => {
      await api.typeList().then(result => {
        const dataList = result.data.list;
        applicationModel.fProjectTypes = [];
        for (let i = 0; i < dataList.length; i++) {
          const obj = {
            fName: dataList[i].fName,
            fId: dataList[i].fId
          };
          applicationModel.fProjectTypes.push(obj);
        }
      }).catch(err => {
        console.log(err)
      });


    },
    //项目模式
    ModeList: async (url, filter) => {
      await api.modeList().then(result => {
        const dataList = result.data.list;
        applicationModel.fProjectModes = [];
        for (let i = 0; i < dataList.length; i++) {
          if (dataList[i].fName == '方案征集') {
            applicationModel.fangAnProjectMode.fId = dataList[i].fId
            applicationModel.fangAnProjectMode.fName = dataList[i].fName
          }
          const obj = {
            fName: dataList[i].fName,
            fId: dataList[i].fId,
          };
          applicationModel.fProjectModes.push(obj);
        }
      }).catch(err => {
        console.log(err)
      });
    },
    //项目类别
    categoryList: async (url, filter) => {
      await api.categoryList().then(result => {
        const dataList = result.data.list;
        applicationModel.fProjectCategory = [];
        for (let i = 0; i < dataList.length; i++) {
          const obj = {
            fName: dataList[i].fName,
            fId: dataList[i].fId,
            fNumber: dataList[i].fNumber
          };
          applicationModel.fProjectCategory.push(obj);
        }
      }).catch(err => {
        console.log(err)
      });
    },


    //项目规模
    scaleList: async (url, filter) => {
      await api.scaleList().then(result => {
        const dataList = result.data.list;
        applicationModel.fProjectScales = [];
        for (let i = 0; i < dataList.length; i++) {
          const obj = {
            fName: dataList[i].fName,
            fId: dataList[i].fId
          };
          applicationModel.fProjectScales.push(obj);
        }
      }).catch(err => {
        console.log(err)
      });
    },
  }


  //提交校验
  async function check() {
    //清空错误信息
    applicationModel.errInfo.length = 0
    try {
      await formRef.value.validate();
    } catch (errors) {
      applicationModel.errInfo.push("请检查表单数据是否填写完整!");
    }
    try {
      //协议编号和开拓信息判断是否选择
      if (applicationModel.fProtocolNumber === '' && applicationModel.fDevelopInfo === '') {
        applicationModel.errInfo.push("协议编号和开拓信息未选择!");
      }
      if (applicationModel.fName !== '' && applicationModel.fSimpleName !== '' && applicationModel.fName ==
        applicationModel.fSimpleName) {
        applicationModel.errInfo.push("项目名称和项目简称不能相同!");
      }
      if (applicationModel.fName === '') {
        applicationModel.errInfo.push("请填写项目名称!");
      }
      if (applicationModel.fSimpleName === '') {
        applicationModel.errInfo.push("请填写项目简称!");
      }
      if (applicationModel.fEngName === '') {
        applicationModel.errInfo.push("请填写英文名称!");
      }
      if (applicationModel.fOwner === '') {
        applicationModel.errInfo.push("请填写业主!");
      }
      if (applicationModel.fProjectBudget < 0) {
        applicationModel.errInfo.push("请填写征集费预算!");
      }
      if (applicationModel.fPlanIncome < 0) {
        applicationModel.errInfo.push("请填写预期收入!");
      }
      if (applicationModel.fProjectPlace == '') {
        applicationModel.errInfo.push("请填写项目地点!");
      }
      /*const hasNullValue = applicationModel.fScales.some(item =>
        item.fValue === null || item.fValue === undefined || item.fValue === ''
      );
      if (hasNullValue) {
        applicationModel.errInfo.push("请填写规模信息!");
      }*/
      if (applicationModel.fDeptManager.fName == null || applicationModel.fDeptManager.fName == '') {
        applicationModel.errInfo.push("项目经理未选择!");
      }
      if (applicationModel.fDept.fName == '' || applicationModel.fDept.fName == null) {
        applicationModel.errInfo.push("部门未选择!");
      }
      if (typeof applicationModel.fIsClassified != 'boolean') {
        applicationModel.errInfo.push("是否涉密未选择!");
      }
      if (applicationModel.selectedNature.length == 0) {
        applicationModel.errInfo.push("项目性质未选择!");
      }
      if (applicationModel.projectImportance == '') {
        applicationModel.errInfo.push("项目重要性未选择!");
      }
      /*if (applicationModel.capitalSource == '') {
        applicationModel.errInfo.push("资金来源未选择!");
      }*/
      if (applicationModel.fCountryVal == '' || (applicationModel.fCountryVal == chinaId && applicationModel
          .fcityVal == null)) {
        applicationModel.errInfo.push("项目执行地未选择!");
      }
      if (applicationModel.selectedTag.length == 0 && tagsOptions.value.length > 0) {
        applicationModel.errInfo.push("项目标签未选择!");
      }
      if (showOtherTagInput() && applicationModel.fTagOther == "") {
        applicationModel.errInfo.push("项目其他标签不能为空！");
      }
      if (applicationModel.selectedType.length == 0) {
        applicationModel.errInfo.push("项目类型未选择!");
      }
      if (showOtherTypeInput() && applicationModel.fTypeOther == "") {
        applicationModel.errInfo.push("项目其他类型不能为空！");
      }
      /*if (selectedCapitalSourceOther() && applicationModel.fCapitalSourceOther == "") {
        applicationModel.errInfo.push("其他资金来源未填写!");
      }*/
      if (selectedNatureContainOther() && applicationModel.fProjectNatureOther == "") {
        applicationModel.errInfo.push("其他项目性质未填写!");
      }
      //本地校验 项目名称是否重复
      var query = [];
      query.push([{
        "and": [{
          "or": [{
            "eq": {
              "fName": applicationModel.fName
            }
          }, {
            "eq": {
              "fSimpleName": applicationModel.fSimpleName
            }
          }, {
            "eq": {
              "fEngName": applicationModel.fEngName
            }
          }]
        }, {
          "neq": {
            "fId": id
          }
        }]
      }])
      const response = await api.projectMainList({
        query: query
      });
      const dataList = response.data.list;
      if (dataList.length > 0) {
        applicationModel.errInfo.push("项目名称重复，项目简称重复，英文名称重复，请检查项目信息!");
      }
      var updateName = false;
      //如果名称发生变化，则进行内网校验
      if (initialName.fName !== applicationModel.fName || initialName.fSimpleName !== applicationModel.fSimpleName ||
        initialName.fEngName !== applicationModel.fEngName) {
        updateName = true;
        //内网校验前 如果已经有填写错误 先提醒
        if (applicationModel.errInfo.length > 0) {
          dialog.warning({
            title: '警告',
            content: () =>
              h('div', null,
                applicationModel.errInfo.map((item, index) =>
                  h('div', {
                    key: index
                  }, item)
                )
              ),
            positiveText: '确定',
          })
          return false;
        }
        //内网校验
        await innerNetCheck("add", true);
        if (innerCHeckStatus.value.STATUS != 'S') {
          applicationModel.errInfo.length = 0
          applicationModel.errInfo.push(innerCHeckStatus.value.MESSAGE);
          //错误提示
          dialog.warning({
            title: '内网警告',
            content: () =>
              h('div', null,
                applicationModel.errInfo.map((item, index) =>
                  h('div', {
                    key: index
                  }, item)
                )
              ),
            positiveText: '确定',
          })
          return false;
        }
      }
      // 流程审批结果 innerCHeckStatus.value.MESSAGE
      await innerNetCheck("add", false)
      if (innerCHeckStatus.value.STATUS != 'S') {
        applicationModel.errInfo.length = 0
        applicationModel.errInfo.push(innerCHeckStatus.value.MESSAGE);
        dialog.warning({
          title: '警告',
          content: () =>
            h('div', null,
              applicationModel.errInfo.map((item, index) =>
                h('div', {
                  key: index
                }, item)
              )
            ),
          positiveText: '确定',
        })
        return false;
      }
      applicationModel.fAuditStatus = "1"
      applicationModel.fProtocolNo = innerCHeckStatus.value.f_protocol_no;
      //项目审批通过 todo
      if (applicationModel.errInfo.length == 0) {
        //applicationModel
        await submit().then(() => {
          message.info("项目审批成功")
        }).catch(err => {
          alert("项目审批失败")
        })
        return true
      } else {
        dialog.warning({
          title: '警告',
          content: () =>
            h('div', null,
              applicationModel.errInfo.map((item, index) =>
                h('div', {
                  key: index
                }, item)
              )
            ),
          positiveText: '确定',
        })
        return false
      }
    } catch (err) {
      dialog.warning({
        title: '警告',
        content: () =>
          h('div', null,
            applicationModel.errInfo.map((item, index) =>
              h('div', {
                key: index
              }, item)
            )
          ),
        positiveText: '确定',
      })
      console.log(err)
      return false
    }
  }

  /**关闭页面弹窗 */
  // const filterApproval = () => {
  //   dialog.warning({
  //     title: "错误",
  //     content: "您不是项目处理人",
  //     positiveText: "关闭",
  //     onPositiveClick: () => {
  //       layout.close('approval');
  //     }
  //   });
  // }

  async function submit() {
    try {
      //部门 处理
      await api.applicationSave(id,applicationModel)
        .then(function(res) {
          if (res.status != 200) {
            throw "fail"
          }
        })
      // 请求成功时执行的代码
       /*layout.close('approval');
      layout.open({
        label: "成功页面",
        key: "actionSuccess",
        component: "/apps/common/successPage.vue"
      }); */
    } catch (error) {
      // 错误处理
      console.error(error);
      throw error
    }
  }

  const isInitialSet = ref(true); // 标志变量，用于判断是否是初始设置
  /* 监听部门值的变化，变化时清空部门主管和项目组成员 */
  watch(applicationModel.fDept, async (newVal, oldVal) => {
    if (!isInitialSet.value) {
      applicationModel.fDeptManager.fId = ""
      applicationModel.fDeptManager.fName = ""
      applicationModel.fProjectMembers.length = 0
    }
    isInitialSet.value = false; // 重置标志变量
  })


  watch(
    () => route.query.fId,
    async (newId, oldId) => {
      id = newId
      await actions.projectInfo();
      masterList.NatrueList();
      masterList.importanceList();
      masterList.fundList();
      //masterList.tagList();
      masterList.countryList();
      masterList.typeList();
      masterList.ModeList();
      masterList.categoryList();
      masterList.scaleList();
      judgeEditing();
      //读取类型标签，类型规模对应关系
      loadAllTypeTag()
      loadTypeGroup()
    }
  );

  onMounted(async () => {
    id = route.query.fId
    await actions.projectInfo();
    masterList.NatrueList();
    masterList.importanceList();
    masterList.fundList();
    //masterList.tagList();
    masterList.countryList();
    masterList.typeList();
    masterList.ModeList();
    masterList.categoryList();
    masterList.scaleList();
    judgeEditing();
    //读取类型标签，类型规模对应关系
    loadAllTypeTag()
    loadTypeGroup()

  })

  const userId = context.user()
  //职位
  const position = ref("")
  //部门经理Id
  var DeptManagerId = ''
  //获取登录人 相关信息

  const getPosition = async () => {
    try {
      const personResult = await api.personLoad({fId:userId});
      const deptId = personResult.data.fParent.fId;
      const managerListResult = await api.deptManagerList({
        query: {
          "and": [{
            "eq": {
              "fDeptId": deptId
            }
          }, {
            "eq": {
              "fRoleKey": '1'
            }
          }]
        }
      });
      DeptManagerId = managerListResult.data.list[0].fDeptManagerId;
    } catch (err) {
      console.error(err)
    }
  };
  const judgeEditing = async function() {
    await getPosition();
    if (DeptManagerId == userId) {
      isEditForm.value = false; // Fixed typo: flase -> false
      addressEdit.value = "edit";
      if (applicationModel.fAuditStatus !== '0') {
        addressEdit.value = "view";
      }
    }
  };

  //内网校验
  const innerCHeckStatus = ref()
  //oa内网校验/提交 接口
  async function innerNetCheck(flag, check) {
    const result = await interfaceUtil.projectMainCheck(flag, check, applicationModel)
    if (result.STATUS == "E") {
      applicationModel.errInfo.push(result.MESSAGE)
    }
    innerCHeckStatus.value = result
  }

  const refuse = async () => {
    applicationModel.fAuditStatus = '2'
    applicationModel.fCurrentProcessorId = ""
    await api.applicationSave(id,applicationModel).then(result => {
      message.info("驳回成功")
    }).catch(err => {
      message.error("驳回失败")
    })
    return true
  }

  //父组件
  const handleNotification = async (data) => {
    return await check();
  }


  const refuseNotification = (data) => {
    return refuse();
  }



  //上海国际招标（用于地址本限制可选部门）
  const shgjzbOrg = reactive([])
  var param = [{
      "eq": {
        "fName": "上海国际招标有限公司"
      }
    },
    {
      "eq": {
        "fType": "2"
      }
    }
  ]
  var query = {
    "and": param
  }
  api.elementList({
      query: query
    })
    .then(function(res) {
      shgjzbOrg.length = 0
      for (var i = 0; i < res.data.list.length; i++) {
        shgjzbOrg.push(res.data.list[i])
      }
    })


  function selectedNatureContainOther() {
    var bool = false
    applicationModel.selectedNatures.forEach(nature => {
      bool = bool || nature.fName == "其他"
    })
    return bool
  }

  function selectedCapitalSourceOther() {
    return applicationModel.oaCapitalSource == "其他"
  }

  //选择项目经理后，如果部门成员包含项目经理，则移除
  function afterChangeDeptManager() {
    if (applicationModel.fDeptManager.fId) {
      for (var i = 0; i < applicationModel.fProjectMembers.length; i++) {
        if (applicationModel.fProjectMembers[i].fId == applicationModel.fDeptManager.fId) {
          applicationModel.fProjectMembers.splice(i, 1)
        }
      }
    }
  }


  //类型标签，类型规模数据
  const allSelectValues = reactive({
    tags : {},
    scales : {},
    group : {},
    selectedGroup : []
  })

  async function loadAllTypeTag(){
    await api.dataTypeTageList().then(function(res){
      if (res.status == 200) {
        for (var i=0; i<res.data.list.length; i++) {
          var temp = res.data.list[i]
          if (!allSelectValues.tags[temp.fMasterDataType.fId]) {
            allSelectValues.tags[temp.fMasterDataType.fId] = []
          }
          allSelectValues.tags[temp.fMasterDataType.fId].push(temp.fMasterDataTag)
        }
      }
    })
    //结束后根据当前已选类型，配置当前可选标签
    for (var i=0; i<applicationModel.fTypes.length; i++) {
      var temp = applicationModel.fTypes[i].fTypeId
      for (var tagId in allSelectValues.tags) {
        var tags = allSelectValues.tags[tagId]
        if (tagId === temp.fId) {
          tags.forEach(val => {
            applicationModel.fProjectTags.push(val)
          })
        }
      }
    }

  }
  async function loadTypeGroup(){
    await api.typeList().then(function(res){
      if (res.status == 200) {
        for (var i=0; i<res.data.list.length; i++) {
          var temp = res.data.list[i]
          if (!allSelectValues.group[temp.fGroup]) {
            allSelectValues.group[temp.fGroup] = {
              groupName : temp.fGroup,
              typeName : [],
              typeId : [],
              scaleName : [],
              scaleId : []
            }
          }
          allSelectValues.group[temp.fGroup].typeName.push(temp.fName)
          allSelectValues.group[temp.fGroup].typeId.push(temp.fId)
        }
      }
    })
    await api.scaleList().then(function(res){
      if (res.status == 200) {
        for (var i=0; i<res.data.list.length; i++) {
          var temp = res.data.list[i]
          if (!allSelectValues.group[temp.fGroup]) {
            allSelectValues.group[temp.fGroup] = {
              groupName : temp.fGroup,
              typeName : [],
              typeId : [],
              scaleName : [],
              scaleId : []
            }
          }
          allSelectValues.group[temp.fGroup].scaleName.push(temp.fName)
          allSelectValues.group[temp.fGroup].scaleId.push(temp.fId)
        }
      }
    })
  }

  function showOtherTypeInput() {
    if (applicationModel.fTypes) {
      for (var i=0; i<applicationModel.fTypes.length; i++) {
        if (applicationModel.fTypes[i].fTypeId.fName === "其他") {
          return true
        }
      }
    }
    applicationModel.fTypeOther = ""
    return false
  }

  function showOtherTagInput() {
    if (applicationModel.fTagNameArray) {
      if (applicationModel.fTagNameArray.includes("其他")){
        return true
      }
    }
    applicationModel.fTagOther = ""
    return false
  }

  function showNature(item) {
    if (item.fPreNature) {
      return applicationModel.selectedNatures.filter(val => {
        return item.fPreNature.indexOf(val.fId) >= 0
      }).length > 0
    }
    return true
  }
</script>

<style>
  .flex-center {
    display: flex;
    flex-wrap: wrap;
    /* align-items: center;   */
  }
</style>
