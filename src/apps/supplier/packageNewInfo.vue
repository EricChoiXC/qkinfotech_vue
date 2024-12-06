<template>
  <n-table :bordered="true" :single-line="false">
    <tr>
      <th colSpan="3" style="textAlign: center;fontSize: 18px;fontWeight: bold">资格预审申请文件</th>
    </tr>
    <tr>
      <th colSpan='3' style="width:90%;textAlign: center;">资格预审申请基本信息</th>
    </tr>
    <tr>
      <th style="width:20%;textAlign: center;">
        所属包件
      </th>
      <td>
        <div v-if="!showActions">
          <p v-for="(item,index) in data">{{item.packageName}}</p>
        </div>
        <div v-if="showActions">
          <n-checkbox-group v-model:value="packages">
            <n-space item-style="display: flex;">
              <n-checkbox v-for="(item, index) in packageOpt" :value="item.packageIds" :label="item.packageNames">
              </n-checkbox>
            </n-space>
          </n-checkbox-group>
        </div>
      </td>
    </tr>
    <tr v-for="(item,index) in data">
      <!-- <td v-if="!showActions">包件{{index+1}}:{{item.packageName}}</td> -->
      <!-- <td v-if="showActions">{{item.packageName}}</td> -->
      <td colSpan='3'>
        <n-table :bordered="false" :single-line="true" style="width:90%">
    <tr>
      <td>
        申请公司：
      </td>
      <td>
        <n-input v-model:value="item.userName" type="text" disabled />
      </td>
      <td>
        国别：
      </td>
      <td>
        <n-input v-model:value="item.country" type="text" :disabled="subStatus" />
      </td>
      <td>
        主创设计师姓名：
      </td>
      <td>
        <n-input v-model:value="item.designerName" type="text" :disabled="subStatus" />
      </td>
      <td v-if="unionFlag">
        是否主体：
      </td>
      <td v-if="unionFlag">
        <n-radio-group v-model:value="item.isMain" name="radiogroup" :disabled="subStatus">
          <n-space>
            <n-radio v-for="main in isMainValue" :key="main.value" :value="main.value">
              {{ main.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </td>
    </tr>
  </n-table>
  <n-divider />
  <n-table :bordered="true" :single-line="false">
    <tr>
      <!-- <th style="width:50%;text-align: center;">资格预审申请文件PPT</th> -->
      <!-- <th style="width:50%;text-align: center;">资格预审申请文件PDF</th> -->
      <th style="width:50%;text-align: center;">文件上传</th>
    </tr>
    <tr>
      <td>
        <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.supplier.AppsSupplierMain"
          :modelId="item.supplierId" fkey="supplierMain" :disabled="subStatus"  :multiple="true">
        </sitc-attachment>
      </td>
   <!--   <td>
        <sitc-attachment modelName="com.qkinfotech.core.tendering.model.apps.supplier.AppsSupplierMain"
          :modelId="item.supplierId" fkey="supplierPDF" :disabled="subStatus" fileType=".pdf">
        </sitc-attachment>
      </td> -->
    </tr>
  </n-table>
  <n-divider />
  <n-dynamic-input v-model:value="item.customValue" :on-create="onCreate" v-if="unionFlag" :disabled="subStatus">
    <template #create-button-default>
      添加联合体：
    </template>
    <template #default="{ value }">
      <div style="display: flex; align-items: center; width: 90%">
        <n-table :bordered="false" :single-line="true">
          <tr>
            <td>
              联合体公司：
            </td>
            <td>
              <n-input v-model:value="value.companyName" type="text" :disabled="subStatus" />
            </td>
            <td>
              国别：
            </td>
            <td>
              <n-input v-model:value="value.country" type="text" :disabled="subStatus" />
            </td>
            <td>
              主创设计师姓名：
            </td>
            <td>
              <n-input v-model:value="value.designerName" type="text" :disabled="subStatus" />
            </td>
            <td>
              是否主体：
            </td>
            <td>
              <n-radio-group v-model:value="value.isMain" name="unionRadiogroup" :disabled="subStatus">
                <n-space>
                  <n-radio v-for="main in isMainValue" :key="main.value" :value="main.value">
                    {{ main.label }}
                  </n-radio>
                </n-space>
              </n-radio-group>
            </td>
          </tr>
        </n-table>
      </div>
    </template>
    <template #action="{ index, create, remove, move }">
      <n-space>
        <n-button @click="() => create(index)" :disabled="subStatus">
          <n-icon>
            <AddIcon />
          </n-icon>
        </n-button>
        <n-button @click="() => remove(index)" :disabled="subStatus">
          <n-icon>
            <RemoveIcon />
          </n-icon>
        </n-button>
      </n-space>
    </template>

  </n-dynamic-input>
  </td>
  </tr>
  </n-table>

  <n-grid :x-gap="12" :y-gap="8" :cols="1" style="margin-top: 20px;margin-bottom:20px">
    <n-grid-item style="display: flex;justify-content: center;">
      <n-space>
        <n-button type="primary" v-if="!subStatus" @click="saveInfo(1)">
          暂存
        </n-button>
        <n-button type="primary" v-if="!subStatus" @click="submit()">
          递交申请
        </n-button>
        <n-button type="error" v-if="subStatus&&!timeoutFlag" @click="withdraw()">
          撤回申请
        </n-button>
      </n-space>
    </n-grid-item>
  </n-grid>

</template>

<script setup>
  import {
    defineComponent,
    ref
  } from "vue";
  import {
    useDialog,
    useMessage
  } from "naive-ui";
  import {
    AddCircleOutline as addIcon
  } from '@vicons/ionicons5';
  import supplierUtil from '../supplier/js/supplierUtil.js';
  import context from '@/context.js'
  import sitcAttachment from '@/apps/common/attachment/SITCAttachment.vue'
  import {
    BagAddOutline as AddIcon,
    ChevronDownCircleOutline as DownIcon,
    BagRemoveOutline as RemoveIcon,
    ChevronUpCircleOutline as UpIcon
  } from '@vicons/ionicons5'
  import layout from "@/layout/layout";
  import createApi from './api'
  import baseUrl from '@/utils/baseUrl'

  const api = createApi(getCurrentInstance())
  const message = useMessage();
  const dialog = useDialog();
  const route = useRoute();
  const id = route.query.fId; //supplier main id
  const ekpId = route.query.ekpId; //
  let noticeId = ""; //公告id
  let projectId = ""; //项目id
  const fPackageId = route.query.packageId; //包件id
  const showActions = ref(true); // 控制 true-模糊匹配 /false-精确匹配
  const unionFlag = ref(false); // 是否支持联合体flag
  const subStatus = ref(false); //提交/撤回 状态  false未提交/true已提交显示撤回
  const data = reactive([])
  const timeoutFlag = ref(false); //超时flag

  const packages = ref([]) //模糊查询的包件选中项
  const packageOpt = ref([]) //模糊查询的包件选项

  //暂存
  const saveInfo = (v) => {
    data.map(function(item, index) {
      item.currentStatus = v;
    });
    if (showActions.value) {
      data[0].packageId = packages.value
    }
    api.supplierMainNewSave(data).then(result => {
      //暂存后提示
      message.success("保存成功！")
      window.open(baseUrl.pmUrl + '/view/actionSuccess', '_self')
    });
  }

  //页面进入 判断是否超时,以及获取匹配模式
  const init = async () => {
    if (id === undefined) {
      return
    }
    const res = api.load({
      fId: id
    }).then(result => {
      const dataList = result.data;
      if (dataList) {
        noticeId = dataList.fNotice.fId
        projectId = dataList.fId
        const deadline = new Date(dataList.fNotice.fApplicationDocumentDeadline)
        const now = new Date();
        // 判断 是什么匹配方式  精确匹配/模糊匹配  公告里找
        if (dataList.fNotice.fIsAccurateMatching === 'true') {
          showActions.value = true
        } else {
          showActions.value = false
        }
        //判断是否支持联合体
        if (dataList.fNotice.fIsUnion === 'true') {
          unionFlag.value = true
        }
        //判断是否在截至日期内 过了时间只能查看
        if (deadline < now) {
          timeoutFlag.value = true;
          subStatus.value = true
        }
        //模糊匹配 查询出全部包件列再复选框
        if (showActions.value) {
          const requestData = {
            "loginId": context.user(),
            "ekpId": ekpId,
          }
          api.getPackagesByNotice(requestData).then(result => {
            const dataList = result.data;
            dataList.map(function(item, index) {
              const packageObj = {
                packageIds: "",
                packageNames: ""
              };
              packageObj.packageIds = item.fId
              packageObj.packageNames = `包件${index+1}:` + item.fName
              packageOpt.value.push(packageObj)
            });
          });
        }

        //查询当前供应商 该项目所购买的包件
        const requestData = {
          "supplierId": id,
          "noticeId": noticeId,
          "packageId": fPackageId,
          "personId": context.user(),
          "showActions": showActions.value
        }
        api.getInviteCompany(requestData).then(result => {
          const dataList = result.data;
          dataList.map(async function(item, index) {
            const obj = {};
            obj.index = index //序号
            obj.userId = context.user(); //当前登录人id
            obj.userName = item.companyName; //当前登录人name
            obj.packageName = item.packageName //包件名称
            obj.supplierId = id //文档主id
            obj.packageId = fPackageId //包件id
            obj.noticeId = noticeId //公告id
            obj.mainId = projectId //项目id
            if (showActions.value) { //模糊匹配 时 包件
              item.fPackageId.map(function(p) {
                packages.value.push(p.fId)
              })
            }
            //申请公司的基本信息
            obj.inviteCompany = item.inviteCompany ? item.inviteCompany : ""; // 公司关系id
            obj.companyName = item.companyName
            obj.country = item.country
            obj.designerName = item.designerName
            obj.isMain = item.isMain
            obj.customValue = item.customValue
            obj.currentStatus = item.currentStatus ? item.currentStatus : "1"

            if (item.status === 0) {
              obj.status = '已创建' //状态
            } else if (item.status === 1) {
              obj.status = '已保存' //状态
            } else if (item.status === 2) {
              obj.status = '已递交' //状态
            } else {
              obj.status = '未创建' //状态
            }
            data.push(obj)
            if (obj.currentStatus === 2) {
              subStatus.value = true;
            }
          });
          // }
        }).catch(err => {
          console.log(err)
        });

      } else { //没有记录表示 错误
        message.error("没有找到公告记录！");
      }
    })
  }

  //是否主体 radio
  const isMain = ref("true");
  const isMainValue = [{
      value: "true",
      label: "是"
    },
    {
      value: "false",
      label: "否"
    }
  ].map((s) => {
    s.value = s.value.toLowerCase();
    return s;
  })

  //联合体 数据
  const onCreate = (index) => {
    return {
      inviteCompanyId: "", //联合体公司关系
      supplierInfoId: "", //公司信息
      designerMainId: "", //设计师
      companyName: "",
      companyId: "",
      country: "",
      designerName: "",
      isMain: "false"
    };
  }

  //递交需要校验
  const submit = async () => {
    let subFlag = false;
    let errorMsgs = [];
    const promises = data.map(async (item, index) => {
      let completeFlag = true;
      const errors = [];
      const selectIsMain = [];
      if (!item.country) {
        completeFlag = false;
        errors.push(`国别不能为空！`);
      }
      if (!item.designerName) {
        completeFlag = false;
        errors.push(`主创设计师不能为空！`);
      }

      try {
        const res = await api.supplierMainCheckAtt(item);
        if (!res.data.flag) {
          completeFlag = false;
          errors.push(`附件不能为空！`);
        }
      } catch (error) {
        console.error("附件检查失败", error);
      }
      if (unionFlag.value && item.customValue && item.customValue.length != 0) {
        item.customValue.forEach((union, idx) => {
          selectIsMain.length = 0;
          //是否有联合体
          if (item.customValue && item.customValue.length > 0) {
            if (union.companyName === '') {
              completeFlag = false
              errors.push("联合体公司不能为空！");
            }
            if (union.country === '') {
              completeFlag = false
              errors.push("联合体国别不能为空！");
            }
            if (union.designerName === '') {
              completeFlag = false
              errors.push("联合体主创设计师不能为空！");
            }
            //联合体选择主体 选项
            selectIsMain.push(union.isMain);
          }
        });
        //是否主体 必须有一个主体
        const trueCount = selectIsMain.filter(item => item === "true").length;
        let result = false;
        let message = '';
        if (item.isMain === "true") {
          if (trueCount === 0) {
            result = true;
          } else {
            errors.push("只能选择一家公司作为主体！");
          }
        } else if (item.isMain === "false") {
          if (trueCount === 1) {
            result = true;
          } else if (trueCount === 0) {
            errors.push("必须选择一家公司作为主体！");
          } else {
            errors.push("只能选择一家公司作为主体！");
          }
        }
        if (!result) {
          completeFlag = false
        }
      } else {
        //没有联合体
        if (item.isMain === undefined) {
          completeFlag = false
          errors.push("包件:" + item.packageName + ",请选择是否主体！");
        } else if (item.isMain === 'false') {
          completeFlag = false
          errors.push("包件:" + item.packageName + ",必须选择一家公司作为主体！");
        }
      }
      //模糊匹配情况下  校验是否选中 所属包件
      if (showActions.value && packages.value.length === 0) {
        completeFlag = false;
        errors.push("请至少选择一个所属包件！");
      }

      if (completeFlag) {
        subFlag = true;
        item.currentStatus = 2;
      } else {
        item.currentStatus = 1;
        errorMsgs = errorMsgs.concat(errors);
      }
    });

    await Promise.all(promises);

    if (subFlag) {
      dialog.warning({
        title: '提示',
        content: '是否确定进行递交,递交后不可再进行编辑！！' + errorMsgs.join(' '),
        positiveText: '是',
        negativeText: '否',
        maskClosable: false,
        onPositiveClick: async () => {
          try {
            if (showActions.value) {
              data[0].packageId = packages.value
            }
            await api.supplierMainNewSave(data);
            message.success("提交成功！");
            // 更新EKP角标接口...
            api.supplierMainUpdateEkpFileSize({
              supplierId: context.user(),
              noticeId: id
            })
            window.open(baseUrl.pmUrl + '/view/actionSuccess', '_self')
          } catch (error) {
            console.error("提交失败", error);
          }
        },
      });
    } else {
      dialog.warning({
        title: '提示',
        content: errorMsgs.join(' '),
        positiveText: '是',
        negativeText: '否',
        maskClosable: false,
        onPositiveClick: () => {},
      });
    }
  }

  //撤回二次确认
  const withdraw = () => {
    dialog.warning({
      title: '提示',
      content: '是否进行撤回,撤回后需要再次进行递交！！',
      positiveText: '是',
      negativeText: '否',
      maskClosable: false,
      onPositiveClick: () => {
        saveInfo(1)
        //更新ekp 投标文件数量
        api.supplierMainUpdateEkpFileSize({
          supplierId: context.user(),
          noticeId: id
        })
        window.open(baseUrl.pmUrl + '/view/actionSuccess', '_self')
        // window.location.reload()
      },
    })
  }

  //初始化调用
  onMounted(() => {
    init();
  })
</script>

<style>
</style>
