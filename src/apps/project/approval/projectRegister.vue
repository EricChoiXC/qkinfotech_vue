<template>
  <n-form ref="formRef" :model="projectModel" label-placement="" label-width="150px">
    <n-grid :cols="2" y-gap="10">
      <n-gi :span="2">
        <p style="font-size: 24px; font-weight: bold;">项目登记</p>
      </n-gi>
      <n-gi :span="2">
        <n-space>
          <p style="font-size: 16px; font-weight: bold;">基本信息</p>
          <n-button type="primary" @click="adminEdit" text>修改</n-button>
          <n-button type="primary" @click="adminModal" text>管理</n-button>
        </n-space>
      </n-gi>
    </n-grid>
    <n-table :single-line="false">
      <tbody>
        <tr>
          <td style="width: 20%;" class="tdcenter">项目编号</td>
          <td style="width: 30%;" class="tdleft">
            {{ projectModel.fProjectNo }}
          </td>
          <td style="width: 20%;" class="tdcenter">类别</td>
          <td style="width: 30%;" class="tdleft">
            {{ projectModel.fProjectCategory.fNumber + " " + projectModel.fProjectCategory.fName }}
          </td>
        </tr>
        <tr>
          <td class="tdcenter">项目名称</td>
          <td class="tdleft">
            {{ projectModel.fName }}
          </td>
          <td class="tdcenter">项目简称</td>
          <td class="tdleft">
            {{ projectModel.fSimpleName }}
          </td>
        </tr>
        <tr>
          <td class="tdcenter">英文名称</td>
          <td class="tdleft">
            <div v-if="!edit">{{ projectModel.fEngName }}</div>
            <n-input v-if="edit" :value="projectModel.fEngName"></n-input>
          </td>
          <td class="tdcenter">业主</td>
          <td class="tdleft">
            {{ projectModel.fOwner.fName }}
          </td>
        </tr>
        <tr>
          <td class="tdcenter">项目模式</td>
          <td colspan="3" class="tdleft">
            {{ projectModel.fProjectMode.fName }}
          </td>
        </tr>
        <tr>
          <td class="tdcenter">登记日期</td>
          <td colspan="3" class="tdleft">
            {{ projectModel.fCreateTime }}
          </td>
        </tr>
        <tr>
          <td class="tdcenter">部门</td>
          <td class="tdleft">
            {{ projectModel.fDept.fName }}
          </td>
          <td class="tdcenter">项目经理</td>
          <td class="tdleft">
            {{ projectModel.fDeptManager.fName }}
          </td>
        </tr>
        <tr>
          <td class="tdcenter">项目组成员</td>
          <td colspan="3" class="tdleft">
            {{ projectModel.fProjectNumbers }}
          </td>
        </tr>
        <tr>
          <td class="tdcenter">项目性质</td>
          <td class="tdleft">
            {{ projectModel.fProjectNatureName.join(' ') }}
          </td>
          <td class="tdcenter">征集费预算</td>
          <td class="tdleft">
            {{ projectModel.fProjectBudget }} 人民币
          </td>
        </tr>
        <tr>
          <td class="tdcenter">资金来源</td>
          <td class="tdleft">
            {{ projectModel.fCapitalSource.fName }}
          </td>
        </tr>
        <tr>
          <td class="tdcenter">预期收入</td>
          <td class="tdleft">
            {{ projectModel.fPlanIncome }}元（人民币）
          </td>
          <td class="tdcenter">开拓信息</td>
          <td class="tdleft">
            <n-button text tag="a" href="" target="_blank" type="primary">{{ projectModel.fDevelopInfo }}</n-button>
          </td>
        </tr>
        <tr>
          <td class="tdcenter">项目执行地</td>
          <td colspan="3" class="tdleft">
            {{ projectModel.fExecutionPlace }}
          </td>
        </tr>
        <tr>
          <td class="tdcenter">涉密项目</td>
          <td colspan="3" class="tdleft">
            {{ projectModel.fIsClassified }}
          </td>
        </tr>
        <tr>
          <td class="tdcenter">TimeSheet用时</td>
          <td colspan="3" class="tdleft">
            <n-input placeholder="TimeSheet" disabled></n-input>
          </td>
        </tr>
      </tbody>
    </n-table>


   <n-grid :cols="2" y-gap="10">
         <n-gi span=2>
           <n-space>
             <p style="font-size: 16px; font-weight: bold;">项目概况</p>
           </n-space>
         </n-gi>
         <n-gi span=2>
           <n-table :single-line="false">
             <tbody>
               <tr>
                 <td style="width:20%;" class="tdcenter">项目地点</td>
                 <td class="tdleft">
                   <n-form-item>
                     <n-input v-model:value="projectModel.fProjectPlace" :disabled="!projectModel.isEditing" />
                   </n-form-item>

                 </td>
               </tr>
               <tr>
                 <td class="tdcenter">项目类型</td>
                 <td class="tdleft">
                   <n-form-item>
                     <n-select :options="typeOptions" tag multiple v-model:value="projectModel.selectedType"
                       :disabled="!projectModel.isEditing" @update:value="updateFProjectType"></n-select>
                   </n-form-item>
                 </td>
               </tr>
               <tr>
                 <td class="tdcenter">项目标签</td>
                 <td class="tdleft">
                   <n-form-item>
                     <n-select v-model:value="projectModel.selectedTag" :options="tagsOptions" tag multiple
                       :disabled="!projectModel.isEditing" @update:value="handleTagValue"></n-select>
                   </n-form-item>
                 </td>
               </tr>
               <tr v-for="(typeScaleGroup, index) in projectModel.typeScales">
                 <!-- 显示项目类型 -->
                 <td class="tdcenter">项目规模({{ typeScaleGroup[0].fMasterDataTypeId.fName }})</td>
                 <td class="tdleft">
                   <n-form-item>
                     <!-- 遍历该类型下的每一个scale -->
                     <template v-for="scale in typeScaleGroup">
                       <!-- 添加输入框 -->
                       <n-input-group>
                         <n-input-number v-model:value="scale.value" :show-button="false"
                           :disabled="!projectModel.isEditing" :key="scale.fId"></n-input-number>
                         <!-- 添加单位 -->
                         <n-input-group-label>{{ scale.fMasterDataScaleId.fName }}</n-input-group-label>
                       </n-input-group>
                       <!-- 如果不是该类型下的最后一个scale，添加换行 -->
                       <br v-if="scale !== typeScaleGroup[typeScaleGroup.length - 1]">
                     </template>
                   </n-form-item>
                 </td>
               </tr>
               <tr>
                 <td class="tdcenter">包件信息</td>
                 <td class="tdleft">
                   <!-- {{ joinPackageNames(projectModel.fPackage) }} -->
                   <!-- <n-select v-model:value="packageArray" multiple :options="fPackageOption"  /> -->
                    <div class="single-line-tags">
                    <n-tag v-for="(item, index) in fPackageOption" :key="item.value" >{{ item.label }}</n-tag>
                   </div>
                   <div style="display: flex;">
                     <!-- 其他内容 -->
                     <n-button style="margin-left: auto;" @click="addPackage">修改</n-button>
                   </div>

                 </td>
               </tr>
             </tbody>
           </n-table>
         </n-gi>


      <n-gi span=2>
        <p style="font-size: 16px; font-weight: bold;">附件上传</p>
      </n-gi>
      <n-gi span=2>
        <n-table :single-line="false">
          <tbody>
            <tr>
              <td style="width:20%;" class="tdcenter">项目建议书</td>
              <td class="tdleft">
                <n-form-item>
                  <sitc-attachment status="edit" :files="items" title="项目建议书" :linkPackage="true"></sitc-attachment>
                </n-form-item>
              </td>
            </tr>
            <tr>
              <td style="width:20%;" class="tdcenter">前期资料</td>
              <td class="tdleft">
                <n-form-item>
                  <sitc-attachment status="edit" :files="items2" title="前期资料" :linkPackage="true"></sitc-attachment>
                </n-form-item>
              </td>
            </tr>
            <tr>
              <td style="width:20%;" class="tdcenter">
                工作计划<br />
                重点项目必填</td>
              <td class="tdleft">
                <n-form-item>
                  <sitc-attachment status="edit" :files="items3" title="工作计划" :linkPackage="true"></sitc-attachment>
                </n-form-item>
              </td>
            </tr>
            <tr>
              <td style="width:20%;" class="tdcenter">
                其他
              </td>
              <td class="tdleft">
                <n-form-item>
                  <sitc-attachment status="edit" :files="items4" title="其他" :linkPackage="true"></sitc-attachment>
                </n-form-item>
              </td>
            </tr>
          </tbody>
        </n-table>
      </n-gi>
    </n-grid>
  </n-form>

  <n-modal v-model:show="adminModalShow" title="管理员设置" style="width:60%" preset="dialog">
    <n-table :single-line="false">
      <tbody>
        <tr>
          <td style="width: 20%;" class="tdcenter">项目编号</td>
          <td style="width: 30%;" class="tdleft">
            <n-input v-model:value="projectModel.fProjectNo"></n-input>
          </td>
        </tr>
        <tr>
          <td class="tdcenter">项目名称</td>
          <td class="tdleft">
            <n-input v-model:value="projectModel.fName"></n-input>
          </td>
        </tr>
        <tr>
          <td class="tdcenter">项目简称</td>
          <td class="tdleft">
            <n-input v-model:value="projectModel.fSimpleName"></n-input>
          </td>
        </tr>
        <tr>
          <td class="tdcenter">项目经理</td>
          <td class="tdleft">
          </td>
        </tr>
        <tr>
          <td class="tdcenter">项目组成员</td>
          <td colspan="3" class="tdleft">
          </td>
        </tr>
        <tr>
          <td class="tdcenter">限制结束日期</td>
          <td colspan="3" class="tdleft">
          </td>
        </tr>
        <tr>
          <td class="tdcenter">达标日期</td>
          <td colspan="3" class="tdleft">
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <n-space style="display: flex;justify-content: center;">
              <n-button type="primary" @click="handleSubmit">提交</n-button>
              <n-button type="error" @click="closeWindow">关闭</n-button>
            </n-space>
          </td>
        </tr>
      </tbody>
    </n-table>
  </n-modal>

  <n-modal style="width:60%" v-model:show="show" preset="dialog" title="包件修改" :mask-closable="false">
    <n-button type="primary" @click="addNewRow">新增</n-button>
    <n-data-table :columns="columns" :data="fPackageList" :pagination="pagination" />
    <n-space style="display: flex;justify-content: center;">
      <n-button type="primary" @click="actions.packageSubmit">确认</n-button>
      <n-button type="error" @click="actions.packageClose">关闭</n-button>
    </n-space>
  </n-modal>

</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import {
  ref,
  defineComponent,
  h,
  reactive,
  computed
} from 'vue'
import {
  useMessage, NButton, NDataTable, NInput, NFormItem, useDialog
} from 'naive-ui'
import sitcAttachment from '@/apps/common/attachment/SITCAttachment.vue'
import formAddress from '@/apps/common/address/formAddress.vue'
import {
  Pencil
} from '@vicons/ionicons5'
import { resolveWrappedSlotWithProps } from 'naive-ui/es/_utils'
import createApi from './api'

const api = createApi(getCurrentInstance())
const route = useRoute();
const id = route.query.fId;

const adminModalShow = ref(false)

function adminModal() {
  adminModalShow.value = true
}

const projectModel = reactive({
  fId: id,
  isEditing: false,

  fProjectNo: ref(),
  fName: '',
  fProjectCategory: "",
  fSimpleName: "",
  fEngName: "",
  fOwner: {
    fId: "1",
    fName: "上海金桥（集团）有限公司"
  },

  fProjectScale: ref([]),
  fCreateTime: '',
  fDept: {
    fName: ''
  },
  fDeptManager: {
    fName: ''
  },

  fProjectNumbers: "",

  fInvestmentBudget: 0,
  fProjectBudget: 0,
  fPlanForeignExchange: 0,
  fPlanIncome: 0,
  fTypical: '',
  fDevelopInfo: "",
  fExecutionPlace: '',
  fIsClassified: '',
  fProjectPlace: '',

  //项目重要性
  fProjectImportance: ref([]),
  selectedImportance: {},
  projectImportance: '',

  fScale: [],
  //包件信息
  fPackage: [],
  fPackageIdList: [],

  //项目性质
  selectedNature: [],
  selectedNatures: [],
  fProjectNatures: ref([]),
  fProjectNatureName: [],

  //项目模式
  fProjectMode: {},
  projectMode: '',
  fProjectModes: ref([]),



  //项目类型
  fProjectTypes: ref([]),//cun
  selectedTypes: [],//fang
  selectedType: [],//fang

  //项目执行地
  fCountryVal: '',
  country: ref([]),
  fCountry: {},
  fcityVal: '',
  city: ref([]),
  fCity: {},


  //资金来源
  fCapitalSource: {},
  capitalSource: '',
  fFundingSources: ref([]),


  //项目规模
  fProjectScale: [],
  typeScales: [],
  fProjectScales: ref([]),//cun


  //项目标签
  fProjectTags: ref([]),//cun
  selectedTags: [],//fang
  selectedTag: [],//fang
  fProjectTag: [], //名称数组



})






const joinPackageNames = (packages) => {
  return packages.map(item => item.fName).join(' ');
};
const dialog = useDialog();



//包件信息
const fPackageList = ref([])
// const data = ref(fPackageList);
// 包件信息选项
const fPackageOption = computed(() => {
  return fPackageList.value.map(item => ({
    label: item.fName, // 用作显示的文本
    value: item.fId, // 用作值绑定
  }));
});


const packageArray = ref([]);
// const idsArray = projectModel.fPackage.map(item => item.fId);

const pagination = ref({
  pageSize: 10
});

// 定义columns
const columns = [
  {
    title: "包件名称",
    key: "fName",
    render(row, index) {
      // 使用h函数创建NInput组件
      return h(NInput, {
        value: row.fName,
        onUpdateValue: (v) => {
          // 直接修改ref响应式数据
          fPackageList.value[index].fName = v;
        }
      });
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 100,
    render(row) {
      return [h(
        NButton, {
        onClick: async () => {
          dialog.warning({
            title: '警告',
            content: '是否删除包件？',
            positiveText: '确定',
            negativeText: '取消',
            onPositiveClick: async () => {
              await api.projectPackageDelete(row.fId).then(result => {
              message.success("删除成功")
              actions.packageList();
            }).catch(err => {
              console.log(err)
            });

            }
          })
        }
      }, '删除'
      ),
      ]
    },  // 使用公共函数
  }
];
// 新增方法: 添加新行
const addNewRow = () => {
  const newRow = {
    fName: '',
    fId: '',
  };
  fPackageList.value.push(newRow);
};
const closeWindow = () => {
  this.$refs.myModalRef.close();
}


const multipleSelectValue = ref([]);
const packageOptions = ref([{
  label: "",
  value: '',
  disabled: true
}]);

const formRef = ref(null)
const now = (new Date()).getTime()
const fElement = ref({
  fId: "",
  fName: "测试"
})
const isClassified = ref(true)


//项目标签  计算属性，生成选项数组
const tagsOptions = computed(() => {
  return projectModel.fProjectTags.map(item => ({
    label: item.fName, // 用作显示的文本
    value: item.fId, // 用作值绑定
  }));
});

//项目标签
const handleTagValue = (v) => {
  projectModel.selectedTags = [];
  for (var i = 0; i < v.length; i++) {
    projectModel.selectedTags.push({ fId: v[i] })
  }
}

//类型选项
const typeOptions = computed(() => {
  return projectModel.fProjectTypes.map(item => ({
    label: item.fName, // 用作显示的文本
    value: item.fId, // 用作值绑定
    types: item.types
  }));
});
// 项目类型 规模字段
// 项目类型
const updateFProjectType = async (v, targets) => {
  projectModel.selectedTypes = [];
  for (var i = 0; i < v.length; i++) {
    projectModel.selectedTypes.push({ fId: v[i] })
  }
  projectModel.fProjectScale = targets

  projectModel.selectedTypes.forEach(async item => {
    projectModel.typeScales = []
    var query = []
    query.push({
      "eq": {
        "fMasterDataTypeId.fId": item.fId
      }
    })
    await api.typeScaleList({ query: query }).then(res => {
      projectModel.typeScales.push(res.data.list)
      console.log("asd", projectModel.typeScales)
    })

  }
  );
}




/* 附件演示数据 */
const items = ref([{
  fName: "项目信息表 202308251017.pdf",
  fCreateTime: "2023-08-25"
}])
const items2 = ref([])
const items3 = ref([{
  fName: "金环中央公园综合体一-工作计划.docx",
  fCreateTime: "2023-08-23"
}])
const items4 = ref([{
  fName: "关于金桥副中心中央公园综合体国际方案征集工作的请示.docx",
  fCreateTime: "2023-08-23"
}])

const message = useMessage()

// function updateFProjectType(vals, targets) {
//   var newVals = []
//   // 1.先将已填写的数据暂存进options中
//   for (var i = 0; i < projectModel.value.fProjectScale.length; i++) {
//     var temp = projectModel.value.fProjectScale[i]
//     for (var j = 0; j < options.value.length; j++) {
//       if (options.value[j].value == temp.value) {
//         options.value[j].types = temp.types
//       }
//     }
//   }
//   // 2.再将新添加数据取出到fProjectScale中
//   projectModel.value.fProjectScale = targets
// }

const edit = ref(false)

function adminEdit() {
  message.info('管理员修改')
  projectModel.isEditing = "true"
  console.log(" projectModel.isEditing", projectModel.isEditing)
}

const extraButtons = ref([{
  label: '批量修改包件',
  click: function () {
    console.log("edits")
  },
  viewShow: true,
  editShow: true
}])
const extraLineButtons = ref([{
  label: '修改关联包件',
  click: function () {
    console.log('click')
  },
  icon: Pencil,
  tooltip: '修改关联包件',
  viewShow: true,
  editShow: true
}])

const show = ref(false);
const addPackage = () => {
  show.value = true;
}


const actions = {
  packageList: async () => {
    var query1 = []
    query1.push({ "eq": { "fMainId.fId": id } })
    await api.projectPackageList({ query: query1 }).then(res => {
      projectModel.fPackage = [];
      const dataList = res.data.list;
      packageArray.value=[]
      fPackageList.value=[]
      for (let i = 0; i < dataList.length; i++) {
        packageArray.value.push(dataList[i].fId)
        const obj = {
          fName: dataList[i].fName,
          fId:dataList[i].fId
        };
        // projectModel.fPackage.push(obj);
        fPackageList.value.push(obj)
        console.log("fPackageList", fPackageList)
      }
    })
  },
  //项目类型
  typeList: async (url, filter) => {
    await api.typeList().then(result => {
      const dataList = result.data.list;
      projectModel.fProjectTypes.value = [];
      for (let i = 0; i < dataList.length; i++) {
        const obj = {
          fName: dataList[i].fName,
          fId: dataList[i].fId
        };
        projectModel.fProjectTypes.push(obj);
      }
    }).catch(err => {
      console.log(err)
    });
  },

  //项目标签
  tagList: async (url, filter) => {
    await api.tagList().then(result => {
      const dataList = result.data.list;
      projectModel.fProjectTags.value = [];
      for (let i = 0; i < dataList.length; i++) {
        const obj = {
          fName: dataList[i].fName,
          fId: dataList[i].fId
        };
        projectModel.fProjectTags.push(obj);
      }
    }).catch(err => {
      console.log(err)
    });
  },



  //项目规模
  scaleList: async (url, filter) => {
    await api.scaleList().then(result => {
      const dataList = result.data.list;
      projectModel.fProjectScales.value = [];
      for (let i = 0; i < dataList.length; i++) {
        const obj = {
          fName: dataList[i].fName,
          fId: dataList[i].fId
        };
        projectModel.fProjectScales.push(obj);
      }
    }).catch(err => {
      console.log(err)
    });
  },

  projectInfo: async (url, filter) => {
    // const route = useRoute()
    // let id = route.query.fId;
    await api.applicationProjectView(id).then(result => {
      const data = result.data;
      projectModel.fName = data.fName
      //项目简称
      projectModel.fSimpleName = data.fSimpleName
      //项目英文名称
      projectModel.fEngName = data.fEngName
      //项目预算
      projectModel.fProjectBudget = data.fProjectBudget
      //计划用汇（美元）
      projectModel.fPlanForeignExchange = data.fPlanForeignExchange

      //涉密项目
      projectModel.fIsClassified = data.fIsClassified ? "是" : "否";

      //类别
      projectModel.projectCategory = data.fProjectCategory.fId
      projectModel.selectedCategory = { fId: data.fProjectCategory.fId }


      //项目性质
      projectModel.fProjectNatureName = data.appsNatureNameArray
      projectModel.selectedNature = data.selectedNature
      const naturesIds = data.selectedNature.map(str => ({ fId: str }));
      projectModel.selectedNatures = projectModel.selectedNatures.concat(naturesIds);

      //项目重要性
      projectModel.projectImportance = data.projectImportance
      projectModel.selectedImportance = { fId: data.projectImportance }


      //资金来源
      projectModel.capitalSource = data.capitalSource
      projectModel.fCapitalSource = data.fCapitalSource

      // //项目执行地
      projectModel.fExecutionPlace = `${data.fExecutionLocation.fParentId.fName} ${data.fExecutionLocation.fName}`;

      if (data.fExecutionLocation.fParentId == null) {
        projectModel.fCountryVal = data.fCountryVal
        projectModel.fCountry = { fId: data.fcityVal }
      } else {
        projectModel.fcityVal = data.fExecutionLocation
        projectModel.fCountryVal = data.fCountryVal
        projectModel.fCity = { fId: data.fcityVal }
        projectModel.fCountry = { fId: data.fcityVal }
      }


      //项目标签
      projectModel.fProjectTag = data.appsTagNameArray
      projectModel.selectedTag = data.selectedTag
      const tagsIds = data.selectedTag.map(str => ({ fId: str }));
      projectModel.selectedTags = projectModel.selectedTags.concat(tagsIds);


      //项目类型
      projectModel.selectedType = data.selectedType
      const typesIds = data.selectedType.map(str => ({ fId: str }));
      projectModel.selectedTypes = projectModel.selectedTypes.concat(typesIds);



      //类别
      projectModel.fProjectCategory = data.fProjectCategory

      //项目模式
      projectModel.fProjectMode = data.fProjectMode

      //项目模式
      projectModel.projectMode = data.projectMode

      //项目地点
      projectModel.fProjectPlace = data.fProjectPlace

      //项目规模
      projectModel.fProjectScale = data.fProjectScale
      //项目规模
      projectModel.typeScales = data.typeScales



      //预期收入
      projectModel.fPlanIncome = data.fPlanIncome
      projectModel.fScale = data.fProjectScale
      //项目包件
    }).catch(err => {
      console.log(err)
    });
  },

  //包件同意按钮
  packageSubmit: async () => {

    var query = []
    query.push({ "eq": { "fMainId.fId": id } })
    const res = await api.projectPackageList({ query: query })
    const List = res.data.list
    if (List && List.length > 0) {
      List.forEach(item => {
        api.projectPackageDelete({fId: item.id})
      })
    }
    const url ="/pm/apps/project/package/save"

    for (var i = 0; i < fPackageList.value.length; i++) {
      const packages = {}
      packages.fName = fPackageList.value[i].fName;
      packages.fMainId = id;

      console.log("packages")
      await api.projectPackageSave(packages);
    }
    fPackageList.value = []
    await actions.packageList(); // 重新获取包件列表数据，以便界面更新

  },
  //包件关闭按钮
  packageClose: () => {
    show.value = false;
    actions.packageList();
    // const url = `/opdesk/projectManagement/implementation/project-view?fId=${encodeURIComponent(row.fId)}`;
    //     window.open(url);

  },
  viewItem: async (row) => {
  },
}




async function handleSubmit() {

  var query = [];
  query.push({ "or": [{ "eq": { "fName": projectModel.fName } }, { "eq": { "fSimpleName": projectModel.fSimpleName } }, { "eq": { "fEngName": projectModel.fEngName } }, { "eq": { "fId": id } }] })
  try {
    const response = await api.projectMainList({ query: query });
    const dataList = response.data.list;
    if (dataList.length > 1) {
      message.error("项目重复，请查看项目信息");
    }

    await api.applicationSave(id,projectModel)
    message.info("submit");
  } catch (error) {
    // 在这里处理错误，比如记录日志或给用户反馈
    console.error("提交失败:", error.message);
    // 这里可以选择是否向用户显示错误信息或其他操作
  }

}


onMounted(async () => {
  actions.tagList();
  actions.typeList();
  actions.projectInfo();
  actions.packageList();
  actions.scaleList();
})

</script>

<style>
.tdcenter {
  text-align: center
}

.tdleft {
  text-align: left
}
</style>
