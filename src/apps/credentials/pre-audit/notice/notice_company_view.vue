<template>
  <n-layout>
    <n-layout-header
      class="text-center"
      :style="{ height: '80px', lineHeight: '80px', fontSize: '20px' }"
    >
      登记信息表
    </n-layout-header>
    <n-layout-content>
      <n-card>
        <n-form
          ref="formRef"
          :model="applicationModel"
          label-placement=""
          label-width="150px"
          :rules="rules"
        >
          <n-grid :cols="1">
            <n-gi :span="2">
              <n-table :single-line="false">
                <tbody>
                  <tr>
                    <th style="width: 20%; text-align: center">项目编号</th>
                    <td style="width: 80%" class="tdleft">
                      {{ projectRegisterInfo.fProtocolNo }}
                    </td>
                  </tr>
                  <tr>
                    <th style="width: 20%; text-align: center">日期</th>
                    <td style="width: 80%">
                      {{ projectRegisterInfo.fCreateTime }}
                    </td>
                  </tr>

                  <tr>
                    <th style="width: 20%; text-align: center">项目名称</th>
                    <td style="width: 80%">
                      {{ projectRegisterInfo.fProjectName }}
                    </td>
                  </tr>

                  <tr>
                    <th style="width: 20%; text-align: center">项目经理</th>
                    <td style="width: 35%">
                      {{ projectRegisterInfo.fProjectManager }}
                    </td>
                  </tr>

                  <tr>
                    <th style="width: 20%; text-align: center">
                      公司全称(中文)
                    </th>
                    <td style="width: 35%" class="tdleft">
                      {{ projectRegisterInfo.fFullName }}
                    </td>
                  </tr>

                  <tr>
                    <th style="width: 20%; text-align: center">
                      公司全称(英文)
                    </th>
                    <td style="width: 35%" class="tdleft"></td>
                  </tr>

                  <tr>
                    <th style="width: 20%; text-align: center">
                      公司地址(中文)
                    </th>
                    <td style="width: 35%" class="tdleft">
                      {{ projectRegisterInfo.fAddress }}
                    </td>
                  </tr>

                  <tr>
                    <th style="width: 20%; text-align: center">
                      公司地址(英文)
                    </th>
                    <td style="width: 35%" class="tdleft">公司地址(英文)</td>
                  </tr>

                  <tr>
                    <th style="width: 20%; text-align: center">
                      邮编 (Post Code)
                    </th>
                    <td style="width: 35%" class="tdleft">
                      {{ projectRegisterInfo.fPostcode }}
                    </td>
                  </tr>

                  <tr>
                    <th style="width: 20%; text-align: center">
                      公司电话(TEL.)
                    </th>
                    <td style="width: 35%" class="tdleft">
                      {{ projectRegisterInfo.fTelephone }}
                    </td>
                  </tr>

                  <tr>
                    <th style="width: 20%; text-align: center">
                      公司传真 (FAX.)
                    </th>
                    <td style="width: 35%" class="tdleft">
                      {{ projectRegisterInfo.fFax }}
                    </td>
                  </tr>

                  <tr>
                    <th style="width: 20%; text-align: center">
                      法定代表(Legal Person)
                    </th>
                    <td style="width: 35%" class="tdleft">
                      {{ projectRegisterInfo.fPrincipal }}
                    </td>
                  </tr>

                  <tr>
                    <th style="width: 20%; text-align: center">组织机构代码</th>
                    <td style="width: 35%" class="tdleft">
                      {{ projectRegisterInfo.fOrgId }}
                    </td>
                  </tr>

                  <tr>
                    <th style="width: 20%; text-align: center">注册资本</th>
                    <td style="width: 35%" class="tdleft"></td>
                  </tr>
                </tbody>
              </n-table>
            </n-gi>
          </n-grid>
        </n-form>
      </n-card>
    </n-layout-content>
    <n-layout-header
      class="text-center"
      :style="{ height: '80px', lineHeight: '80px', fontSize: '24px' }"
    >
      联系人信息
    </n-layout-header>
    <n-layout-content>
      <n-card>
        <n-form
          ref="formRef"
          :model="applicationModel"
          label-placement=""
          label-width="150px"
        >
          <n-grid :cols="1">
            <n-gi :span="1">
              <n-table :single-line="false">
                <tbody>
                  <tr>
                    <th style="width: 20%; text-align: center">联系人</th>
                    <td style="width: 80%" class="tdleft">
                      {{ contactPersonInfo.fContacts }}
                    </td>
                  </tr>
                  <tr>
                    <th style="width: 20%; text-align: center">
                      联系人手机(Mobile)
                    </th>
                    <td style="width: 80%" class="tdleft">
                      {{ contactPersonInfo.fPhone }}
                    </td>
                  </tr>
                  <tr>
                    <th style="width: 20%; text-align: center">
                      联系电话 (TEL.)
                    </th>
                    <td style="width: 80%" class="tdleft">
                      {{ contactPersonInfo.fPhone }}
                    </td>
                  </tr>
                  <tr>
                    <th style="width: 20%; text-align: center">
                      联系传真 (FAX.)
                    </th>
                    <td style="width: 80%" class="tdleft">
                      {{ contactPersonInfo.fFax }}
                    </td>
                  </tr>
                  <tr>
                    <th style="width: 20%; text-align: center">Email</th>
                    <td style="width: 80%" class="tdleft">
                      {{ contactPersonInfo.fEmail }}
                    </td>
                  </tr>
                  <tr>
                    <th style="width: 20%; text-align: center">联系地址</th>
                    <td style="width: 80%" class="tdleft">
                      {{ contactPersonInfo.fAddress }}
                    </td>
                  </tr>
                  <tr>
                    <th style="width: 20%; text-align: center">
                      邮编 (Post Code)
                    </th>
                    <td style="width: 80%" class="tdleft">
                      {{ contactPersonInfo.fPostcode }}
                    </td>
                  </tr>
                </tbody>
              </n-table>
            </n-gi>
          </n-grid>
        </n-form>
      </n-card>
    </n-layout-content>

    <n-layout-header
      class="text-center"
      :style="{ height: '80px', lineHeight: '80px', fontSize: '24px' }"
    >
      增值税开票信息
    </n-layout-header>
    <n-layout-content>
      <n-card>
        <n-form
          ref="formRef"
          :model="applicationModel"
          label-placement=""
          label-width="150px"
        >
          <n-grid :cols="1">
            <n-gi :span="1">
              <n-table :single-line="false">
                <tbody>
                  <tr>
                    <th style="width: 20%; text-align: center">纳税人类型</th>
                    <td style="width: 80%" class="tdleft">
                      {{ valueAddedTaxBillingInfo.fTaxpayerType }}
                    </td>
                  </tr>
                  <tr>
                    <th style="width: 20%; text-align: center">纳税人识别号</th>
                    <td style="width: 80%" class="tdleft">
                      {{ valueAddedTaxBillingInfo.fTaxpayer }}
                    </td>
                  </tr>
                  <tr>
                    <th style="width: 20%; text-align: center">地 址</th>
                    <td style="width: 80%" class="tdleft">
                      {{ valueAddedTaxBillingInfo.fBillingAddress }}
                    </td>
                  </tr>
                  <tr>
                    <th style="width: 20%; text-align: center">电话</th>
                    <td style="width: 80%" class="tdleft">
                      {{ valueAddedTaxBillingInfo.fBillingPhone }}
                    </td>
                  </tr>
                  <tr>
                    <th style="width: 20%; text-align: center">开户银行</th>
                    <td style="width: 80%" class="tdleft">
                      {{ valueAddedTaxBillingInfo.fBank }}
                    </td>
                  </tr>
                  <tr>
                    <th style="width: 20%; text-align: center">账号</th>
                    <td style="width: 80%" class="tdleft">
                      {{ valueAddedTaxBillingInfo.fAccount }}
                    </td>
                  </tr>
                  <tr>
                    <th style="width: 20%; text-align: center">
                      所需标书发票类型
                    </th>
                    <td style="width: 80%" class="tdleft">
                      {{ getStatusText(valueAddedTaxBillingInfo.fInvoiceType) }}
                    </td>
                  </tr>
                </tbody>
              </n-table>
            </n-gi>
          </n-grid>
        </n-form>
      </n-card>
    </n-layout-content>

    <n-layout-header
      class="text-center"
      :style="{ height: '80px', lineHeight: '80px', fontSize: '24px' }"
    >
      其他信息
    </n-layout-header>
    <n-layout-content>
      <n-card>
        <n-form
          ref="formRef"
          :model="applicationModel"
          label-placement=""
          label-width="150px"
        >
          <n-grid :cols="1">
            <n-gi :span="1">
              <n-table :single-line="false">
                <tbody>
                  <tr>
                    <th style="width: 20%; text-align: center">获取备注</th>
                    <td style="width: 80%" class="tdleft">
                      {{ otherInfo.fPackageName }}
                    </td>
                  </tr>

                  <tr>
                    <th style="width: 20%; text-align: center">快递地址</th>
                    <td style="width: 80%" class="tdleft">
                      {{ otherInfo.fAddress }}
                    </td>
                  </tr>
                </tbody>
              </n-table>
            </n-gi>
          </n-grid>
        </n-form>
      </n-card>
    </n-layout-content>

    <n-space style="display: flex; justify-content: center; margin-top: 30px">
      <n-button type="error" @click="closeWindow">关闭</n-button>
    </n-space>
  </n-layout>
</template>

<script setup>
import { reactive, ref, watch } from 'vue'
import { NCard, NSpace, NText, NTag } from 'naive-ui'
import createApi from './api'
import { useRoute } from 'vue-router'

/**登记信息表 */
const projectRegisterInfo = reactive([])

/**联系人信息 */
const contactPersonInfo = reactive([])

/**增值税开票信息 */
const valueAddedTaxBillingInfo = reactive([])

/**其他信息 */
const otherInfo = reactive([])

const api = createApi(getCurrentInstance())

const getStatusText = (status) => {
  switch (status) {
    case '62':
      return '全电普票'
    case '61':
      return '全电专票'
    default:
      return '未知发票类型'
  }
}

const getInfo = async (fCompanyId, fProjectId) => {
  if (fProjectId.value === undefined) {
    return
  }
  const projectRes = await api.projectMainLoad({ fId: fProjectId.value })
  //项目编号
  projectRegisterInfo.fProtocolNo = projectRes.data.fProtocolNo
  //日期
  projectRegisterInfo.fCreateTime = projectRes.data.fCreateTime
  //项目名称
  projectRegisterInfo.fProjectName = projectRes.data.fName
  //项目经理
  projectRegisterInfo.fProjectManager = projectRes.data.fDeptManager.fName

  var sitcCompanyInfo = []
  const companyRes = await api.orgPersonLoad({ fId: fCompanyId.value })
  if (companyRes.data.fUpdateId == undefined) {
    var query = [
      {
        eq: {
          fOrgId: fCompanyId.value,
        },
      },
    ]
    const noUpdate = await api.sitcSupplierList({
      query: query,
    })
    sitcCompanyInfo = noUpdate.data.list[0]
  } else {
    var query = [
      {
        eq: {
          fId: companyRes.data.fUpdateId,
        },
      },
    ]
    const withUpdate = await api.sitcSupplierList({
      query: query,
    })
    // axios.post(
    //   `/pm/sitc/supplier/list?fId=${companyRes.data.fUpdateId}`,
    // )
    sitcCompanyInfo = withUpdate.data
  }

  //公司全称(中文)
  projectRegisterInfo.fFullName = sitcCompanyInfo.fName

  //公司全称(英文)
  // projectRegisterInfo.fCompanyEngName = companyRes.data.fNamexF

  //公司地址
  projectRegisterInfo.fAddress = sitcCompanyInfo.fAddress

  //邮编
  projectRegisterInfo.fPostcode = sitcCompanyInfo.fPostcode

  //公司电话
  projectRegisterInfo.fTelephone = sitcCompanyInfo.fTelephone

  //公司传真
  projectRegisterInfo.fFax = sitcCompanyInfo.fFax

  //法定代表人
  // projectRegisterInfo.fPrincipal = companyRes.data.fPrincipal

  //组织机构代码
  projectRegisterInfo.fOrgId = sitcCompanyInfo.fOrgId

  //注册资本
  // projectRegisterInfo.fRegisteredCapital = companyRes.data.fRegisteredCapital

  /**增值税开票信息 */
  /**纳税人类型 */
  valueAddedTaxBillingInfo.fTaxpayerType = sitcCompanyInfo.fTaxpayerType

  /**纳税人识别号*/
  valueAddedTaxBillingInfo.fTaxpayer = sitcCompanyInfo.fTaxpayer

  //开票地址
  valueAddedTaxBillingInfo.fBillingAddress = sitcCompanyInfo.fBillingAddress

  //开票电话
  valueAddedTaxBillingInfo.fBillingPhone = sitcCompanyInfo.fBillingPhone

  // 开户银行
  valueAddedTaxBillingInfo.fBank = sitcCompanyInfo.fBank

  //账号
  valueAddedTaxBillingInfo.fAccount = sitcCompanyInfo.fAccount

  var qyery = [
    {
      and: [
        {
          eq: {
            fApplyId: fCompanyId.value,
          },
        },
        {
          eq: {
            'fMain.fProjectId.fId': fProjectId.value,
          },
        },
      ],
    },
  ]

  const companyBidInfo = await api.noticeCompanyBidList({
    query: qyery,
  })

  // /**联系人信息 */

  //联系人
  contactPersonInfo.fContacts = companyBidInfo.data.list[0].fContacts

  //联系电话
  contactPersonInfo.fPhone = companyBidInfo.data.list[0].fPhone

  //邮箱
  contactPersonInfo.fEmail = companyBidInfo.data.list[0].fEmail

  //所需标书发票类型
  valueAddedTaxBillingInfo.fInvoiceType =
    companyBidInfo.data.list[0].fInvoiceType

  //获取备注 包件名称
  otherInfo.fPackageName = companyBidInfo.data.list[0].fPackageName

  //快递地址
  otherInfo.fAddress = companyBidInfo.data.list[0].fAddress
}

//关闭
const route = useRoute()
const fCompanyId = ref('')
const fProjectId = ref('')

const closeWindow = () => {
  window.close()
}

onMounted(async () => {
  // 页面首次加载时获取数据
  fCompanyId.value = route.query.fCompanyId
  fProjectId.value = route.query.fProjectId
  await getInfo(fCompanyId, fProjectId)
})
</script>

<style></style>
