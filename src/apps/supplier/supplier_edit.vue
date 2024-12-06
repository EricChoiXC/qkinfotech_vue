<template>
  <n-card>
    <n-grid :y-gap="8" :cols="1">
      <n-grid-item>
        <div>
          <p style="font-size: 18px;font-weight: bold;">
            基本信息
            <n-button-group>
              <n-space>
                <n-button @click="changeCompany"
                  v-if="supplierValue.fIsUnion === 'true' && supplierValue.status !== 2 && supplierValue.active">修改联合体</n-button>
                <n-button v-if="supplierValue.status !== 2" @click="getHistory">历史文件数据导入</n-button>
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
          <n-table :single-line="false">
            <tbody>
              <tr>
                <th colspan="4" style="
                    text-align: center;
                    font-size: 18px;
                    font-weight: bold;
                ">资格预审申请文件</th>
              </tr>
              <tr v-if="supplierValue.fIsUnion === 'true'">
                <th style="width: 15%; text-align: center;">是否联合体<span style="color: red;">*</span></th>
                <td class="tdleft" colspan="3">
                  <n-form-item path="active" style="display: flex;flex-wrap: wrap;">
                    <n-radio-group v-model:value="supplierValue.active" name="radiogroup"
                      @update:value="handleUnionValue" :disabled="supplierValue.status ===2">
                      <n-space>
                        <n-radio key="true" :value="true">
                          是
                        </n-radio>
                        <n-radio key="false" :value="false">
                          否
                        </n-radio>
                      </n-space>
                    </n-radio-group>
                  </n-form-item>
                </td>
              </tr>
            </tbody>
          </n-table>
        </div>
        <div>
          <n-form ref="formRef" :model="supplierValue">
            <n-grid :x-gap="12" :y-gap="8" :cols="2">
              <n-grid-item span="2" v-for="supplier in supplierValue.infoValue">
                <n-table :single-line="false">
                  <tbody>
                    <tr>
                      <th style="width: 15%; text-align: center;">公司名称<span style="color: red;">*</span>
                      </th>
                      <td style="width:35%;" class="tdleft">
                        <n-form-item path="fCompanyName" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fCompanyName"
                            :disabled="true"></n-input>
                        </n-form-item>
                      </td>
                      <th style="width: 15%; text-align: center;">国别<span style="color: red;">*</span></th>
                      <td style="width:35%;" class="tdleft">
                        <n-form-item path="fCountry" class="flex-center" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fCountry"
                            :disabled="supplierValue.status ===2"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 15%; text-align: center;">法定代表人<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item path="fLegalRepresentative" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fLegalRepresentative"
                            :disabled="supplierValue.status ===2"></n-input>
                        </n-form-item>
                      </td>
                      <th style="width: 15%; text-align: center;">公司注册地址<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item path="fCompanyRegisteredAddress" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fCompanyRegisteredAddress"
                            :disabled="supplierValue.status ===2"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 15%; text-align: center;">公司成立日期<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fIncorporationTime" style="display: flex;flex-wrap: wrap;">
                          <n-date-picker style="width: 20vw;" type="date"
                            v-model:formatted-value="supplier.fIncorporationTime" value-format="yyyy-MM-dd"
                            :disabled="supplierValue.status ===2"></n-date-picker>
                        </n-form-item>
                      </td>
                      <th style="width: 15%; text-align: center;">公司电话<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fCompanyPhone" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fCompanyPhone"
                            :disabled="supplierValue.status ===2"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 15%; text-align: center;">官网地址<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fOfficialWebsiteAddress" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fOfficialWebsiteAddress"
                            :disabled="supplierValue.status ===2"></n-input>
                        </n-form-item>
                      </td>
                      <th style="width: 15%; text-align: center;">设计人员总数<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="" style="display: flex;flex-wrap: wrap;">
                          <n-space vertical>
                            <n-input-group>
                              <n-input-number v-model:value="supplier.fDesignersTotal"
                                :disabled="supplierValue.status ===2" :show-button="false" style="width: 9vw;"
                                :validator="validator"></n-input-number>
                              <n-input-group-label>人</n-input-group-label>
                            </n-input-group>
                            <!-- 其中注册建筑/景观设计师<span style="color: red;">*</span> -->
                            <n-input-group>
                              <n-input-number v-model:value="supplier.fRegisteredArchitectsOrLandscapeArchitects"
                                :show-button="false" :disabled="supplierValue.status ===2" style="width: 9vw;"
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
                            :disabled="supplierValue.status ===2"></n-input>
                        </n-form-item>
                      </td>
                      <th style="width: 15%; text-align: center;">设计资格或资质的种类/级别<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fDesignQualificationTypeOrLevel" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fDesignQualificationTypeOrLevel"
                            :disabled="supplierValue.status ===2"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 15%; text-align: center;">本项目联系人<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fContactPerson" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fContactPerson"
                            :disabled="supplierValue.status ===2"></n-input>
                        </n-form-item>
                      </td>
                      <th style="width: 15%; text-align: center;">职务<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fDuties" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fDuties"
                            :disabled="supplierValue.status ===2"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 15%; text-align: center;">电话<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fPhone" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fPhone"
                            :disabled="supplierValue.status ===2"></n-input>
                        </n-form-item>
                      </td>
                      <th style="width: 15%; text-align: center;">邮箱<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fEmail" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fEmail"
                            :disabled="supplierValue.status ===2" :on-blur="isValidEmail"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 15%; text-align: center;">通信地址及邮编<span style="color: red;">*</span></th>
                      <td class="tdleft" colspan="3">
                        <n-form-item path="fMailingAddressAndPostcode" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 60vw;" v-model:value="supplier.fMailingAddressAndPostcode"
                            :disabled="supplierValue.status ===2"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 15%; text-align: center;">公司介绍<span style="color: red;">*</span></th>
                      <td class="tdleft" colspan="3">
                        <n-form-item path="fCompanyProfile" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 60vw;" v-model:value="supplier.fCompanyProfile" type="textarea"
                            :disabled="supplierValue.status ===2"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                  </tbody>
                </n-table>
              </n-grid-item>
              <!--
              <n-grid-item span="2">
                <n-table :single-line="false">
                  <tbody>
                    <tr>
                      <td style="width:20%;" class="tdcenter">是否联合主体</td>
                      <td class="tdleft" colspan="3">
                        <n-form-item label="" path="">
                  <n-space>
                    <n-radio :checked="checkedValueRef === 'yes'" value="yes" name="basic-demo" @change="handleChange">
                      是
                    </n-radio>
                    <n-radio :checked="checkedValueRef === 'no'" value="no" name="basic-demo" @change="handleChange">
                      否
                    </n-radio>
                  </n-space>
                </n-form-item>
                      </td>
                    </tr>
                  </tbody>
                </n-table>

              </n-grid-item> -->
              <!--  <n-grid-item span="2" v-if="checkedValueRef === 'yes'">
                <n-table :single-line="false">
                  <tbody>
                    <tr>
                      <td style="width:20%;" class="tdcenter">邀请公司名称</td>
                      <td class="tdleft" colspan="3">
                        <n-form-item label="" path="">
                          <n-input value="" type="textarea"></n-input><n-button>选择</n-button>
                        </n-form-item>
                      </td>
                    </tr>
                  </tbody>
                </n-table>
              </n-grid-item>

              <n-grid-item span="2" v-if="checkedValueRef === 'yes'">
                <n-table :bordered="false" :single-line="false">
                  <thead>
                    <tr>
                      <th>联合体公司名称</th>
                      <th>当前状态</th>
                      <th>提交日期</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>XXX公司</td>
                      <td>已完成</td>
                      <td>2024-5-20</td>
                    </tr>
                    <tr>
                      <td>abc公司</td>
                      <td>未完成</td>
                      <td></td>
                    </tr>
                  </tbody>
                </n-table>
              </n-grid-item> -->

            </n-grid>
          </n-form>
        </div>
      </n-grid-item>

      <n-grid-item>
        <div>
          <p style="font-size: 18px;font-weight: bold;">
            主创设计师信息<span style="color: red;">*</span>
            <n-button @click="addDesigner" v-if="supplierValue.status !==2">修改</n-button>
          </p>
        </div>
        <n-grid :x-gap="12" :y-gap="8" :cols="3">
          <n-grid-item v-for="(form,index) in formValues">
            <n-card :closable="supplierValue.status !==2" @close="handleClose(form.fId,index)">
              <designerList :formValue="form" :isDisabled="supplierValue.status ===2" :fIsUnion="supplierValue.fIsUnion"
                :infoValue="supplierValue.infoValue" />
            </n-card>
          </n-grid-item>
        </n-grid>
      </n-grid-item>

      <n-grid-item>
        <div>
          <p style="font-size: 18px;font-weight: bold;">
            项目信息<span style="color: red;">*</span>
            <n-button @click="addItem" v-if="supplierValue.status !==2">修改</n-button>
            <n-alert title="温馨提示" type="info" closable>
              第一个项目信息请填写代表性项目
            </n-alert>
          </p>
        </div>
        <n-grid :x-gap="12" :y-gap="8" :cols="3">
          <n-grid-item v-for=" form in itemFormValues">
            <n-card :closable="supplierValue.status !==2" @close="itemClose(form.fId,index)">
              <itemList :formValue="form" :isDisabled="supplierValue.status ===2" :designers="formValues" />
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
              <n-button type="primary" @click="handleValidateClick" v-if="supplierValue.status !==2">
                保存
              </n-button>
              <n-button type="error" v-if="supplierValue.status===2" @click="withdraw()">
                撤回申请
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
    <inviteCompany :fMainId="fMainId" @onClose="onClose" :designers="formValues" />
  </n-modal>

  <n-modal style="width:60%;" v-model:show="designerShow" preset="dialog" title="添加设计师" :mask-closable="false">
    <designerAdd @saveModal="saveModal" @closeModal="closeModal" :designerfId="designerfId"
      :fIsUnion="supplierValue.fIsUnion" :infoValue="supplierValue.infoValue" />
  </n-modal>

  <n-modal style="width:60%;" v-model:show="itemShow" preset="dialog" title="添加项目信息" :mask-closable="false">
    <itemAdd @closeItem="closeItem" @saveItem="saveItem" :itemfId="itemfId" :designers="formValues" />
  </n-modal>

  <n-modal style="width:60%;" v-model:show="historyShow" preset="dialog" title="历史记录数据导入" :mask-closable="false">
    <history :fHistoryMainId="fHistoryMainId" :fMainId="fMainId" @update-fHistoryMainId="handleHistoryMainIdUpdate"
      @update-historyShow="historyShowUpdate" :fIsUnion="supplierValue.fIsUnion" />
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
  import context from '@/context.js'
  import createApi from './api'

  const api = createApi(getCurrentInstance())
  const formRef = ref(null);
  const dialog = useDialog();
  const message = useMessage();
  const router = useRouter()
  const route = useRoute()
  const fMainId = route.query.fId; //供应商mainid
  const fHistoryMainId = ref(""); //历史记录

  //校验当前登录账号是否可以查看该 供应商记录
  // const checkEditor = async () => {
  //   await axios.post('/pm/apps/supplier/main/list', {
  //     query: [{
  //       "and": [{
  //         "eq": {
  //           "fSupplier.fId": context.user()
  //         }
  //       }, {
  //         "eq": {
  //           "fId": fMainId
  //         }
  //       }]
  //     }]
  //   }).then(result => {
  //     console.log(result)
  //     //如果能找到记录 说明是当前供应商是该记录的所属者
  //   });
  // }

  //是否联合体控制
  const handleUnionValue = (value) => {
    if (value) {
      changeCompany()
    } else {
      //需要校验 是否已经创建了多个公司
      if (supplierValue.value.infoValue.length >= 2) {
        dialog.warning({
          title: '联合体校验',
          style: "width:500px",
          content: "目前已存在2家以上公司，无法设置为否！",
          positiveText: '确定',
        })
        supplierValue.value.active = true;
      }
    }
  }

  // // 定义一个方法来处理子组件触发的事件
  // function handleHistoryMainIdUpdate(newId) {
  //   // 更新 fHistoryMainId 的值
  //   fHistoryMainId.value = newId;
  // }

  // // 监听 fHistoryMainId 的变化
  // watch(fHistoryMainId, async (newValue, oldValue) => {
  //   const hInit = async () => {
  //     await axios.post('/pm/apps/supplier/info/list', {
  //       query: {
  //         "eq": {
  //           "fSupplierId.fId": newValue
  //         }
  //       }
  //     }).then(result => {
  //       result.data.list.forEach((item) => {
  //         item.fDesignersTotal = parseInt(item.fDesignersTotal, 10)
  //         item.fRegisteredArchitectsOrLandscapeArchitects = parseInt(item
  //           .fRegisteredArchitectsOrLandscapeArchitects, 10)
  //         if (item.fCompanyName === supplierValue.value.infoValue[0].fCompanyName) { // 本公司
  //           supplierValue.value.infoValue[0].fCountry = item.fCountry,
  //             supplierValue.value.infoValue[0].fLegalRepresentative = item.fLegalRepresentative,
  //             supplierValue.value.infoValue[0].fCompanyRegisteredAddress = item
  //             .fCompanyRegisteredAddress,
  //             supplierValue.value.infoValue[0].fIncorporationTime = item.fIncorporationTime,
  //             supplierValue.value.infoValue[0].fCompanyPhone = item.fCompanyPhone,
  //             supplierValue.value.infoValue[0].fOfficialWebsiteAddress = item.fOfficialWebsiteAddress,
  //             supplierValue.value.infoValue[0].fDesignersTotal = item.fDesignersTotal,
  //             supplierValue.value.infoValue[0].fRegisteredArchitectsOrLandscapeArchitects = item
  //             .fRegisteredArchitectsOrLandscapeArchitects,
  //             supplierValue.value.infoValue[0].fBusinessregistrationbusinesslicensenumber = item
  //             .fBusinessregistrationbusinesslicensenumber,
  //             supplierValue.value.infoValue[0].fDesignQualificationTypeOrLevel = item
  //             .fDesignQualificationTypeOrLevel,
  //             supplierValue.value.infoValue[0].fContactPerson = item.fContactPerson,
  //             supplierValue.value.infoValue[0].fDuties = item.fDuties,
  //             supplierValue.value.infoValue[0].fPhone = item.fPhone,
  //             supplierValue.value.infoValue[0].fEmail = item.fEmail,
  //             supplierValue.value.infoValue[0].fMailingAddressAndPostcode = item
  //             .fMailingAddressAndPostcode,
  //             supplierValue.value.infoValue[0].fCompanyProfile = item.fCompanyProfile
  //         } else { //联合体
  //           supplierValue.value.infoValue.push(item);
  //         }
  //       });
  //     });
  //   }
  //   const hDesignerInit = async () => {
  //     //清空设计师
  //     await formValues.value.forEach(async item => {
  //       await axios.post('/pm/supplier/main/deleteDesigner', {
  //         fId: item.fId
  //       });
  //     })
  //     //重新添加
  //     await axios.post('/pm/supplier/main/designerInit', {
  //       fMainId: newValue,
  //       historyFlag: true
  //     }).then(result => {
  //       formValues.value = result.data
  //     });
  //   }
  //   const hItemInit = async () => {
  //     await itemFormValues.value.forEach(async item => {
  //       await axios.post('/pm/apps/designer/achievement/delete?fId=' + item.fId);
  //     })

  //     await axios.post('/pm/supplier/main/itemInit', {
  //       fMainId: newValue,
  //       historyFlag: true
  //     }).then(result => {
  //       itemFormValues.value = result.data
  //       itemFormValues.value.forEach(museum => {
  //         try {
  //           const json = JSON.parse(museum.typeScales);
  //           museum.typeScales = json;
  //         } catch (error) {
  //           console.error('解析 typeScales 失败：', error);
  //         }
  //       });
  //     });
  //   }
  //   //初始化
  //   await hInit(); //公司信息 内容初始化
  //   await hDesignerInit(); //设计师数据初始化
  //   await hItemInit(); // 项目数据初始化
  //   //模拟save一下
  //   // await supplierSave(false);
  // });

  // 校验规则
  const rules = {
    validator: (formValue) => {
      let hasError = false;
      const errors = [];
      if (supplierValue.value.active === null || supplierValue.value.active === undefined) {
        hasError = true;
        message: "是否联合体不能为空"
        // errors[`infoValue.${index}.fCompanyName`] = {};
        errors.push("是否联合体不能为空，请选择是否联合体！！")
      }

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

  //  邮箱格式校验
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
    title: "",
    status: 0,
    active: null,
    fIsUnion: null, //公告的 是否联合体字段
    packageNames: "",
    packageIds: "",
    infoValue: [],
    designerValue: formValues,
    itemValues: itemFormValues
  })


  //保存方法
  const handleValidateClick = async () => {
    console.log("填写记录", supplierValue.value);
    //如果选择了是否联合体 为是的情况 需要和 公司数量必须大于等于2家 才能算是联合体
    if (supplierValue.value.active && supplierValue.value.infoValue.length < 2) {
      dialog.warning({
        title: '联合体校验',
        style: "width:500px",
        content: "是否联合体为是的情况下，需要至少2家公司才可提交！",
        positiveText: '确定',
      })
      return
    }
    //是否联合体选择否  只能有一家公司提交
    if (!supplierValue.value.active && supplierValue.value.infoValue.length > 1) {
      dialog.warning({
        title: '联合体校验',
        style: "width:500px",
        content: "是否联合体为否的情况下，只能填写1家公司才可提交！",
        positiveText: '确定',
      })
      return
    }
    //每个主创设计师都要有代表项目
    const designerFlag = supplierValue.value.designerValue.every(item => supplierValue.value.itemValues.some(
      record => record.designerId === item.fId));
    if (!designerFlag) {
      dialog.warning({
        title: '主创设计师校验',
        style: "width:500px",
        content: "每个主创设计师都要有代表项目，请检查项目信息是否正确填写！",
        positiveText: '确定',
      })
      return
    }

    //公司信息是否有空白字段
    const hasEmptyInfo = rules.validator(supplierValue.value)
    // const hasEmptyInfo = supplierValue.value.infoValue.some(obj => hasEmptyValues(obj));
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
      // message.info('请检查公司信息是否填写完整！');
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
    supplierValue.value.fCurrentStatus = 1;
    supplierSave(false)
    localStorage.setItem('supplierValue', JSON.stringify(supplierValue.value));
    window.open(context.path+`/view/ppt-view`, '_self')
  }
  //保存资格申请
  const supplierSave = async (isclose) => {
    await api.supplierMainSupplierSave(supplierValue.value).then(result => {
      // message.info('保存成功！')
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
          await api.designerAchievementDelete({fId:v});
        }
        itemFormValues.value.splice(index, 1);
      }
    })
  }

  const designerfId = ref(null);
  //设计师 modal 打开
  const designerShow = ref(false);
  const addDesigner = async () => {
    const res = await api.designerMainInit();
    designerfId.value = res.data.fId;
    designerShow.value = true;
  }

  //设计师 modal 保存
  const saveModal = (formValue) => {
    designerShow.value = false;
    if (supplierValue.value.fIsUnion === "false") {
      formValue.companyName = supplierValue.value.name
    }
    formValues.value.push(formValue);
  };
  //设计师 modal 取消
  const closeModal = (formValue) => {
    designerShow.value = false;
  };

  //项目信息 modal 打开
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
    if (typeof(data) !== 'undefined') { //取消 不传data
      const newArr = [];
      for (var i = 1; i < data.length; i++) {
        if (i === 0) { //第一条公司-- fInviteCompany赋值
          // supplierValue.value.infoValue[0].fInviteCompany = data[i].fId
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
    if (b.length === 0) {
      return [a[0]];
    }
    const firstElement = a[0];
    const restOfA = a.slice(1);
    const filteredA = restOfA.filter(itemA => {
      const existsInB = b.some(itemB => itemB.fCompanyName === itemA.fCompanyName);
      return existsInB;
    });
    const bNotInA = b.filter(itemB => {
      const existsInA = restOfA.some(itemA => itemA.fCompanyName === itemB
        .fCompanyName);
      return !existsInA;
    });
    const mergedArray = [firstElement, ...filteredA, ...bNotInA];
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
    location.reload();
  }

  const withdraw = async () => {
    // 截至日期小于一天 提示 确认撤回/取消不撤回
    const res = await getNoticeDateRange(supplierValue.value.fId, 'ppt-view');
    const now = Date.now();
    const timeDifference = Math.abs(now - res.data.deadline);
    const oneDayMillis = 24 * 60 * 60 * 1000;
    if (timeDifference < oneDayMillis) {
      WithdrawalTip('距离截至日期少于一天，是否撤回？', supplierValue.value.fId, 0);
      return
    }
    WithdrawalTip('是否撤回？', supplierValue.value.fId, 0);
  }

  //预览跳转
  const pdfView = () => {
    if (supplierValue.value.status !== 2) {
      supplierValue.value.fCurrentStatus = 0; //状态保存
      supplierSave(false);
    } else {
      supplierValue.value.fCurrentStatus = 2; //状态保存
    }
    localStorage.setItem('supplierValue', JSON.stringify(supplierValue.value));
    window.open(context.path+`/view/ppt-view`)
  }


  //=======================初始化内容方法==========================

  //校验是否期限内
  const dateRange = async () => {
    getNoticeDateRange(fMainId, 'supplier-edit');
  }

  const init = async () => {
    //编辑页面 公司信息 内容初始化
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
        }
        item.fDesignersTotal = parseInt(item.fDesignersTotal, 10)
        item.fRegisteredArchitectsOrLandscapeArchitects = parseInt(item
          .fRegisteredArchitectsOrLandscapeArchitects, 10)
        supplierValue.value.infoValue.push(item);
      });
    });
  }

  const nameInit = async () => {
    //编辑页面 获取包件名称,项目名称,申请人名称(公司名称)
    await api.supplierMainGetPackageNames({
      loginId: context.user(),
      fMainId: fMainId
    }).then(result => {
      supplierValue.value.title = result.data.title;
      supplierValue.value.name = result.data.name;
      supplierValue.value.status = result.data.status;
      supplierValue.value.packageNames = result.data.packageName;
      supplierValue.value.packageIds = result.data.packageIds;
      supplierValue.value.fIsUnion = result.data.fIsUnion;
      supplierValue.value.active = result.data.active;
    });
  }
  const designerInit = async () => {
    //设计师数据初始化
    await api.supplierMainDesignerInit({
      fMainId: fMainId,
    }).then(result => {
      formValues.value = result.data
    });
  }
  const itemInit = async () => {
    //项目数据初始化
    await api.supplierMainItemInit({
      fMainId: fMainId,
    }).then(result => {
      itemFormValues.value = result.data
      //功能 规模 json解析
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
  onMounted(async () => {
    // checkEditor();
    dateRange();
    init(); //公司信息 内容初始化
    nameInit(); //获取包件名称,项目名称
    designerInit(); //设计师数据初始化
    itemInit(); // 项目数据初始化
  })

  //=======================初始化方法==========================
</script>

<style></style>
