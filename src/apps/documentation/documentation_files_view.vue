<template>
  <n-form ref="formRef">
    <n-grid :cols="2">
      <n-gi :span="2">
        <p style="font-size: 16px; font-weight: bold;">
          电子归档上传
        </p>
      </n-gi>
      <n-gi :span="2">
        <n-table :single-line="false">
          <tbody>
            <tr>
              <td style="width: 20%;" class="tdcenter">项目编号</td>
              <td class="tdleft">
                {{data.fno}}
              </td>
            </tr>
            <tr>
              <td style="width: 20%;" class="tdcenter">项目名称</td>
              <td class="tdleft">
                {{data.fname}}
              </td>
            </tr>
            <tr>
              <td style="width: 20%;" class="tdcenter">项目经理</td>
              <td class="tdleft">
                {{data.fmanager}}
              </td>
            </tr>
            <tr>
              <td style="width: 20%;" class="tdcenter">打包文件</td>
              <td class="tdleft">
                {{data.time}}
                <n-button>下载</n-button>
              </td>
            </tr>
          </tbody>
        </n-table>
      </n-gi>
      <n-gi :span="2">
        <p style="font-size: 16px; font-weight: bold;">
          方案征集项目电子归档
        </p>
      </n-gi>
      <n-gi :span="2">
        <n-table :single-line="false">
          <tbody>
            <tr>
              <td style="width: 20%;" class="tdcenter">项目信息表*</td>
              <td class="tdleft">
                <sitc-attachment status="edit" title="项目信息表" :linkPackage="true" :files="files1"></sitc-attachment>
              </td>
            </tr>
            <tr>
              <td style="width: 20%;" class="tdcenter">领购人名单</td>
              <td class="tdleft">
                <sitc-attachment status="edit" title="领购人名单" :linkPackage="true" :files="files1"></sitc-attachment>
              </td>
            </tr>
            <tr>
              <td style="width: 20%;" class="tdcenter">代理协议</td>
              <td class="tdleft">
                <sitc-attachment status="edit" title="代理协议" :linkPackage="true" :files="files1"></sitc-attachment>
              </td>
            </tr>
            <tr>
              <td style="width: 20%;" class="tdcenter">方案征集合同*</td>
              <td class="tdleft">
                <sitc-attachment status="edit" title="方案征集合同" :linkPackage="true" :files="files1"></sitc-attachment>
              </td>
            </tr>
            <tr>
              <td style="width: 20%;" class="tdcenter">书面情况报告*</td>
              <td class="tdleft">
                <sitc-attachment status="edit" title="书面情况报告" :linkPackage="true" :files="files1"></sitc-attachment>
              </td>
            </tr>
            <tr>
              <td style="width: 20%;" class="tdcenter">最终设计成果(电子版)*</td>
              <td class="tdleft">
                <sitc-attachment status="edit" title="最终设计成果(电子版)" :linkPackage="true"
                  :files="files1"></sitc-attachment>
              </td>
            </tr>
            <tr>
              <td style="width: 20%;" class="tdcenter">工作计划或策划</td>
              <td class="tdleft">
                <sitc-attachment status="edit" title="工作计划或策划" :linkPackage="true" :files="files1"></sitc-attachment>
              </td>
            </tr>
            <tr>
              <td style="width: 20%;" class="tdcenter">资格预审文件</td>
              <td class="tdleft">
                <sitc-attachment status="edit" title="资格预审文件" :linkPackage="true" :files="files1"></sitc-attachment>
              </td>
            </tr>
            <tr>
              <td style="width: 20%;" class="tdcenter">评审结果通知</td>
              <td class="tdleft">
                <sitc-attachment status="edit" title="评审结果通知" :linkPackage="true" :files="files1"></sitc-attachment>
              </td>
            </tr>
            <tr>
              <td style="width: 20%;" class="tdcenter">其他拟保存资料</td>
              <td class="tdleft">
                <sitc-attachment status="edit" title="其他拟保存资料" :linkPackage="true" :files="files1"></sitc-attachment>
              </td>
            </tr>
          </tbody>
        </n-table>
      </n-gi>
    </n-grid>
  </n-form>
</template>

<script setup>
  import {
    ref,
    defineComponent
  } from "vue"
  import sitcAttachment from '@/apps/common/attachment/SITCAttachment.vue'

  const data = ref({
    fno: '2207040001',
    fname: '金桥副中心中央公园综合体国际方案征集',
    fmanager: '胡欣欢',
    time: '打包日期:2023-09-12'
  });

  const files1 = ref([{
    fName: "回执资格预审公告.pdf",
    fCreateTime: "2023-08-23",
    tooltip: "此处显示关联包件"
  }, {
    fName: "资格预审公告(服务平台,章).pdf",
    fCreateTime: "2023-08-23",
    tooltip: "此处显示关联包件"
  }, {
    fName: "回执资格预审结果公告.pdf",
    fCreateTime: "2023-08-23",
    tooltip: "此处显示关联包件"
  }, {
    fName: "资格预审公告(外网).pdf",
    fCreateTime: "2023-08-23",
    tooltip: "此处显示关联包件"
  }, {
    fName: "资格预审结果公告(服务平台, 章).pdf",
    fCreateTime: "2023-08-23",
    tooltip: "此处显示关联包件"
  }, {
    fName: "资格预审结果公告(外网, 章).pdf",
    fCreateTime: "2023-08-23",
    tooltip: "此处显示关联包件"
  }]) /* 附件数据（suffix:后缀名，fName:文件名，fCreateTime:创建时间） */
</script>

<style>
  .tdcenter {
    text-align: center
  }

  .tdleft {
    text-align: left
  }
</style>
