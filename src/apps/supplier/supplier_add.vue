<template>
  <n-card>
    <n-grid :y-gap="8" :cols="1">
      <n-grid-item>
        <div>
          <p style="font-size: 18px;font-weight: bold;">
            基本信息
            <n-button-group>
              <n-space>
                <n-button @click="changeCompany" v-if="supplierValue.fIsUnion==='true'">修改联合体</n-button>
                <n-button @click="getHistory">历史文件数据导入</n-button>
              </n-space>
            </n-button-group>
          </p>
        </div>
        <div>
          <p style="font-size: 18px;font-weight: bold;">
            包件信息 : {{supplierValue.packageNames}}
          </p>
        </div>
        <div>
          <n-form ref="formRef" :model="supplierValue" :rules="rules">
            <n-grid :x-gap="12" :y-gap="8" :cols="2">
              <n-grid-item span="2" v-for="supplier in supplierValue.infoValue">
                <n-table :single-line="false">
                  <tbody>
                    <tr>
                      <th style="width: 15%; text-align: center;">公司名称<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item path="fCompanyName" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fCompanyName"
                            :disabled="true"></n-input>
                        </n-form-item>
                      </td>
                      <th style="width: 15%; text-align: center;">国别<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item path="fCountry" class="flex-center" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fCountry"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 15%; text-align: center;">法定代表人<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item path="fLegalRepresentative" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fLegalRepresentative"
                            :disabled="false"></n-input>
                        </n-form-item>
                      </td>
                      <th style="width: 15%; text-align: center;">公司注册地址<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item path="fCompanyRegisteredAddress" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fCompanyRegisteredAddress"
                            :disabled="false"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 15%; text-align: center;">公司成立日期<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fIncorporationTime" style="display: flex;flex-wrap: wrap;">
                          <n-date-picker style="width: 20vw;" type="date"
                            v-model:formatted-value="supplier.fIncorporationTime" value-format="yyyy-MM-dd"
                            :disabled="false"></n-date-picker>
                        </n-form-item>
                      </td>
                      <th style="width: 15%; text-align: center;">公司电话<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fCompanyPhone" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fCompanyPhone"
                            :disabled="false"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 15%; text-align: center;">官网地址<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fOfficialWebsiteAddress" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fOfficialWebsiteAddress"
                            :disabled="false"></n-input>
                        </n-form-item>
                      </td>
                      <th style="width: 15%; text-align: center;">设计人员总数<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="" style="display: flex;flex-wrap: wrap;">
                          <n-space vertical>
                            <n-input-group>
                              <n-input-number v-model:value="supplier.fDesignersTotal" :disabled="false"
                                :show-button="false" style="width: 9vw;" :validator="validator"></n-input-number>
                              <n-input-group-label>人</n-input-group-label>
                            </n-input-group>
                            <!-- 其中注册建筑/景观设计师<span style="color: red;">*</span> -->
                            <n-input-group>
                              <n-input-number v-model:value="supplier.fRegisteredArchitectsOrLandscapeArchitects"
                                :show-button="false" :disabled="false" style="width: 9vw;"
                                :validator="validator"></n-input-number>
                              <n-input-group-label>注册建筑/景观设计师（人）</n-input-group-label>
                            </n-input-group>
                          </n-space>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 15%; text-align: center;">商业登记/营业执照编号<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fBusinessregistrationbusinesslicensenumber"
                          style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;"
                            v-model:value="supplier.fBusinessregistrationbusinesslicensenumber"
                            :disabled="false"></n-input>
                        </n-form-item>
                      </td>
                      <th style="width: 15%; text-align: center;">设计资格或资质的种类/级别<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fDesignQualificationTypeOrLevel" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fDesignQualificationTypeOrLevel"
                            :disabled="false"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 15%; text-align: center;">本项目联系人<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fContactPerson" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fContactPerson"
                            :disabled="false"></n-input>
                        </n-form-item>
                      </td>
                      <th style="width: 15%; text-align: center;">职务<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fDuties" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fDuties"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 15%; text-align: center;">电话<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fPhone" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fPhone"></n-input>
                        </n-form-item>
                      </td>
                      <th style="width: 15%; text-align: center;">邮箱<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fEmail" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fEmail"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 15%; text-align: center;">通信地址及邮编<span style="color: red;">*</span></th>
                      <td class="tdleft" colspan="3">
                        <n-form-item path="fMailingAddressAndPostcode" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 60vw;" v-model:value="supplier.fMailingAddressAndPostcode"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 15%; text-align: center;">公司介绍<span style="color: red;">*</span></th>
                      <td class="tdleft" colspan="3">
                        <n-form-item path="fCompanyProfile" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 60vw;" v-model:value="supplier.fCompanyProfile"
                            type="textarea"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                  </tbody>
                </n-table>
              </n-grid-item>

            </n-grid>
          </n-form>
        </div>
      </n-grid-item>

      <n-grid-item>
        <div>
          <p style="font-size: 18px;font-weight: bold;">
            主创设计师信息<span style="color: red;">*</span>
            <n-button @click="addDesigner">修改</n-button>
          </p>
        </div>
        <n-grid :x-gap="12" :y-gap="8" :cols="3">
          <n-grid-item v-for="(form,index) in formValues">
            <n-card closable @close="handleClose(form.fId,index)">
              <designerList :formValue="form" />
            </n-card>
          </n-grid-item>
        </n-grid>
      </n-grid-item>

      <n-grid-item>
        <div>
          <p style="font-size: 18px;font-weight: bold;">
            项目信息<span style="color: red;">*</span>
            <n-button @click="addItem">修改</n-button>
            <n-alert title="温馨提示" type="info" closable>
              第一个项目信息请填写代表性项目
            </n-alert>
          </p>
        </div>
        <n-grid :x-gap="12" :y-gap="8" :cols="3">
          <n-grid-item v-for=" form in itemFormValues">
            <n-card closable @close="itemClose(form.fId,index)">
              <itemList :formValue="form" />
            </n-card>
          </n-grid-item>
        </n-grid>
      </n-grid-item>

      <n-grid-item span="2">
        <n-grid-item style="display: flex;justify-content: center;">
          <n-form ref="formRef">
            <n-space>
              <n-button type="primary" @click="pdfView">
                预览
              </n-button>
              <n-button type="primary" @click="handleValidateClick">
                保存
              </n-button>
              <n-button type="error" @click="supplierSave(true)">
                关闭
              </n-button>
            </n-space>
          </n-form>
        </n-grid-item>
      </n-grid-item>
    </n-grid>
  </n-card>

  <n-modal style="width:60%;" v-model:show="companyShow" preset="dialog" title="添加公司" :mask-closable="false">
    <inviteCompany :fMainId="fMainId" @onClose="onClose" />
  </n-modal>

  <n-modal style="width:60%;" v-model:show="designerShow" preset="dialog" title="添加设计师" :mask-closable="false">
    <designerAdd @saveModal="saveModal" @closeModal="closeModal" :designerfId="designerfId" />
  </n-modal>

  <n-modal style="width:60%;" v-model:show="itemShow" preset="dialog" title="添加项目信息" :mask-closable="false">
    <itemAdd @closeItem="closeItem" @saveItem="saveItem" :itemfId="itemfId"/>
  </n-modal>

  <n-modal style="width:60%;" v-model:show="historyShow" preset="dialog" title="历史记录数据导入" :mask-closable="false">
    <history :fHistoryMainId="fHistoryMainId" :fMainId="fMainId" @update-fHistoryMainId="handleHistoryMainIdUpdate"
      @update-historyShow="historyShowUpdate" />
  </n-modal>

</template>

<script setup>
  import {
    ref
  } from 'vue'
  import history from '@/apps/supplier/history/supplier_history.vue'
  import inviteCompany from '@/apps/supplier/supplier_invite_company.vue'
  import fromAddress from '@/apps/common/address/formAddress.vue'
  import designerList from '@/apps/supplier/designer/designer_list.vue'
  import designerAdd from '@/apps/supplier/designer/designer_add.vue'
  import itemAdd from '@/apps/supplier/item/item_add.vue'
  import itemList from '@/apps/supplier/item/item_list.vue'
  import {
    useDialog,
    useMessage,
  } from 'naive-ui'
  import storage from '@/utils/storage'
  import {
    useRoute,
    useRouter
  } from 'vue-router';
  import supplierUtil from '../supplier/js/supplierUtil.js';
  import context from '@/context.js'

  import createApi from './api'

  const api = createApi(getCurrentInstance())
  const formRef = ref(null);
  const dialog = useDialog();
  const message = useMessage();
  const router = useRouter()
  const route = useRoute()
  const fMainId = route.query.fId;//供应商mainid
  const fHistoryMainId = ref(""); //历史记录

  // watch(() => route.query.fId, (query) => {
  //   fMainId.value = query ? query : route.query.fId;
  //   dateRange();
  //   init(); //公司信息 内容初始化
  //   nameInit(); //获取包件名称,项目名称
  // })

  // 定义一个方法来处理子组件触发的事件
  function handleHistoryMainIdUpdate(newId) {
    // 更新 fHistoryMainId 的值
    fHistoryMainId.value = newId;
  }

  // 监听 fHistoryMainId 的变化
  watch(fHistoryMainId, async (newValue, oldValue) => {
    const init = async () => {
      await api.supplierInfoList({
        query: {
          "eq": {
            "fSupplierId.fId": newValue
          }
        }
      }).then(result => {
        result.data.list.forEach((item) => {
          item.fDesignersTotal = parseInt(item.fDesignersTotal, 10)
          item.fRegisteredArchitectsOrLandscapeArchitects = parseInt(item
            .fRegisteredArchitectsOrLandscapeArchitects, 10)
          if (item.fCompanyName === supplierValue.value.infoValue[0].fCompanyName) { // 本公司
            supplierValue.value.infoValue[0].fCountry = item.fCountry,
              supplierValue.value.infoValue[0].fLegalRepresentative = item.fLegalRepresentative,
              supplierValue.value.infoValue[0].fCompanyRegisteredAddress = item
              .fCompanyRegisteredAddress,
              supplierValue.value.infoValue[0].fIncorporationTime = item.fIncorporationTime,
              supplierValue.value.infoValue[0].fCompanyPhone = item.fCompanyPhone,
              supplierValue.value.infoValue[0].fOfficialWebsiteAddress = item.fOfficialWebsiteAddress,
              supplierValue.value.infoValue[0].fDesignersTotal = item.fDesignersTotal,
              supplierValue.value.infoValue[0].fRegisteredArchitectsOrLandscapeArchitects = item
              .fRegisteredArchitectsOrLandscapeArchitects,
              supplierValue.value.infoValue[0].fBusinessregistrationbusinesslicensenumber = item
              .fBusinessregistrationbusinesslicensenumber,
              supplierValue.value.infoValue[0].fDesignQualificationTypeOrLevel = item
              .fDesignQualificationTypeOrLevel,
              supplierValue.value.infoValue[0].fContactPerson = item.fContactPerson,
              supplierValue.value.infoValue[0].fDuties = item.fDuties,
              supplierValue.value.infoValue[0].fPhone = item.fPhone,
              supplierValue.value.infoValue[0].fEmail = item.fEmail,
              supplierValue.value.infoValue[0].fMailingAddressAndPostcode = item
              .fMailingAddressAndPostcode,
              supplierValue.value.infoValue[0].fCompanyProfile = item.fCompanyProfile
          } else { //联合体
            supplierValue.value.infoValue.push(item);
          }
        });
      });
    }
    const designerInit = async () => {
      await api.supplierMainDesignerInit({
        fMainId: newValue
      }).then(result => {
        formValues.value = result.data
      });
    }
    const itemInit = async () => {
      await api.supplierMainItemInit({
        fMainId: newValue
      }).then(result => {
        itemFormValues.value = result.data
        itemFormValues.value.forEach(museum => {
          try {
            const json = JSON.parse(museum.typeScales);
            museum.typeScales = json;
          } catch (error) {
            console.error('解析 typeScales 失败：', error);
          }
        });
      });
    }
    //初始化
    await init(); //公司信息 内容初始化
    await designerInit(); //设计师数据初始化
    await itemInit(); // 项目数据初始化
    //模拟save一下
    await supplierSave(false);
    window.open(context.path+"/view/supplier-edit?fId="+fMainId,"_self")
  });

  // 校验规则
  const rules = {
    validator: (formValue) => {
      let hasError = false;
      const errors = [];
      formValue.infoValue.forEach((supplier, index) => {
        if (!supplier.fCompanyName) {
          hasError = true;
          message: "公司名称不能为空"
          // errors[`infoValue.${index}.fCompanyName`] = {};
          errors.push("公司名称不能为空,请先填写公司！！")
        } else {
          if (!supplier.fCountry) {
            hasError = true;
            message: "国别不能为空"
            // errors[`infoValue.${index}.fCountry`] = {};
            errors.push(supplier.fCompanyName + ".国别不能为空")
          }
          if (!supplier.fLegalRepresentative) {
            hasError = true;
            message: "法定代表人不能为空"
            // errors[`infoValue.${index}.fLegalRepresentative`] = {};
            errors.push(supplier.fCompanyName + ".法定代表人不能为空")
          }
          if (!supplier.fCompanyRegisteredAddress) {
            hasError = true;
            message: "公司注册地址不能为空"
            // errors[`infoValue.${index}.fCompanyRegisteredAddress`] = {};
            errors.push(supplier.fCompanyName + ".公司注册地址不能为空")
          }
          if (supplier.fIncorporationTime === null) {
            hasError = true;
            message: "公司成立日期不能为空"
            // errors[`infoValue.${index}.fIncorporationTime`] = {};
            errors.push(supplier.fCompanyName + ".公司成立日期不能为空")
          }
          if (!supplier.fCompanyPhone) {
            hasError = true;
            message: "公司电话不能为空"
            // errors[`infoValue.${index}.fCompanyPhone`] = {};
            errors.push(supplier.fCompanyName + ".公司电话不能为空")
          }
          if (!supplier.fOfficialWebsiteAddress) {
            hasError = true;
            message: "官网地址不能为空"
            // errors[`infoValue.${index}.fOfficialWebsiteAddress`] = {};
            errors.push(supplier.fCompanyName + ".官网地址不能为空")
          }
          if (!supplier.fDesignersTotal) {
            hasError = true;
            message: "设计人员总数不能为空"
            // errors[`infoValue.${index}.fDesignersTotal`] = {};
            errors.push(supplier.fCompanyName + ".设计人员总数不能为空")
          }
          if (!supplier.fRegisteredArchitectsOrLandscapeArchitects) {
            hasError = true;
            message: "建筑/景观设计人员不能为空"
            // errors[`infoValue.${index}.fDesignersTotal`] = {};
            errors.push(supplier.fCompanyName + ".建筑/景观设计人员不能为空")
          } else {
            if (supplier.fRegisteredArchitectsOrLandscapeArchitects > supplier.fDesignersTotal) {
              hasError = true;
              message: "建筑/景观设计人员不可大于设计人员总数"
              // errors[`infoValue.${index}.fRegisteredArchitectsOrLandscapeArchitects`] = {};
              errors.push(supplier.fCompanyName + ".建筑/景观设计人员不可大于设计人员总数")
            }
          }
          if (!supplier.fBusinessregistrationbusinesslicensenumber) {
            hasError = true;
            message: "商业登记/营业执照编号不能为空"
            // errors[`infoValue.${index}.fBusinessregistrationbusinesslicensenumber`] = {};
            errors.push(supplier.fCompanyName + ".商业登记/营业执照编号不能为空")
          }
          if (!supplier.fDesignQualificationTypeOrLevel) {
            hasError = true;
            message: "设计资格或资质的种类/级别不能为空"
            // errors[`infoValue.${index}.fDesignQualificationTypeOrLevel`] = {};
            errors.push(supplier.fCompanyName + ".设计资格或资质的种类/级别不能为空")
          }
          if (!supplier.fContactPerson) {
            hasError = true;
            message: "本项目联系人不能为空"
            // errors[`infoValue.${index}.fContactPerson`] = {};
            errors.push(supplier.fCompanyName + ".本项目联系人不能为空")
          }
          if (!supplier.fDuties) {
            hasError = true;
            message: "职务不能为空"
            // errors[`infoValue.${index}.fDuties`] = {};
            errors.push(supplier.fCompanyName + ".职务不能为空")
          }
          if (!supplier.fPhone) {
            hasError = true;
            message: "电话不能为空"
            // errors[`infoValue.${index}.fPhone`] = {};
            errors.push(supplier.fCompanyName + ".电话不能为空")
          }
          if (!supplier.fEmail) {
            hasError = true;
            message: "邮箱不能为空"
            // errors[`infoValue.${index}.fEmail`] = {};
            errors.push(supplier.fCompanyName + ".邮箱不能为空")
          } else {
            if (!isValidEmail(supplier.fEmail)) {
              hasError = true;
              message: "请填入正确的邮箱格式"
              // errors[`infoValue.${index}.fEmail`] = {};
              errors.push(supplier.fCompanyName + ".请填入正确的邮箱格式")
            }
          }
          if (!supplier.fMailingAddressAndPostcode) {
            hasError = true;
            message: "通信地址及邮编不能为空"
            // errors[`infoValue.${index}.fMailingAddressAndPostcode`] = {};
            errors.push(supplier.fCompanyName + ".通信地址及邮编不能为空")
          }
          if (!supplier.fCompanyProfile) {
            hasError = true;
            message: "公司介绍不能为空"
            // errors[`infoValue.${index}.fCompanyProfile`] = {};
            errors.push(supplier.fCompanyName + ".公司介绍不能为空")
          }
        }
      });
      return hasError ? errors : undefined;
    }
  };

  //数字校验
  const validator = (x) => {
    if (x >= 0 && Number.isInteger(x)) {
      return true;
    }
  }

  //邮箱格式校验
  function isValidEmail(emailStr) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailStr)) {
      // message.info('请输入正确的邮箱格式！');
      return false
    } else {
      return true
    }
  }

  //form
  let formValues = ref([]); //设计师数据
  let itemFormValues = ref([]); //项目数据
  const supplierValue = ref({
    fMain: fMainId,
    fId: fMainId,
    name: "",
    title: "", //
    packageNames: "", //包件名称
    packageIds: "",
    fIsUnion: true, //是否支持联合体
    infoValue: [],
    designerValue: formValues,
    itemValues: itemFormValues
  })

  //保存方法
  const handleValidateClick = async () => {
    supplierValue.value.fMain = fMainId
    console.log("填写记录", supplierValue.value);
    //公司信息是否有未填字段
    const hasEmptyInfo = rules.validator(supplierValue.value)
    if (hasEmptyInfo) {
      dialog.warning({
        title: '请检查公司信息是否填写完整',
        style: "width:500px",
        content: () =>
          h('div', null,
            hasEmptyInfo.map((item, index) =>
              h('div', {
                key: index
              }, item)
            )
          ),
        positiveText: '确定',
      })
      return;
    }
    //设计师 是否有一条记录
    const designerValueNotEmpty = supplierValue.value.designerValue.length > 0;
    if (!designerValueNotEmpty) {
      message.info('请检查是否填写设计师信息！')
      return
    }
    //项目 是否有一条记录
    const itemValuesNotEmpty = supplierValue.value.itemValues.length > 0;
    if (!itemValuesNotEmpty) {
      message.info('请检查是否填写项目信息！')
      return
    }
    //保存
    supplierValue.value.fCurrentStatus = 1; //状态保存
    supplierSave(false);
    localStorage.setItem('supplierValue', JSON.stringify(supplierValue.value));
    window.open(context.path+`/view/ppt-view`, '_self')
  }

  //保存资格申请
  const supplierSave = async (isclose) => {
    api.supplierMainSupplierSave(supplierValue.value).then(result => {
      if (isclose) {
        window.close();
      }
    });
  }
  //删除设计师方法
  const handleClose = async (v, index) => {
    dialog.warning({
      title: '警告',
      content: '是否删除设计师记录？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        if (v) { //有值代表 数据库存在
          await api.supplierMainDeleteDesigner({
            fId: v
          });
        }
        formValues.value.splice(index, 1);
      }
    })
  }
  //删除项目方法
  const itemClose = async (v, index) => {
    dialog.warning({
      title: '警告',
      content: '是否删除项目记录？',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        if (v) { //有值代表 数据库存在
          await api.designerAchievementDelete({fId: v})
        }
        itemFormValues.value.splice(index, 1);
      }
    })
  }
  const designerfId = ref(null);
  //设计师 modal 打开
  const designerShow = ref(false);
  const addDesigner = async () => {
    const res = await api.designerMainInit(); //初始化一个id，用于附件关系存储
    designerfId.value = res.data.fId;
    designerShow.value = true;
  }
  //设计师 modal 保存
  const saveModal = (formValue) => {
    designerShow.value = false;
    formValues.value.push(formValue);
  };
  //设计师 modal 取消
  const closeModal = (formValue) => {
    designerShow.value = false;
  };
  const itemfId = ref(null);
  //项目信息 modal 打开
  const itemShow = ref(false);
  const addItem = async () => {
    const res = await api.designerAchievementInit();
    itemfId.value = res.data.fId;
    itemShow.value = true;
  }
  //项目信息 modal保存
  const saveItem = (formValue) => {
    itemShow.value = false;
    itemFormValues.value.push(formValue);
  };
  //项目信息 modal取消
  const closeItem = (formValue) => {
    itemShow.value = false;
  };
  //修改联合体 modal
  const companyShow = ref(false);
  const changeCompany = (formValue) => {
    companyShow.value = true;
  };
  //修改联合体 modal 取消
  const onClose = (data) => {
    if (typeof(data) !== 'undefined') {
      const newArr = [];
      for (var i = 0; i < data.length; i++) {
        if (i === 0) { //第一条公司-- fInviteCompany赋值
          supplierValue.value.infoValue[0].fInviteCompany = data[i].fId
        } else {
          const newCompany = {
            fInviteCompany: data[i].fId,
            fCompanyName: data[i].fCompanyName,
            fCountry: "",
            fLegalRepresentative: "",
            fCompanyRegisteredAddress: "",
            fIncorporationTime: null,
            fCompanyPhone: "",
            fOfficialWebsiteAddress: "",
            fDesignersTotal: "",
            fRegisteredArchitectsOrLandscapeArchitects: "",
            fBusinessregistrationbusinesslicensenumber: "",
            fDesignQualificationTypeOrLevel: "",
            fContactPerson: "",
            fDuties: "",
            fPhone: "",
            fEmail: "",
            fMailingAddressAndPostcode: "",
            fCompanyProfile: ""
          };
          newArr.push(newCompany);
        }
      }
      const merged = mergeArrays(supplierValue.value.infoValue, newArr);
      supplierValue.value.infoValue = merged
    }
    companyShow.value = false;
  }
  //合并联合体公司基本信息方法
  function mergeArrays(a, b) {
    // 如果数组 b 是空的，只返回数组 a 的第一个元素（如果有的话）。
    if (b.length === 0) {
      return [a[0]]; // 返回一个新数组，包含 a 的第一个元素。
    }
    // 保存数组 a 的第一个元素。
    const firstElement = a[0];
    // 获取数组 a 除第一个元素之外的其余部分。
    const restOfA = a.slice(1);
    // 过滤数组 a 的其余部分，只保留那些在数组 b 中也存在的元素。
    const filteredA = restOfA.filter(itemA => {
      // 检查 b 中是否存在具有相同 fCompanyName 的元素。
      const existsInB = b.some(itemB => itemB.fCompanyName === itemA.fCompanyName);
      return existsInB; // 返回 true 如果存在，否则 false。
    });
    // 过滤数组 b，找出那些在数组 a 中不存在的元素。
    const bNotInA = b.filter(itemB => {
      // 检查 a 的其余部分中是否存在具有相同 fCompanyName 的元素。
      const existsInA = restOfA.some(itemA => itemA.fCompanyName === itemB.fCompanyName);
      return !existsInA; // 返回 true 如果 a 中不存在，否则 false。
    });
    // 合并第一个元素、过滤后的 a 的其余部分，以及 b 中独有的元素。
    const mergedArray = [firstElement, ...filteredA, ...bNotInA];
    // 返回最终合并后的数组。
    return mergedArray;
  }


  //撤回提示
  function WithdrawalTip(msg, fId, fCurrentStatus) {
    dialog.warning({
      title: '提示',
      content: msg,
      positiveText: '是',
      negativeText: '否',
      maskClosable: false,
      onPositiveClick: () => {
        api.supplierMainSave({
          fId: fId,
          fCurrentStatus: fCurrentStatus
        }).then(result => {
          message.info('撤回成功！')
          window.close()
        });
      },
    })
  }

  //错误时限制弹窗
  function handleError(msg, tabKey) {
    dialog.error({
      title: "错误",
      content: msg,
      positiveText: "关闭",
      maskClosable: false,
      onEsc: () => {
        window.close()
      },
      onPositiveClick: () => {
        window.close()
      },
      onClose: () => {
        window.close()
      }
    });
  }

  //取公告超时时间
  async function getNoticeDateRange(fId, tabKey) {
    try {
      const result = await api.mainGetNoticeDateRange({
        fId: fId
      });
      const now = Date.now();
      if (!result.data.flag && result.data.deadline < now) {
        await handleError("超出申请文件提交日期！", tabKey);
      } else {
        // 如果没有超出期限，返回请求结果
        return result;
      }
    } catch (error) {
      console.error('请求失败:', error);
    }
  }

  //历史数据modal
  const historyShow = ref(false)
  const getHistory = () => {
    historyShow.value = true;
  }
  const historyShowUpdate = () => {
    historyShow.value = false;
  }

  //预览跳转
  const pdfView = () => {
    //预览前重置状态
    supplierValue.value.fCurrentStatus = 0; //状态保存
    supplierSave(false);
    localStorage.setItem('supplierValue', JSON.stringify(supplierValue.value));
    window.open(context.path+`/view/ppt-view`)
  }
  //=======================初始化内容方法==========================
  //校验是否期限内
  const dateRange = async () => {
    getNoticeDateRange(fMainId, 'supplier-add');
  }
  const init = async () => {
    await api.supplierInfoList({
      query: {
        "eq": {
          "fSupplierId.fId": fMainId
        }
      }
    }).then(result => {
      result.data.list.forEach((item) => {
        if (item.fInviteCompany) { //fInviteCompany字段赋值 否则保存会丢失fInviteCompany内容
          const id = item.fInviteCompany.fId
          item.fInviteCompany = id
          item.fCountry = ""
          item.fLegalRepresentative = ""
          item.fCompanyRegisteredAddress = ""
          item.fIncorporationTime = null
          item.fCompanyPhone = ""
          item.fOfficialWebsiteAddress = ""
          item.fDesignersTotal = ""
          item.fRegisteredArchitectsOrLandscapeArchitects = ""
          item.fBusinessregistrationbusinesslicensenumber = ""
          item.fDesignQualificationTypeOrLevel = ""
          item.fContactPerson = ""
          item.fDuties = ""
          item.fPhone = ""
          item.fEmail = ""
          item.fMailingAddressAndPostcode = ""
          item.fCompanyProfile = ""
        }
        supplierValue.value.infoValue.push(item);
      });
    });
  }

  const nameInit = async () => {
    //获取包件名称,项目名称,申请人名称(公司名称) 是否联合体
    await api.supplierMainGetPackageNames({
      loginId: context.user(),
      fMainId: fMainId
    }).then(result => {
      supplierValue.value.packageNames = result.data.packageName;
      supplierValue.value.packageIds = result.data.packageIds;
      supplierValue.value.title = result.data.title;
      supplierValue.value.name = result.data.name;
      supplierValue.value.fIsUnion = result.data.fIsUnion;
    });
  }
  //初始化
  onMounted(async () => {
    // fMainId.value = route.query.fId;
    dateRange();
    init(); //公司信息 内容初始化
    nameInit(); //获取包件名称,项目名称
  })

  //=======================初始化方法==========================
</script>

<style>
</style>
