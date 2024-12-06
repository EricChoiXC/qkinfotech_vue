<template>
  <n-space vertical size="large">
    <n-layout>
      <n-layout-header>
        <!-- <n-space justify="right">
					<n-button type="primary" v-if="!editStatus" @click="editStatus = true">编辑</n-button>
					<n-button type="primary" v-if="editStatus" @click="editStatus = false">确认</n-button>
					<n-button type="error">关闭</n-button>
				</n-space> -->
      </n-layout-header>
      <n-layout-content>
       <n-card>
         <n-form ref="formRef" :model="applicationModel" label-placement="" label-width="150px">
           <n-grid :cols="2">
             <n-gi :span="2">
               <p style="font-size: 16px; font-weight: bold;">基本信息</p>
             </n-gi>
             <n-gi :span="2">
               <n-table :single-line="false">
                 <tbody>
                   <tr>
                     <td style="width: 15%;" class="tdcenter">项目编号</td>
                     <td style="width: 35%;" class="tdleft">
                       项目审批通过后自动生成
                     </td>
                     <td style="width: 15%;" class="tdcenter">类别</td>
                     <td style="width: 35%;" class="tdleft">
                       <n-form-item>
                         <n-input v-model:value="applicationModel.fProjectCategory" disabled></n-input>
                       </n-form-item>
                     </td>
                   </tr>
                   <tr>
                     <td style="width: 15%;" class="tdcenter">项目名称</td>
                     <td style="width: 35%;" class="tdleft" colspan="3">
                       <n-form-item>
                         <n-input v-model:value="applicationModel.fName"></n-input>
                       </n-form-item>
                     </td>
                   </tr>
                   <tr>
                     <td style="width: 15%;" class="tdcenter">项目简称</td>
                     <td style="width: 35%;" class="tdleft" colspan="3">
                       <n-form-item label="">
                         <n-input v-model:value="applicationModel.fSimpleName"></n-input>
                       </n-form-item>
                     </td>
                   </tr>
                   <tr>
                     <td style="width: 15%;" class="tdcenter">英文名称</td>
                     <td style="width: 35%;" class="tdleft" colspan="3">
                       <n-form-item label="">
                         <n-input v-model:value="applicationModel.fEngName"></n-input>
                       </n-form-item>
                     </td>
                   </tr>
                   <tr>
                     <td style="width: 15%;" class="tdcenter">业主</td>
                     <td style="width: 35%;" class="tdleft" colspan="3">
                       <n-form-item label="">
                         <formAddress :fElement="applicationModel.fOwner" multi status="edit"></formAddress>
                       </n-form-item>
                     </td>
                   </tr>
                   <tr>
                     <td style="width: 15%;" class="tdcenter">项目模式</td>
                     <td style="width: 35%;" class="tdleft">
                       <n-form-item label="">
                         <n-radio-group v-model:value="applicationModel.fProjectMode">
                           <n-space>
                             <n-radio value="1" :disabled="true">方案征集</n-radio>
                           </n-space>
                         </n-radio-group>
                       </n-form-item>
                     </td>
                     <td style="width: 15%;" class="tdcenter">登记日期</td>
                     <td style="width: 35%;" class="tdleft">
                       <n-form-item label="">
                         <n-date-picker v-model:value="applicationModel.fCreateTime" :disabled="true"
                           type="date"></n-date-picker>
                       </n-form-item>
                     </td>
                   </tr>
                   <tr>
                     <td style="width: 15%;" class="tdcenter">部门</td>
                     <td style="width: 35%;" class="tdleft">
                       <n-form-item label="">
                         <formAddress :fElement="applicationModel.fDept" status="edit"></formAddress>
                       </n-form-item>
                     </td>
                     <td style="width: 15%;" class="tdcenter">项目经理</td>
                     <td style="width: 35%;" class="tdleft">
                       <n-form-item label="">
                         <formAddress :fElement="applicationModel.fManager" status="edit"></formAddress>
                       </n-form-item>
                     </td>
                   </tr>
                   <tr>
                     <td style="width: 15%;" class="tdcenter">项目组成员</td>
                     <td style="width: 35%;" class="tdleft" colspan="3">
                       <n-form-item label="">
                         <formAddress :fElement="applicationModel.fProjectManagers" status="edit" multi></formAddress>
                       </n-form-item>
                     </td>
                   </tr>
                   <tr>
                     <td style="width: 15%;" class="tdcenter">项目性质</td>
                     <td style="width: 35%;" class="tdleft">
                       <n-form-item label="">
                         <n-space vertical>
                           <n-checkbox-group v-model:value="applicationModel.fProjectNature">
                             <n-checkbox value="1">机电国内</n-checkbox>
                             <n-checkbox value="2">建设进场</n-checkbox>
                             <n-checkbox value="3">建设非进场</n-checkbox>
                             <n-checkbox value="4">设备监理</n-checkbox>
                             <n-checkbox value="5">地方政采</n-checkbox>
                             <n-checkbox value="6">中央政采项目</n-checkbox>
                             <n-checkbox value="7">财政非政采</n-checkbox>
                             <n-checkbox value="8">贷款项目</n-checkbox>
                             <n-checkbox value="9">自筹资金项目</n-checkbox>
                             <n-checkbox value="10">小型工程</n-checkbox>
                             <n-checkbox value="11">生产工艺设施</n-checkbox>
                             <n-checkbox value="0">其他</n-checkbox>
                           </n-checkbox-group>
                           <n-input v-if="applicationModel.fProjectNature.indexOf('0') >=0" style="width: 90%;"
                             placeholder="其他"></n-input>
                         </n-space>
                       </n-form-item>
                     </td>
                     <td style="width: 15%;" class="tdcenter">项目重要性</td>
                     <td style="width: 35%;" class="tdleft">
                       <n-form-item label="">
                         <n-select v-model:value="applicationModel.fProjectImportance" :options="importances" tag
                           :disabled="true"></n-select>
                       </n-form-item>
                     </td>
                   </tr>
                   <tr>
                     <td style="width: 15%;" class="tdcenter">征集费预算</td>
                     <td style="width: 35%;" class="tdleft" colspan="3">
                       <n-form-item label="">
                         <n-input-number style="width:70%" v-model:value="applicationModel.fProjectBudget"
                           :show-button="false"></n-input-number>人民币
                       </n-form-item>
                     </td>
                   </tr>
                   <tr>
                     <td style="width: 15%;" class="tdcenter">资金来源</td>
                     <td style="width: 35%;" class="tdleft">
                       <n-form-item label="">
                         <n-grid :cols="3">
                           <n-gi>
                             <n-radio :checked="applicationModel.fFundingSource === '1'" value="1" name="自筹资金"
                               @change="handleChange">
                               自筹资金
                             </n-radio>
                           </n-gi>
                           <n-gi>
                             <n-radio :checked="applicationModel.fFundingSource === '2'" value="2" name="国内政府资金"
                               @change="handleChange">
                               国内政府资金
                             </n-radio>
                           </n-gi>
                           <n-gi>
                             <n-radio :checked="applicationModel.fFundingSource === '3'" value="3" name="世界银行贷款"
                               @change="handleChange">
                               世界银行贷款
                             </n-radio>
                           </n-gi>
                           <n-gi>
                             <n-radio :checked="applicationModel.fFundingSource === '4'" value="4" name="亚洲开发银行贷款"
                               @change="handleChange">
                               亚洲开发银行贷款
                             </n-radio>
                           </n-gi>
                           <n-gi>
                             <n-radio :checked="applicationModel.fFundingSource === '5'" value="5" name="国外政府贷款"
                               @change="handleChange">
                               国外政府贷款
                             </n-radio>
                           </n-gi>
                           <n-gi>
                             <n-radio :checked="applicationModel.fFundingSource === '0'" value="0" name="其他"
                               @change="handleChange">
                               其他
                             </n-radio>
                           </n-gi>
                           <n-gi span="3" v-if="applicationModel.fFundingSource === '0'">
                             <n-input></n-input>
                           </n-gi>
                         </n-grid>
                       </n-form-item>
                     </td>
                     <td style="width: 15%;" class="tdcenter">预期收入</td>
                     <td style="width: 35%;" class="tdleft">
                       <n-form-item label="">
                         <n-input-number v-model:value="applicationModel.fPlanIncome" :show-button="false"
                           @update:value="changeImportance"></n-input-number>元（人民币）
                       </n-form-item>
                     </td>
                   </tr>
                   <tr>
                     <td style="width: 15%;" class="tdcenter">开拓信息</td>
                     <td style="width: 35%;" class="tdleft">
                       <n-form-item label="">
                         <n-button text tag="a" href="" target="_blank" type="primary">开拓人：胡欣欢；(K220700038)</n-button>
                       </n-form-item>
                     </td>
                     <td style="width: 15%;" class="tdcenter">项目执行地</td>
                     <td style="width: 35%;" class="tdleft">
                       <n-form-item label="">
                         <n-input-group>
                           <n-select v-model:value="applicationModel.fcountryVal" :options="country"></n-select>
                           <n-select v-model:value="applicationModel.fcityVal"
                             :disabled="applicationModel.fcountryVal != 'CHN'" :options="city"></n-select>
                         </n-input-group>
                       </n-form-item>
                     </td>
                   </tr>
                   <tr>
                     <td style="width: 15%;" class="tdcenter">涉密项目</td>
                     <td style="width: 35%;" class="tdleft" colspan="3">
                       <n-form-item label="">
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
               <p style="font-size: 16px; font-weight: bold;">项目概况</p>
             </n-gi>
             <n-gi span=2>
               <n-table :single-line="false">
                 <tbody>
                   <tr>
                     <td style="width: 15%;" class="tdcenter">项目地点</td>
                     <td style="width: 35%;" class="tdleft">
                       <n-form-item>
                         <n-input v-model:value="applicationModel.fPlace"></n-input>
                       </n-form-item>
                     </td>
                   </tr>
                   <tr>
                     <td style="width: 15%;" class="tdcenter">项目类型</td>
                     <td style="width: 35%;" class="tdleft">
                       <n-form-item>
                         <n-select :options="options" tag multiple v-model:value="applicationModel.fProjectType"
                           @update:value="updateFProjectType"></n-select>
                       </n-form-item>
                     </td>
                   </tr>
                   <tr>
                     <td style="width: 15%;" class="tdcenter">项目标签</td>
                     <td style="width: 35%;" class="tdleft">
                       <n-form-item>
                         <n-select :options="options" tag multiple
                           v-model:value="applicationModel.fProjectTags"></n-select>
                       </n-form-item>
                     </td>
                   </tr>
                   <tr v-for="fProjectScale in applicationModel.fProjectScale">
                     <td style="width: 15%;" class="tdcenter">项目规模({{fProjectScale.label}})</td>
                     <td style="width: 35%;" class="tdleft">
                       <n-form-item>
                         <div style="display: block;">
                           <n-input-group v-for="t in fProjectScale.types">
                             <n-input-number v-model:value="t.value" :show-button="false"></n-input-number>
                             <n-input-group-label>{{t.unit}}</n-input-group-label>
                           </n-input-group>
                         </div>
                       </n-form-item>
                     </td>
                   </tr>
                 </tbody>
               </n-table>
             </n-gi>
             <n-gi span=2>
               <n-space justify="center">
                 <n-button type="primary" @click="submit">同意</n-button>
                 <n-button type="error" @click="close">拒绝</n-button>
               </n-space>
             </n-gi>
           </n-grid>
         </n-form>
       </n-card>
      </n-layout-content>
    </n-layout>
  </n-space>

</template>

<script setup>
  import {
    ref,
    defineComponent,
    h,
    reactive
  } from 'vue'
  import {
    useMessage
  } from 'naive-ui'
  import formAddress from '@/apps/common/address/formAddress.vue'
  import attachment from '@/apps/common/attachment/attachment.vue'


  const editStatus = ref(false)

  const countryVal = ref("")
  const country = reactive([{
    label: '中国',
    value: 'CHN'
  }, {
    label: '英国',
    value: 'UK'
  }, {
    label: '美国',
    value: 'USA'
  }, {
    label: '德国',
    value: 'd'
  }, {
    label: '澳大利亚',
    value: 'a'
  }])
  const city = reactive([{
    label: '北京',
    value: 'BJ'
  }, {
    label: '上海',
    value: 'SH',
    disabled: true
  }, {
    label: '黄埔区',
    value: 'huangpu',
  }, {
    label: '静安区',
    value: 'jingan',
  }, {
    label: '长宁区',
    value: 'changning',
  }, {
    label: '浦东新区',
    value: 'pudong',
  }, {
    label: '江西省',
    value: 'jx',
  }, {
    label: '广东省',
    value: 'gd',
  }, {
    label: '湖北省',
    value: 'hb',
  }])

  /* form */
  const applicationModel = reactive({
    fProjectCategory: "16 方案征集类",
    fName: "金桥副中心中央公园综合体国际方案征集",
    fSimpleName: "中央公园综合体",
    fEngName: "International Scheme Solicitation for Jingiao Sub-center Central Park Complex (Landscape Group)",
    fOwner: [{
      fId: "1",
      fName: "上海金桥（集团）有限公司"
    }],
    fCreateTime: Date.now(),
    fDept: {
      fId: "1",
      fName: "项目七部"
    },
    fManager: {
      fId: "1",
      fName: "胡欣欢"
    },
    fProjectManagers: [],
    fProjectNature: ["9"],
    fInvestmentBudget: 0,
    fProjectBudget: 3000000,
    fFundingSource: "1",
    fPlanForeginExchange: 0,
    fCapitalSource: "",
    fPlanIncome: 150000,
    fcountryVal: "CHN",
    fcityVal: "pudong",
    fTypical: "",
    fDevelopInfo: "",
    fProjectMode: "1",
    fPlace: "",
    fIsClassified: true,
    fExecutionLocation: "",
    fProjectImportance: "2",
    fProjectType: [],
    fProjectTags: [],
    fProjectScale: [],
    fProjectPackage: []
  })
  const formRef = ref(null)
  const now = (new Date()).getTime()

  /* 选择框演示数据项 */
  const importances = reactive([{
    value: '1',
    label: "一般项目"
  }, {
    value: '2',
    label: "部门重点"
  }, {
    value: '3',
    label: "公司重点"
  }])
  /* 选择框演示数据项 */
  const options = reactive([{
    label: '城市设计',
    value: '1',
    types: [{
      val: "",
      unit: "建筑面积（平方米）"
    }, {
      val: "",
      unit: "高度（米）"
    }]
  }, {
    label: '规划类',
    value: '2',
    types: [{
      val: "",
      unit: "研究范围（平方千米）"
    }, {
      val: "",
      unit: "核心范围（平方千米）"
    }]
  }, {
    label: '测试3',
    value: '3',
    types: [{
      val: "",
      unit: "研究范围（平方千米）"
    }]
  }, {
    label: '测试4',
    value: '4',
    types: [{
      val: "",
      unit: "研究范围（平方千米）"
    }]
  }, {
    label: '测试5',
    value: '5',
    types: [{
      val: "",
      unit: "研究范围（平方千米）"
    }]
  }])

  /* 附件演示数据 */
  const items = ref([{
    fName: "文件1.txt"
  }, {
    fName: "文件2.doc"
  }])
  const items2 = ref([{
    fName: "文件3.ppt"
  }, {
    fName: "文件4.pptx"
  }])
  const items3 = ref([{
    fName: "文件5.xls"
  }])
  const items4 = ref([{
    fName: "文件6.img"
  }])


  const message = useMessage()

  function updateFProjectType(vals, targets) {
    var newVals = []
    // 1.先将已填写的数据暂存进options中
    for (var i = 0; i < applicationModel.fProjectScale.length; i++) {
      var temp = applicationModel.fProjectScale[i]
      for (var j = 0; j < options.length; j++) {
        if (options[j].value == temp.value) {
          options[j].types = temp.types
        }
      }
    }
    // 2.再将新添加数据取出到fProjectScale中
    applicationModel.fProjectScale = targets
  }

  function submit() {
    message.info("submit")
  }

  function draftSave() {
    message.info("draftSave")
  }

  function close() {
    message.info("close")
  }
  const handleChange = (e) => {
    applicationModel.fFundingSource = e.target.value;
  }

  const changeImportance = (v) => {
    //项目重要性条件：一般项目:预期收入小于10万，部门重点：预期收入大于等于10万，小于20，公司重点：大于等于20万
    if (v < 100000) {
      applicationModel.fProjectImportance = "1"
    } else if (v >= 100000 && v < 200000) {
      applicationModel.fProjectImportance = "2"
    } else if (v >= 200000) {
      applicationModel.fProjectImportance = "3"
    } else {
      applicationModel.fProjectImportance = ""
    }
  }
</script>

<style>
</style>
