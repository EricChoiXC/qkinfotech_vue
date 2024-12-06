<template>
  <noRoleCard v-if="identity != 1 && identity !== ''"></noRoleCard>

  <n-layout v-if="identity == 1">
    <n-space vertical size="large">
      <n-layout-header>
      </n-layout-header>
      <n-layout-content>
        <n-card>
          <n-form ref="formRef" :model="applicationModel" label-placement="" label-width="150px" :rules="rules">
            <n-grid :cols="2">
              <n-gi :span="2">
                <p style="font-size: 16px; font-weight: bold;">基本信息</p>
              </n-gi>
              <n-gi :span="2">
                <!-- <n-table :single-line="false"> -->
                <n-table :single-line="false" style="table-layout: fixed;">
                  <tbody>
                    <tr>
                      <th style="width: 20%; text-align: center; vertical-align: middle;">编号</th>
                      <td style="width: 35%; text-align: left; vertical-align: middle;">
                        项目审批通过后自动生成
                      </td>
                      <th style="width: 20%; text-align: center; vertical-align: middle;">类别</th>
                      <td style="width: 35%; text-align: left; vertical-align: middle;">
                        <n-select v-model:value="applicationModel.projectCategory.fId" :options="categoryOptions" tag
                          :disabled="true" @update:value="categoryUpdateValue" />
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 20%; text-align: center;vertical-align: middle;">协议编号<span
                          style="color: red;">*</span></th>
                      <td style="width: 35%;vertical-align: middle;" class="tdleft" colspan="3">
                        <n-form-item path="fProtocolNumber" style=" display: flex; align-items: center;">
                          <n-input style="width:56vw;" v-model:value="applicationModel.fProtocolNumber"
                            :disabled="true"></n-input>
                          <n-button @click="selectNumber">选择</n-button>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 20%; text-align: center;">项目名称<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft" colspan="3">
                        <n-form-item path="fName" style=" display: flex;flex-wrap: wrap; align-items: center;">
                          <n-input style="width: 60vw;" v-model:value="applicationModel.fName"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 20%; text-align: center;">项目简称<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft" colspan="3">
                        <n-form-item path="fSimpleName" style=" display: flex; flex-wrap: wrap;align-items: center;">
                          <n-input style="width: 60vw;" v-model:value="applicationModel.fSimpleName"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 20%; text-align: center;">英文名称<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft" colspan="3">
                        <n-form-item label="" path="fEngName"
                          style=" display: flex; flex-wrap: wrap;align-items: center;">
                          <n-input style="width: 60vw;" v-model:value="applicationModel.fEngName"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 20%; text-align: center;">业主<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft" colspan="3">
                        <n-form-item label="" path="fOwner" class="flex-center" style="flex: 0 ;">
                          <n-input style="width: 60vw;" v-model:value="applicationModel.fOwner"
                            :disabled="true"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 20%; text-align: center;">项目模式<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item label="" class="flex-center">
                          <n-radio-group v-model:value="selecteds.projectMode">
                            <n-space>
                                <n-radio :value="selecteds.fangAnProjectMode.fId" @change="handleModeChange" disabled>{{
                                selecteds.fangAnProjectMode.fName }}</n-radio>
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
                          <formAddress :fElement="applicationModel.fDept" status="edit" orgType="ORG_TYPE_DEPT"
                            :limitRange="shgjzbOrg"></formAddress>
                        </n-form-item>
                      </td>
                      <th style="width: 20%; text-align: center;">项目经理<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item path="fDeptManager" class="flex-center">
                          <formAddress :fElement="applicationModel.fDeptManager" status="edit" orgType="ORG_TYPE_PERSON"
                            :limitRange="[applicationModel.fDept]" @searchModal="afterChangeDeptManager()">
                          </formAddress>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 20%; text-align: center;">项目组成员</th>
                      <td style="width: 35%;" class="tdleft" colspan="3">
                        <n-form-item label="" path="fProjectMembers" class="flex-center">
                          <formAddress :fElements="applicationModel.fProjectMembers" status="edit"
                            orgType="ORG_TYPE_PERSON" multi :limitRange="[applicationModel.fDept]"
                            :exCludes="[applicationModel.fDeptManager.fId]"></formAddress>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 20%; text-align: center;">项目性质<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item path="selectedNature" class="flex-center">
                          <n-space vertical>
                            <n-checkbox-group v-model:value="selecteds.selectedNature"
                              @update:value="handleUpdateNature">
                              <n-grid :cols="4">
                                <n-gi v-for="(item, index) in applicationModelList.fProjectNatures">
                                  <div v-show="showNature(item)">
                                    <n-tooltip trigger="hover">
                                      <template #trigger>
                                        <n-checkbox :key="index" :value="item.fId" :label="item.fName">
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
                          <n-select v-model:value="selecteds.projectImportance" :options="importanceOptions" tag
                            :disabled="false" @update:value="handleUpdateValue" style="width: 20vw" />
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 20%; text-align: center;">征集费预算<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item label="" path="fProjectBudget" class="flex-center">
                          <n-input-group>
                            <n-input style="width:20vw" v-model:value="applicationModel.fProjectBudget"
                              :show-button="false"></n-input>
                            <n-input-group-label>人民币</n-input-group-label>
                          </n-input-group>
                        </n-form-item>
                      </td>
<!--                      <th style="width: 20%; text-align: center;">计划用汇（美元）<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item path="fPlanForeignExchange" class="flex-center">
                          <n-input-group>
                            <n-input v-model:value="applicationModel.fPlanForeignExchange" :show-button="false"
                              style="width: 20vw;"></n-input>
                            <n-input-group-label>美元</n-input-group-label>
                          </n-input-group>
                        </n-form-item>
                      </td>-->
<!--                    </tr>
                    <tr>-->
<!--                      <th style="width: 20%; text-align: center;">资金来源<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item label="" class="flex-center" path="selectedCapitalSource">
                          <n-space vertical>
                            <n-radio-group v-model:value="selecteds.capitalSource" name="radiogroup">
                              <n-space :vertical="false">
                                <n-radio v-for="option in applicationModelList.fFundingSources" :key="option.fName"
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
                            <n-input v-model:value="applicationModel.fPlanIncome" :show-button="false"
                              @update:value="changeImportance" style="width: 18vw"></n-input>
                            <n-input-group-label>元(人民币)</n-input-group-label>
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
                          <!-- <n-button text tag="a" href="" target="_blank" type="primary">开拓人：胡欣欢；(K220700038)</n-button> -->
                        </n-form-item>
                      </td>
                      <th style="width: 20%; text-align: center;">项目执行地<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item label="" class="flex-center">
                          <n-input-group>
                            <n-select v-model:value="selecteds.fCountryVal" :options="countryList" label="名称" filterable
                              @update:value="handleCountryValue" style="width: 10vw"></n-select>
                            <n-select v-model:value="selecteds.fcityVal" :options="cityList" filterable
                              :disabled="selecteds.fCountryVal !== chinaId" @update:value="handleCityValue"
                              style="width: 10vw"></n-select>
                          </n-input-group>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 20%; text-align: center;">涉密项目<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft" colspan="3">
                        <n-form-item label="" class="flex-center">
                          <n-radio-group v-model:value="applicationModel.fIsClassified">
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
                <p style="font-size: 16px; font-weight: bold; margin-top: 20px;">项目概况<span style="color: red;">*</span>
                </p>
              </n-gi>
              <n-gi span=2>
                <n-table :single-line="false">
                  <tbody>
                    <tr>
                      <th style="width: 20%; text-align: center;">项目地点<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fProjectPlace" class="flex-center">
                          <n-input v-model:value="applicationModel.fProjectPlace" style="width: 60vw;"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 20%; text-align: center;">项目类型<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item class="flex-center">
                          <n-space vertical>
                            <n-select :options="typeOptions" tag multiple v-model:value="selecteds.selectedType"
                              @update:value="updateFProjectType" style="width: 60vw"></n-select>
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
                            <n-select v-model:value="selecteds.selectedTag" :options="tagsOptions" tag multiple
                              :disabled="false" @update:value="handleTagValue" style="width: 60vw"></n-select>
                            <n-input placeholder="请输入其他标签" v-show="showOtherTagInput()" v-model:value="applicationModel.fTagOther"></n-input>
                          </n-space>
                        </n-form-item>
                      </td>
                    </tr>

                    <tr v-if="applicationModel.fScales.length > 0">
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


<!--                  2024-0919 旧版规模  -->
<!--                    <tr v-for="(typeScaleGroup, index) in applicationModel.typeScales">
                      &lt;!&ndash; 显示项目类型 &ndash;&gt;
                      <th style="width: 20%; text-align: center;">项目规模({{ typeScaleGroup[0].fMasterDataTypeId.fName
                        }})<span style="color: red;">*</span>
                      </th>
                      <td class="tdleft">
                        <n-form-item>
                          &lt;!&ndash; 遍历该类型下的每一个scale &ndash;&gt;
                          <template v-for="scale in typeScaleGroup">
                            &lt;!&ndash; 添加输入框 &ndash;&gt;
                            <n-input-group>
                              <n-input-number v-model:value="scale.value" :show-button="false"
                                :key="scale.fId"></n-input-number>
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
                <n-space justify="center" style="margin-top: 20px;">
                  <n-button type="primary" @click="check">申请</n-button>
                  <n-button type="error" @click="checkClose">清除</n-button>
                </n-space>
              </n-gi>
            </n-grid>
          </n-form>
        </n-card>
      </n-layout-content>
    </n-space>
  </n-layout>

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

  <n-modal style="width:400px;" v-model:show="subShow" preset="dialog" :mask-closable="false">
    <div>
      <n-spin size="large" :show="true" style="margin-left: 40%;">
        <template #description>
          正在提交申请...
        </template>
      </n-spin>
    </div>
  </n-modal>

</template>

<script setup>
  import {
    ref,
    defineComponent,
    h,
    reactive,
    computed,
    watch
  } from 'vue'
  import {
    useMessage,
    useDialog
  } from 'naive-ui'
  import formAddress from '@/apps/common/address/formAddress.vue'
  import attachment from '@/apps/common/attachment/attachment.vue'
  import NatrueList from '@/sys/masterData/nature/natrueList.vue'
  import Finalization_results_add from '@/apps/credentials/pre-audit/finalization-results/finalization_results_add.vue'
  import ModeList from '@/sys/masterData/mode/modeList.vue'
  import storage from '@/utils/storage.js'
  import {
    init
  } from 'echarts'
  import noRoleCard from '@/apps/common/page/noRoleCard.vue'
  import baseUrl from '@/utils/baseUrl'
  import interfaceUtilApi from '@/utils/interfaceUtil'
  import context from '@/context.js'
;
  import layout from "@/layout/layout";
  import createApi from './api'

  const currentInstance = getCurrentInstance()
  const api = createApi(currentInstance)
  const interfaceUtil = interfaceUtilApi(currentInstance)

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
      await api.oaQuestMap(reqMap).then(function(res) {
        param = res.oaQuest
      })
      const response = await api.projectSelAgr(param);

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
        content: '请求协议编号失败:' + error,
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

  // window.addEventListener('message', (event) => {
  //   const message = event.data; // 接收到的消息内容
  //   // 可以根据接收到的消息做相应处理
  // });
  const message = useMessage()
  const dialog = useDialog();
  const formRef = ref(null)

  //选中数据
  const selecteds = reactive({
    //项目重要性
    projectImportance: '',
    fCountryVal: '',
    fcityVal: '',
    selectedNature: [],
    selectedTag: [],
    selectedType: [],
    capitalSource: [],
    fProjectScale: [],
    fangAnProjectMode: {},
    projectMode: '',

  })

  const applicationModelList = reactive({
    fProjectCategory: [],
    fProjectImportance: [],
    country: [],
    city: [],
    fProjectNatures: [],
    fProjectTags: [],
    fProjectTypes: [],
    fProjectScales: [],
    fProjectModes: [],
    fFundingSources: [],
    fangAnProjectMode: {}
  })
  //国家list
  const countryList = reactive([]);
  /* form */
  const applicationModel = reactive({
    //当前处理人id
    fCurrentProcessorId: "",
    //当前处理人名称
    fCurrentProcessorName: "",
    fId: "",
    //类别
    selectedCategory: {},
    projectCategory: {},
    fName: "",
    fSimpleName: "",
    fEngName: "",
    fProtocolNo: "", //项目编号
    fDevelopInfo: "", //开拓编号
    fOwner: '',
    fCreateTime: Date.now(),
    fDept: {},
    fDeptManager: {},
    //项目组成员
    fProjectMembers: [],
    //项目预算
    fProjectBudget: '',
    //项目重要性
    selectedImportance: {},
    //项目地点
    fCountry: {},
    fCity: {},
    //项目性质
    selectedNatures: [],
    fProjectNatureOther: "",
    //项目标签
    selectedTags: [], //fang
    fTagNameArray: [],
    //项目类型
    selectedTypes: [], //fang
    //项目规模
    typeScales: [],
    fScales : [],
    fPlanForeignExchange: '',
    //资金来源
    fCapitalSource: {},
    fCapitalSourceOther: "",
    fPlanIncome: '',
    //项目模式
    fProjectMode: {},
    fProjectPlace: "",
    fIsClassified: '',
    //限制时间
    // fPublishTime: '',
    //审批意见
    fApprovalComments: "同意",
    //审核状态
    fAuditStatus: "",
    //协议编号
    fProtocolNumber: "",
    //ekp流程id
    fReviewId: "",
    //oa接口参数拼接
    oaCountry: {},
    oaCity: {},
    oaCategory: {},
    oaTypeScales: [],
    oaCapitalSource: '',
    fSubmittalTime: '',
    //报错信息：
    errInfo: [],
    fTYpes: []
  })

  //俩位小数规则
  const validateTwoDecimalPlaces = (rule, value, callback) => {
    const decimalRegex = /^\d+(\.\d{1,2})?$/; // 正则表达式，匹配最多两位小数的数字
    if (!decimalRegex.test(value)) {
      if (rule.field === 'fProjectBudget') {
        callback(new Error('征集费预算必须为数字，且最多保留两位小数'));
      /*} else if (rule.field === 'fPlanForeignExchange') {callback(new Error('计划用汇必须为数字，且最多保留两位小数'));*/
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
        trigger: ['input', 'blur']
      },
      {
        validator: validateTwoDecimalPlaces,
        trigger: 'blur'
      }
    ],
    /*fPlanForeignExchange: [{
        required: true,
        message: '计划用汇不能为空',
        trigger: 'blur'
      },
      {
        validator: validateTwoDecimalPlaces,
        trigger: 'blur'
      }
    ],*/
    fPlanIncome: [{
        required: true,
        message: '预期收入不能为空',
        trigger: 'blur'
      },
      {
        validator: validateTwoDecimalPlaces,
        trigger: 'blur'
      }
    ],
    /*selectedCapitalSource: [{
      message: "请填写其他资金来源",
      validator: function() {
        if (selectedCapitalSourceOther() && applicationModel.fCapitalSourceOther == "") {
          return false
        }
        return true
      }
    }],*/
    selectedNature: [{
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
    if (applicationModel.fPlanIncome >= 100000 && applicationModel.fPlanIncome < 200000 && selecteds
      .projectImportance == importanceId.general) {
      dialog.warning({
        title: '警告',
        content: '预期收入大于等于10万小于20万，项目重要性不能为一般项目',
        positiveText: '确定',
      })
      selecteds.projectImportance = applicationModel.selectedImportance.fId
      return;
    }
    if (applicationModel.fPlanIncome >= 200000 && selecteds.projectImportance == importanceId.general ||
      applicationModel.fPlanIncome >= 200000 && selecteds.projectImportance == importanceId.deptimprotant) {
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
  //类别选择
  const categoryUpdateValue = (value, option) => {
    applicationModel.selectedCategory = {
      fId: value
    }
    //oa 接口参数需要拼接
    applicationModel.oaCategory.fName = option.label
    applicationModel.oaCategory.fNumber = option.key
  }
  //预期收入填写改变项目重要性
  const changeImportance = (v) => {
    if (v < 100000) {
      selecteds.projectImportance = importanceId.general
      selecteds.projectImportanceName = importanceId.generalName
    } else if (v >= 100000 && v < 200000) {
      selecteds.projectImportance = importanceId.deptimprotant
      selecteds.projectImportanceName = importanceId.deptimprotantName
    } else if (v >= 200000) {
      selecteds.projectImportance = importanceId.companyimportant
      selecteds.projectImportanceName = importanceId.companyimportantName
    }
    applicationModel.selectedImportance = {
      fId: selecteds.projectImportance,
      fName: selecteds.projectImportanceName
    }
  }


  //特定值 中国
  let chinaId = ref('')
  //项目地点 国家
  const handleCountryValue = (value, option) => {
    applicationModel.fCountry = {
      fId: value
    }
    //oa 接口参数需要拼接
    applicationModel.oaCountry.fCountryNum = option.key
    applicationModel.oaCountry.fName = option.label
    applicationModel.fCountry.fCountryNum = option.key
    selecteds.fcityVal = null;
  }
  //项目地点 城市
  const handleCityValue = (value, option) => {
    applicationModel.fCity = {
      fId: value,
    }
    //oa 接口参数需要拼接
    applicationModel.oaCity.fId = option.value
    applicationModel.oaCity.fCityNum = option.key
    applicationModel.oaCity.fName = option.label
  }
  //资金来源
  const handleChange = (e, option) => {
    applicationModel.fCapitalSource = {
      fId: option.fId,
    };
    applicationModel.oaCapitalSource = option.fName
  }
  //项目标签
  const handleTagValue = (v, l) => {
    applicationModel.selectedTags = [];
    applicationModel.fTagNameArray = [];
    for (var i = 0; i < v.length; i++) {
      applicationModel.selectedTags.push({
        fId: v[i]
      })
      applicationModel.fTagNameArray.push(l[i].label)
    }
  }
  //项目性质
  const handleUpdateNature = (v) => {
    applicationModel.selectedNatures = [];
    v.forEach(fId => {
      // 在fProjectNatures中查找具有匹配fId的对象
      const selectedNature = applicationModelList.fProjectNatures.find(item => item.fId === fId);
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
    for (var i=0; i<selecteds.selectedNature.length; i++) {
      var selectedNatureId = selecteds.selectedNature[i]
      for (var j=0; j<applicationModelList.fProjectNatures.length; j++) {
        var projectNature = applicationModelList.fProjectNatures[j]
        if (projectNature.fId == selectedNatureId) {
          if (projectNature.fPreNature) {
            var hasPre = false
            for (var k=0; k<projectNature.fPreNature.split(";").length; k++) {
              if (selecteds.selectedNature.indexOf(projectNature.fPreNature.split(";")[k]) >= 0){
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
    selecteds.selectedNature = afterRemoveIds
    applicationModel.selectedNatures = afterRemoveObjs

    validateProjectNatureSelections();
    checkProjectNatureRules();
    validateLegalBidding();
  };


  //清空
  const clearSelectedNatures = () => {
    selecteds.selectedNature = [];
    applicationModel.selectedNatures = []
  };

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

  // 项目类型
  const updateFProjectType = async (v, targets) => {
    //2024-0918 项目标签与项目类型联动，选择了。。。类型的时候，项目标签可选择。。。
    applicationModelList.fProjectTags = []
    var tempSelectedTagValue = []
    var tempSelectedTagsValue = []
    var pushedTagsValue = []
    for (var i=0; i<v.length; i++) {
      var tags = allSelectValues.tags[v[i]]
      //重新填充标签可选项，和移除不可选标签项
      if (tags) {
        for (var j = 0; j < tags.length; j++) {
          if (selecteds.selectedTag.includes(tags[j].fId)) {
            tempSelectedTagValue.push(tags[j].fId)
            tempSelectedTagsValue.push({
              fId : tags[j].fId
            })
          }
          if (!pushedTagsValue.includes(tags[j].fId)) {
            applicationModelList.fProjectTags.push(tags[j])
            pushedTagsValue.push(tags[j].fId)
          }
        }
      }
    }
    selecteds.selectedTag = tempSelectedTagValue
    selecteds.selectedTags = tempSelectedTagsValue

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

    //由于项目类型和项目规模的关联关系方式变化，原数据联动取消
    /*if (v.length === 0) {
      applicationModel.typeScales = [];
      return;
    }

    selecteds.fProjectScale = targets;

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

      res.data.list.forEach(scale => temp.add(scale.fId));

      return res.data.list;
    });

    // 等待所有请求完成
    const results = await Promise.all(requests);

    results.forEach((res) => {
      let flag = true;
      applicationModel.typeScales.forEach((typeScales) => {
        if (typeScales[0].fId === res[0].fId || typeScales[1].fId === res[0].fId) {
          flag = false;
        }
      })
      if (flag) {
        applicationModel.typeScales.push(res)
      }
    })

    // 更新 typeScales
    applicationModel.typeScales = applicationModel.typeScales.filter(typeScale =>
      temp.has(typeScale[0].fId)
    );*/
  };

  //项目重要性 各个名称的id
  const importanceId = {
    //一般项目
    general: '',
    deptimprotant: '',
    companyimportant: ''
  }

  // 项目重要性
  const importanceOptions = computed(() => {
    return applicationModelList.fProjectImportance.map(item => ({
      label: item.fName, // 用作显示的文本
      value: item.fId, // 用作值绑定
    }));
  });

  // 项目类别
  const categoryOptions = computed(() => {
    applicationModelList.fProjectCategory.forEach(item => {
      if (item.fName === '方案征集') {
        applicationModel.projectCategory.fId = item.fId
      }
    })
    return applicationModelList.fProjectCategory.map(item => ({
      label: item.fNumber + '  ' + item.fName, // 用作显示的文本
      value: item.fId, // 用作值绑定
      key: item.fNumber
    }));
  });

  //项目标签
  const tagsOptions = computed(() => {
    return applicationModelList.fProjectTags.map(item => ({
      label: item.fName, // 用作显示的文本
      value: item.fId, // 用作值绑定
    }));
  });
  //资金来源
  // const fundingSources = ref(null);

  //类型选项
  const typeOptions = computed(() => {
    return applicationModelList.fProjectTypes.map(item => ({
      label: item.fName, // 用作显示的文本
      value: item.fId, // 用作值绑定
      types: item.types,
      fGroup: item.fGroup
    }));
  });

  // 城市list 生成
  const cityList = computed(() => {
    if (!selecteds.fCountryVal) return [];
    // 获取当前所选国家的所有城市
    let cities = applicationModelList.city.filter(city =>
      city.fParentId === selecteds.fCountryVal
    );
    // 分离上海
    const shanghai = cities.find(city => city.fCityNum.startsWith('310000'));
    // 分离上海的区
    const shanghaiAreas = cities.filter(city => city.fCityNum.startsWith('310') && !city.fName.startsWith('上海'));
    // 这里我们先去除上海及其区，以便于处理其他城市
    const otherCities = cities.filter(city => !city.fCityNum.startsWith('310'));
    // 重新组合列表：上海（不可选） -> 上海的区 -> 其他城市
    const resultList = [
      shanghai && {
        label: shanghai.fName,
        value: shanghai.fId,
        key: shanghai.fCityNum,
        disabled: true,
      },
      ...shanghaiAreas.map(area => ({
        label: area.fName,
        value: area.fId,
        key: area.fCityNum,
      })),
      ...otherCities.map(city => ({
        label: city.fName,
        value: city.fId,
        key: city.fCityNum,
      })),
    ];
    return resultList.filter(Boolean);
  });
  //主数据初始化查询
  const masterList = {
    NatrueList: async (url, filter) => {
      //项目性质
      await api.natureList({
        sort: ["fOrder asc"]
      }).then(result => {
        const dataList = result.data.list;
        applicationModelList.fProjectNatures.value = [];
        for (let i = 0; i < dataList.length; i++) {
          const obj = {
            fName: dataList[i].fName,
            fId: dataList[i].fId,
            fNote: dataList[i].fNote,
            fPreNature: dataList[i].fPreNature
          };
          applicationModelList.fProjectNatures.push(obj);
        }
      }).catch(err => {
        console.log(err)
      });
    },
    //项目重要性
    importanceList: async (url, filter) => {
      await api.importanceList().then(result => {
        const dataList = result.data.list;
        applicationModelList.fProjectImportance.value = [];
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
          applicationModelList.fProjectImportance.push(obj);
        }
      }).catch(err => {
        console.log(err)
      });
    },

    //资金来源
    fundList: async (url, filter) => {
      await api.fundList().then(result => {
        const dataList = result.data.list;
        applicationModelList.fFundingSources.value = [];
        for (let i = 0; i < dataList.length; i++) {
          const obj = {
            fName: dataList[i].fName,
            fId: dataList[i].fId,
          };
          applicationModelList.fFundingSources.push(obj);
        }
      }).catch(err => {
        console.log(err)
      });
    },

    //项目模式
    ModeList: async (url, filter) => {
      await api.modeList().then(result => {
        const dataList = result.data.list;
        applicationModelList.fProjectModes.value = [];
        for (let i = 0; i < dataList.length; i++) {
          if (dataList[i].fName == '方案征集') {
            selecteds.projectMode = dataList[i].fId

            selecteds.fangAnProjectMode.fId = dataList[i].fId
            selecteds.fangAnProjectMode.fName = dataList[i].fName

            applicationModel.fProjectMode.fId = dataList[i].fId
            applicationModel.fProjectMode.fName = dataList[i].fName

          }
          const obj = {
            fName: dataList[i].fName,
            fId: dataList[i].fId,
          };
          applicationModelList.fProjectModes.push(obj);
        }
      }).catch(err => {
        console.log(err)
      });
    },



    //项目标签
    tagList: async (url, filter) => {
      await api.tagList().then(result => {
        const dataList = result.data.list;
        applicationModelList.fProjectTags.value = [];
        for (let i = 0; i < dataList.length; i++) {
          const obj = {
            fName: dataList[i].fName,
            fId: dataList[i].fId
          };
          applicationModelList.fProjectTags.push(obj);
        }
      }).catch(err => {
        console.log(err)
      });
    },

    //国家 执行地
    countryList: async () => {
      api.countryList().then(result => {
        const dataList = result.data.list;
        applicationModelList.country.value = [];
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
        applicationModelList.city.value = [];
        for (let i = 0; i < dataList.length; i++) {
          if (dataList[i].fParentId != null) {
            const obj = {
              fParentId: dataList[i].fParentId.fId,
              fName: dataList[i].fName,
              fId: dataList[i].fId,
              fCityNum: dataList[i].fCityNum
            };
            applicationModelList.city.push(obj);
          }
        }
      });
    },
    //项目类型
    typeList: async (url, filter) => {
      await api.typeList().then(result => {
        const dataList = result.data.list;
        applicationModelList.fProjectTypes.value = [];
        for (let i = 0; i < dataList.length; i++) {
          const obj = {
            fName: dataList[i].fName,
            fId: dataList[i].fId
          };
          applicationModelList.fProjectTypes.push(obj);
        }
      }).catch(err => {
        console.log(err)
      });
    },

    //项目规模
    scaleList: async (url, filter) => {
      await api.scaleList().then(result => {
        const dataList = result.data.list;
        applicationModelList.fProjectScales.value = [];
        for (let i = 0; i < dataList.length; i++) {
          const obj = {
            fName: dataList[i].fName,
            fId: dataList[i].fId
          };
          applicationModelList.fProjectScales.push(obj);
        }
      }).catch(err => {
        console.log(err)
      });
    },

    //项目类别
    categoryList: async (url, filter) => {
      await api.categoryList().then(result => {
        const dataList = result.data.list;
        applicationModelList.fProjectCategory.value = [];
        for (let i = 0; i < dataList.length; i++) {
          const obj = {
            fName: dataList[i].fName,
            fId: dataList[i].fId,
            fNumber: dataList[i].fNumber
          };
          applicationModelList.fProjectCategory.push(obj);
        }
      }).catch(err => {
        console.log(err)
      });
    },

    //初始化fid
    init: async () => {
      await api.projectMainInit().then(result => {
        applicationModel.fId = result.data.fId;
      })
    },
  }

  onMounted(async () => {
    getPosition();
    masterList.NatrueList();
    masterList.importanceList();
    masterList.fundList();
    // masterList.tagList();
    await masterList.countryList();
    masterList.typeList();
    masterList.ModeList();
    masterList.scaleList();
    masterList.categoryList();
    masterList.init();
    //读取类型标签，类型规模对应关系
    loadAllTypeTag()
    loadTypeGroup()
    // getLoginId();
  })
  //当前登录人id
  const userId = context.user()
  //职位
  const position = ref("")
  //部门经理Id
  let DeptManagerId;
  //当前登录人的身份
  const identity = ref("")
  //当前页面url
  const currentUrl = window.location.href;
  //获取部门经理
  const getPosition = async () => {
    //获取当前登录人对象
    const positionResult = await api.personLoad({fId:userId});
    identity.value = positionResult.data.fEkpUserType;
    const deptId = positionResult.data.fParent.fId;
    applicationModel.fDept.fId = deptId;
    applicationModel.fDept.fName = positionResult.data.fParent.fName;
    const deptManagerListResult = await api.deptManagerList( {
      query: {
        "and": [{
          "eq": {
            "fDeptId": applicationModel.fDept.fId
          }
        }, {
          "eq": {
            "fRoleKey": '1'
          }
        }]
      }
    });
    //判断是否存在部门经理
    if (deptManagerListResult.data.list.length !== 0) {
      DeptManagerId = deptManagerListResult.data.list[0].fDeptManagerId;
      applicationModel.fCurrentProcessorId = deptManagerListResult.data.list[0].fDeptManagerId;
    }
  }

  const innerCHeckStatus = ref()
  //oa内网校验/提交 接口
  async function innerNetCheck(flag, check) {

    const result = await interfaceUtil.projectMainCheck(flag, check, applicationModel)
    if (result.STATUS == "E") {
      applicationModel.errInfo.push(result.MESSAGE)
    }
    innerCHeckStatus.value = result

  }

  //ekp发起流程
  async function startEkpProcess() {
    const addReviewJson = {}
    const formValues = {
      "fd_project_department": {
        Id: applicationModel.fDept.fId
      },
      "fd_pm_id": applicationModel.fId
    }
    addReviewJson.formValues = formValues
    addReviewJson.creatorId = userId;
    addReviewJson.docSubject = applicationModel.fName;
    addReviewJson.fdTemplateId = '190e7eb7e4669ec8f3f9a6c466e808a9'
    addReviewJson.fdTemplateKey = 'ekpProjectApprovalTemplateId'
    await api.addReview(addReviewJson).then(result => {
      if (result.result.success == true) {
        applicationModel.fReviewId = result.result.message
      } else {
        applicationModel.errInfo.push("发起流程出错，请重试")
        applicationModel.fReviewId = "";
      }
    }).catch(err => {
      applicationModel.errInfo.push("发起流程出错，请重试")
      applicationModel.fReviewId = "";
    });
  }

  //提交动画
  const subShow = ref(false);
  //提交校验
  async function check() {
    //提交动画开始
    subShow.value = true
    //清空错误信息
    applicationModel.errInfo.length = 0
    try {
      await formRef.value.validate();
    } catch (errors) {
      subShow.value = false
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
      if (applicationModel.fProjectBudget == '') {
        applicationModel.errInfo.push("请填写征集费预算!");
      }
      /*if (applicationModel.fPlanForeignExchange == '') {
        applicationModel.errInfo.push("请填写计划用汇!");
      }*/
      if (applicationModel.fPlanIncome == '') {
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
      if (selecteds.selectedNature.length == 0) {
        applicationModel.errInfo.push("项目性质未选择!");
      }
      if (selecteds.projectImportance == '') {
        applicationModel.errInfo.push("项目重要性未选择!");
      }
      /*if (selecteds.capitalSource == '') {
        applicationModel.errInfo.push("资金来源未选择!");
      }*/
      if (selecteds.fCountryVal == '' || (selecteds.fCountryVal == chinaId && selecteds.fcityVal == null)) {
        applicationModel.errInfo.push("项目执行地未选择!");
      }
      if (selecteds.selectedTag.length == 0 && tagsOptions.value.length > 0) {
        applicationModel.errInfo.push("项目标签未选择!");
      }
      if (showOtherTagInput() && applicationModel.fTagOther == "") {
        applicationModel.errInfo.push("项目其他标签不能为空！");
      }
      if (selecteds.selectedType.length == 0) {
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
      query.push({
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
      })
      const response = await api.projectMainList({
        query: query
      });
      const dataList = response.data.list;
      if (dataList.length > 0) {
        applicationModel.errInfo.push("项目名称重复，项目简称重复，英文名称重复，请检查项目信息!");
      }
      //内网校验前 如果已经有填写错误 先提醒
      if (applicationModel.errInfo.length > 0) {
        subShow.value = false
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
        return;
      }
      // 内网校验
      await innerNetCheck("add", true);
      if (innerCHeckStatus.value.STATUS != 'S') {
        subShow.value = false
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
        return;
      }
      //页面校验都通过了 进行提交步骤
      if (applicationModel.errInfo.length == 0) {
        if (DeptManagerId == userId) { //部门经理直接创建
          await innerNetCheck("add", false) //添加记录到内网
          if (innerCHeckStatus.value.STATUS != 'S') {
            subShow.value = false
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
            return;
          }
          applicationModel.fAuditStatus = "1"
          applicationModel.fProtocolNo = innerCHeckStatus.value.f_protocol_no;
          await submit();
        } else { //非部门经理发起流程
          applicationModel.fAuditStatus = "0"
          await startEkpProcess(); //发起ekp流程
          applicationModel.fSubmittalTime = Date.now();
          if (applicationModel.fReviewId != "" && applicationModel.fReviewId != null) {
            await submit()
          } else {
            subShow.value = false
            dialog.warning({
              title: '警告',
              content: '发起流程失败、无法提交申请！',
              positiveText: '确定',
            })
          }
        }
      } else {
        subShow.value = false
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
      }
    } catch (err) {
      subShow.value = false
      console.log(err)
    }
  }
  //提交方法
  async function submit() {
    try {
      await api.applicationSave(undefined, applicationModel);
      //关闭提交动画
      subShow.value = false;
      // 请求成功时执行的代码
      layout.close('project-number-application');
      setTimeout(() => {
        layout.open({
          label: "成功页面",
          key: "actionSuccess",
          component: "/apps/common/successPage.vue"
        });
      }, 500);
    } catch (error) {
      // 错误处理
      subShow.value = false
      console.error(error);
    }
  }
  //清除方法
  function close() {
    applicationModel.fName = '',
      applicationModel.fEngName = '',
      applicationModel.fSimpleName = '',
      selecteds.selectedNature = [],
      selecteds.projectImportance = '',
      applicationModel.fProjectBudget = '',
      applicationModel.fPlanIncome = '',
      applicationModel.fPlanForeignExchange = '',
      selecteds.capitalSource = {},
      selecteds.fCountryVal = '',
      selecteds.fcityVal = '',
      applicationModel.fIsClassified = '',
      applicationModel.fProjectPlace = '',
      selecteds.selectedType = [],
      selecteds.selectedTag = [],
      applicationModel.typeScales = [],
      applicationModel.fProjectMembers = [],
      applicationModel.fDept = {
        fName: '',
        fId: ''
      },
      applicationModel.fDeptManager = {
        fName: '',
        fId: ''
      },
      message.success("清除成功")
  }
  //清除确认
  const checkClose = () => {
    dialog.warning({
      title: '警告',
      content: '是否清除表单数据？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        close();
      }
    })
  }

  /* 监听部门值的变化，变化时清空部门主管和项目组成员 */
  watch(applicationModel.fDept, async (newVal, oldVal) => {
    applicationModel.fDeptManager.fId = ""
    applicationModel.fDeptManager.fName = ""
    applicationModel.fProjectMembers.length = 0
    //部门经理 变为 审批人
    const deptManagerListResult = await api.deptManagerList({
      query: {
        "and": [{
          "eq": {
            "fDeptId": applicationModel.fDept.fId
          }
        }, {
          "eq": {
            "fRoleKey": '1'
          }
        }]
      }
    });
    //判断是否存在部门经理
    if (deptManagerListResult.data.list.length !== 0) {
      DeptManagerId = deptManagerListResult.data.list[0].fDeptManagerId;
      applicationModel.fCurrentProcessorId = deptManagerListResult.data.list[0].fDeptManagerId;
    }
  }, {
    deep: true
  })

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

  function loadAllTypeTag(){
    api.typeTageList().then(function(res){
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
  .tdcenter {
    text-align: center
  }

  .tdleft {
    text-align: left
  }

  .flex-center {
    display: flex;
    flex-wrap: wrap;
    /* align-items: center;   */
  }

  td,
  th {
    padding: 5px;
    /* 或者更小的值，根据你的需要调整 */
  }
</style>
