<template>
  <n-card>
    <n-grid :y-gap="8" :cols="1">
      <n-grid-item>
        <div>
          <p style="font-size: 18px;font-weight: bold;">
            基本信息
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
                      <th style="width: 15%; text-align: center;">公司名称<span style="color: red;">*</span></th>
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
                            :disabled="true"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 15%; text-align: center;">法定代表人<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item path="fLegalRepresentative" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fLegalRepresentative"
                            :disabled="true"></n-input>
                        </n-form-item>
                      </td>
                      <th style="width: 15%; text-align: center;">公司注册地址<span style="color: red;">*</span></th>
                      <td style="width: 35%;" class="tdleft">
                        <n-form-item path="fCompanyRegisteredAddress" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fCompanyRegisteredAddress"
                            :disabled="true"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 15%; text-align: center;">公司成立日期<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fIncorporationTime" style="display: flex;flex-wrap: wrap;">
                          <n-date-picker style="width: 20vw;" type="date"
                            v-model:formatted-value="supplier.fIncorporationTime" value-format="yyyy-MM-dd"
                            :disabled="true"></n-date-picker>
                        </n-form-item>
                      </td>
                      <th style="width: 15%; text-align: center;">公司电话<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fCompanyPhone" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fCompanyPhone"
                            :disabled="true"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 15%; text-align: center;">官网地址<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fOfficialWebsiteAddress" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fOfficialWebsiteAddress"
                            :disabled="true"></n-input>
                        </n-form-item>
                      </td>
                      <th style="width: 15%; text-align: center;">设计人员总数<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="" style="display: flex;flex-wrap: wrap;">
                          <n-space vertical>
                            <n-input-group>
                              <n-input-number v-model:value="supplier.fDesignersTotal" :disabled="true"
                                :show-button="false" style="width: 9vw;" :validator="validator"></n-input-number>
                              <n-input-group-label>人</n-input-group-label>
                            </n-input-group>
                            <!-- 其中注册建筑/景观设计师<span style="color: red;">*</span> -->
                            <n-input-group>
                              <n-input-number v-model:value="supplier.fRegisteredArchitectsOrLandscapeArchitects"
                                :show-button="false" :disabled="true" style="width: 9vw;"
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
                            :disabled="true"></n-input>
                        </n-form-item>
                      </td>
                      <th style="width: 15%; text-align: center;">设计资格或资质的种类/级别<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fDesignQualificationTypeOrLevel" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fDesignQualificationTypeOrLevel"
                            :disabled="true"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 15%; text-align: center;">本项目联系人<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fContactPerson" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fContactPerson"
                            :disabled="true"></n-input>
                        </n-form-item>
                      </td>
                      <th style="width: 15%; text-align: center;">职务<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fDuties" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fDuties"
                            :disabled="true"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 15%; text-align: center;">电话<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fPhone" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fPhone"
                            :disabled="true"></n-input>
                        </n-form-item>
                      </td>
                      <th style="width: 15%; text-align: center;">邮箱<span style="color: red;">*</span></th>
                      <td class="tdleft">
                        <n-form-item path="fEmail" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 20vw;" v-model:value="supplier.fEmail" :disabled="true"
                            :on-blur="isValidEmail"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 15%; text-align: center;">通信地址及邮编<span style="color: red;">*</span></th>
                      <td class="tdleft" colspan="3">
                        <n-form-item path="fMailingAddressAndPostcode" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 60vw;" v-model:value="supplier.fMailingAddressAndPostcode"
                            :disabled="true"></n-input>
                        </n-form-item>
                      </td>
                    </tr>
                    <tr>
                      <th style="width: 15%; text-align: center;">公司介绍<span style="color: red;">*</span></th>
                      <td class="tdleft" colspan="3">
                        <n-form-item path="fCompanyProfile" style="display: flex;flex-wrap: wrap;">
                          <n-input style="width: 60vw;" v-model:value="supplier.fCompanyProfile" type="textarea"
                            :disabled="true"></n-input>
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
          </p>
        </div>
        <n-grid :x-gap="12" :y-gap="8" :cols="3">
          <n-grid-item v-for="(form,index) in formValues">
            <n-card :closable="false" @close="handleClose(form.fId,index)">
              <designerList :formValue="form" :isDisabled="true" />
            </n-card>
          </n-grid-item>
        </n-grid>
      </n-grid-item>

      <n-grid-item>
        <div>
          <p style="font-size: 18px;font-weight: bold;">
            项目信息<span style="color: red;">*</span>
            <n-alert title="温馨提示" type="info" closable>
              第一个项目信息请填写代表性项目
            </n-alert>
          </p>
        </div>
        <n-grid :x-gap="12" :y-gap="8" :cols="3">
          <n-grid-item v-for=" form in itemFormValues">
            <n-card :closable="false" @close="itemClose(form.fId,index)">
              <itemList :formValue="form" :isDisabled="true" />
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
              <n-button type="error" @click="">
                关闭
              </n-button>
            </n-space>
          </n-form>
        </n-grid-item>
      </n-grid-item>
    </n-grid>
  </n-card>

</template>

<script setup>
  import {
    ref
  } from 'vue'
  import inviteCompany from '@/apps/supplier/supplier_invite_company.vue'
  import fromAddress from '@/apps/common/address/formAddress.vue'
  import designerList from '@/apps/supplier/designer/designer_list.vue'
  import designerAdd from '@/apps/supplier/designer/designer_add.vue'
  import itemAdd from '@/apps/supplier/item/item_add.vue'
  import itemList from '@/apps/supplier/item/item_list.vue'
  import {
    useDialog,
  } from 'naive-ui'
  import storage from '@/utils/storage'
  import {
    useRoute,
  } from 'vue-router';
  import context from '@/context.js'

  import createApi from './api'

  //
  const api = createApi(getCurrentInstance())
  const formRef = ref(null);
  const dialog = useDialog();
  const route = useRoute()
  const fMainId = route.query.fId;

  //form
  let formValues = ref([]); //设计师数据
  let itemFormValues = ref([]); //项目数据
  const supplierValue = ref({
    fMain: fMainId,
    fId: fMainId,
    name: "",
    title: "",
    status: "",
    packageNames: "",
    infoValue: [],
    designerValue: formValues,
    itemValues: itemFormValues
  })

  //保存资格申请
  const supplierSave = async (isclose) => {
    window.close();
  }

  //预览跳转
  const pdfView = () => {
    supplierValue.value.fCurrentStatus = 9; //查看状态
    localStorage.setItem('supplierValue', JSON.stringify(supplierValue.value));
    window.open(context.path+`/view/ppt-view`)
  }
  //=======================初始化内容方法==========================

  const init = async () => {
    if (fMainId === undefined) {
      return
    }
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
    if (fMainId === undefined) {
      return
    }
    //编辑页面 获取包件名称,项目名称,申请人名称(公司名称)
    await api.supplierMainGetPackageNames({
      loginId: context.user(),
      fMainId: fMainId
    }).then(result => {
      supplierValue.value.title = result.data.title;
      supplierValue.value.name = result.data.name;
      supplierValue.value.status = result.status;
      supplierValue.value.packageNames = result.data.packageName;
    });
  }
  const designerInit = async () => {
    //设计师数据初始化
    await api.supplierMainDesignerInit({
      fMainId: fMainId
    }).then(result => {
      formValues.value = result.data
    });
  }
  const itemInit = async () => {
    //项目数据初始化
    await api.supplierMainItemInit({
      fMainId: fMainId
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
    init(); //公司信息 内容初始化
    nameInit(); //获取包件名称,项目名称
    designerInit(); //设计师数据初始化
    itemInit(); // 项目数据初始化
  })

  //=======================初始化方法==========================
</script>

<style></style>
